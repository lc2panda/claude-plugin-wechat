#!/usr/bin/env bun
/**
 * Input: Feishu/Lark messages via SDK WebSocket + ACP agent responses
 * Output: Feishu/Lark replies via REST API
 * Pos: ACP bridge — connects Feishu/Lark to any ACP-compatible AI agent
 *
 * Uses Agent Client Protocol (ACP) for persistent agent sessions.
 * Each Feishu user gets a dedicated agent subprocess with session continuity.
 * State lives in ~/.claude/channels/feishu/
 */

import { randomBytes } from 'crypto'
import {
  readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync,
  statSync, renameSync,
} from 'fs'
import fs from 'node:fs'
import { homedir } from 'os'
import { join } from 'path'
import { spawn, type ChildProcess } from 'node:child_process'
import { Writable, Readable } from 'node:stream'
import * as acp from '@agentclientprotocol/sdk'
import * as Lark from '@larksuiteoapi/node-sdk'

// --- State directories ---

const STATE_DIR = join(homedir(), '.claude', 'channels', 'feishu')
const ACCESS_FILE = join(STATE_DIR, 'access.json')
const APPROVED_DIR = join(STATE_DIR, 'approved')
const CREDENTIALS_FILE = join(STATE_DIR, 'credentials.json')
const INBOX_DIR = join(STATE_DIR, 'inbox')
const DEBUG_MODE_FILE = join(STATE_DIR, 'debug-mode.json')
const USER_CWD_FILE = join(STATE_DIR, 'user-cwd.json')

// --- ACP Agent configuration ---

// Backward compatible: try new package name first, fall back to old name for older installations.
const AGENT_PRESETS: Record<string, { command: string; args: string[] }> = {
  claude:   { command: 'npx', args: ['@agentclientprotocol/claude-agent-acp'] },
  copilot:  { command: 'npx', args: ['@github/copilot', '--acp', '--yolo'] },
  gemini:   { command: 'npx', args: ['@google/gemini-cli', '--experimental-acp'] },
  qwen:     { command: 'npx', args: ['@qwen-code/qwen-code', '--acp', '--experimental-skills'] },
  codex:    { command: 'npx', args: ['@zed-industries/codex-acp'] },
  opencode: { command: 'npx', args: ['opencode-ai', 'acp'] },
}

const agentName = process.env.ACP_AGENT ?? 'claude'
const preset = AGENT_PRESETS[agentName]
const AGENT_COMMAND = process.env.ACP_AGENT_COMMAND ?? preset?.command ?? agentName
const AGENT_ARGS = process.env.ACP_AGENT_ARGS
  ? process.env.ACP_AGENT_ARGS.split(' ').filter(Boolean)
  : preset?.args ?? []

// Parse CLI arguments
const cliArgs = process.argv.slice(2)
let defaultCwd = process.env.ACP_AGENT_CWD ?? process.cwd()
for (let i = 0; i < cliArgs.length; i++) {
  if (cliArgs[i] === '--cwd' && cliArgs[i + 1]) {
    defaultCwd = cliArgs[i + 1]
    i++
  } else if (cliArgs[i]?.startsWith('--cwd=')) {
    defaultCwd = cliArgs[i].split('=')[1]
  }
}

const AGENT_CWD = defaultCwd
const AGENT_ENV: Record<string, string> = (() => {
  const raw = process.env.ACP_AGENT_ENV ?? ''
  if (!raw) return {}
  try { return JSON.parse(raw) } catch { return {} }
})()
const MAX_CONCURRENT_USERS = parseInt(process.env.ACP_MAX_USERS ?? '10', 10)
const IDLE_TIMEOUT_MS = parseInt(process.env.ACP_IDLE_TIMEOUT ?? '86400000', 10)

// --- Debug mode ---

function isDebugMode(): boolean {
  try { return JSON.parse(readFileSync(DEBUG_MODE_FILE, 'utf8')).enabled === true } catch { return false }
}

function setDebugMode(enabled: boolean): void {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 })
  const tmp = DEBUG_MODE_FILE + '.tmp'
  writeFileSync(tmp, JSON.stringify({ enabled }, null, 2) + '\n', { mode: 0o600 })
  renameSync(tmp, DEBUG_MODE_FILE)
}

// --- Load credentials ---

type Credentials = {
  appId: string
  appSecret: string
  domain?: 'feishu' | 'lark'
}

function loadCredentials(): Credentials | null {
  try {
    return JSON.parse(readFileSync(CREDENTIALS_FILE, 'utf8'))
  } catch {
    return null
  }
}

const creds = loadCredentials()

if (!creds?.appId || !creds?.appSecret) {
  process.stderr.write(
    `feishu acp-bridge: credentials required\n` +
    `  run /feishu:configure in Claude Code to set app_id and app_secret\n`,
  )
  process.exit(1)
}

const DOMAIN = creds.domain === 'lark' ? Lark.Domain.Lark : Lark.Domain.Feishu

// --- Feishu SDK client ---

const larkClient = new Lark.Client({
  appId: creds.appId,
  appSecret: creds.appSecret,
  domain: DOMAIN,
  appType: Lark.AppType.SelfBuild,
})

// --- Types ---

type PendingEntry = {
  senderId: string
  createdAt: number
  expiresAt: number
  replies: number
}

type Access = {
  dmPolicy: 'pairing' | 'allowlist' | 'disabled'
  allowFrom: string[]
  pending: Record<string, PendingEntry>
  textChunkLimit?: number
}

function defaultAccess(): Access {
  return { dmPolicy: 'pairing', allowFrom: [], pending: {} }
}

const MAX_CHUNK_LIMIT = 2000
const knownUsers = new Set<string>()
const userChatMap = new Map<string, string>()

// --- Per-user working directory ---

const userCwdMap = new Map<string, string>(
  (() => {
    try {
      const data = JSON.parse(readFileSync(USER_CWD_FILE, 'utf8'))
      return Object.entries(data) as [string, string][]
    } catch {
      return []
    }
  })()
)

function persistUserCwd(): void {
  try {
    mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 })
    const obj = Object.fromEntries(userCwdMap)
    const tmp = USER_CWD_FILE + '.tmp'
    writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n', { mode: 0o600 })
    renameSync(tmp, USER_CWD_FILE)
  } catch {}
}

function getUserCwd(userId: string): string {
  return userCwdMap.get(userId) ?? AGENT_CWD
}

// --- Access control (same as Channel mode) ---

function readAccessFile(): Access {
  try {
    const raw = readFileSync(ACCESS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return { dmPolicy: parsed.dmPolicy ?? 'pairing', allowFrom: parsed.allowFrom ?? [], pending: parsed.pending ?? {}, textChunkLimit: parsed.textChunkLimit }
  } catch {
    return defaultAccess()
  }
}

function loadAccess(): Access { return readAccessFile() }

function saveAccess(a: Access): void {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 })
  const tmp = ACCESS_FILE + '.tmp'
  writeFileSync(tmp, JSON.stringify(a, null, 2) + '\n', { mode: 0o600 })
  renameSync(tmp, ACCESS_FILE)
}

function pruneExpired(a: Access): boolean {
  const now = Date.now()
  let changed = false
  for (const [code, p] of Object.entries(a.pending)) {
    if (p.expiresAt < now) { delete a.pending[code]; changed = true }
  }
  return changed
}

type GateResult = { action: 'deliver'; access: Access } | { action: 'drop' } | { action: 'pair'; code: string; isResend: boolean }

function gate(senderId: string): GateResult {
  const access = loadAccess()
  const pruned = pruneExpired(access)
  if (pruned) saveAccess(access)
  if (!senderId) return { action: 'drop' }
  if (access.dmPolicy === 'disabled') return { action: 'drop' }
  if (access.allowFrom.includes(senderId)) return { action: 'deliver', access }
  if (access.dmPolicy === 'allowlist') return { action: 'drop' }
  for (const [code, p] of Object.entries(access.pending)) {
    if (p.senderId === senderId) {
      if ((p.replies ?? 1) >= 2) return { action: 'drop' }
      p.replies = (p.replies ?? 1) + 1
      saveAccess(access)
      return { action: 'pair', code, isResend: true }
    }
  }
  if (Object.keys(access.pending).length >= 3) return { action: 'drop' }
  const code = randomBytes(3).toString('hex')
  const now = Date.now()
  access.pending[code] = { senderId, createdAt: now, expiresAt: now + 3600000, replies: 1 }
  saveAccess(access)
  return { action: 'pair', code, isResend: false }
}

// Approval polling
function checkApprovals(): void {
  let files: string[]
  try { files = readdirSync(APPROVED_DIR) } catch { return }
  if (!files.length) return
  const access = loadAccess()
  for (const f of files) {
    const userId = f.trim()
    if (userId && !access.allowFrom.includes(userId)) access.allowFrom.push(userId)
    try { rmSync(join(APPROVED_DIR, f)) } catch {}
  }
  saveAccess(access)
}
const approvalTimer = setInterval(checkApprovals, 3000)
approvalTimer.unref()

// --- Feishu message sending ---

async function sendTextMessage(chatId: string, text: string): Promise<void> {
  await larkClient.im.v1.message.create({
    params: { receive_id_type: 'chat_id' },
    data: { receive_id: chatId, content: JSON.stringify({ text }), msg_type: 'text' },
  })
}

// --- Text utilities ---

function markdownToPlaintext(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/, '').replace(/\n?```$/, ''))
    .replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1').replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1').replace(/`(.+?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '').replace(/^[-*+]\s+/gm, '• ')
    .replace(/^>\s+/gm, '').replace(/\n{3,}/g, '\n\n').trim()
}

function chunk(text: string, limit: number): string[] {
  if (text.length <= limit) return [text]
  const out: string[] = []
  let rest = text
  while (rest.length > limit) {
    const para = rest.lastIndexOf('\n\n', limit)
    const line = rest.lastIndexOf('\n', limit)
    const space = rest.lastIndexOf(' ', limit)
    const cut = para > limit / 2 ? para : line > limit / 2 ? line : space > 0 ? space : limit
    out.push(rest.slice(0, cut))
    rest = rest.slice(cut).replace(/^\n+/, '')
  }
  if (rest) out.push(rest)
  return out
}

// --- ACP Client ---

class FeishuAcpClient implements acp.Client {
  private chunks: string[] = []
  private logFn: (msg: string) => void

  constructor(opts: { log: (msg: string) => void }) {
    this.logFn = opts.log
  }

  async requestPermission(params: acp.RequestPermissionRequest): Promise<acp.RequestPermissionResponse> {
    const allowOpt = params.options.find(o => o.kind === 'allow_once' || o.kind === 'allow_always')
    const optionId = allowOpt?.optionId ?? params.options[0]?.optionId ?? 'allow'
    this.logFn(`[permission] auto-allowed: ${params.toolCall?.title ?? 'unknown'} → ${optionId}`)
    return { outcome: { outcome: 'selected', optionId } }
  }

  async sessionUpdate(params: acp.SessionNotification): Promise<void> {
    const update = params.update
    switch (update.sessionUpdate) {
      case 'agent_message_chunk':
        if (update.content.type === 'text') this.chunks.push(update.content.text)
        break
      case 'tool_call':
        this.logFn(`[tool] ${update.title} (${update.status})`)
        break
      case 'tool_call_update':
        if (update.status === 'completed' && update.content) {
          for (const c of update.content) {
            if (c.type === 'diff') {
              const diff = c as acp.Diff
              const lines: string[] = [`--- ${diff.path}`]
              if (diff.oldText != null) for (const l of diff.oldText.split('\n')) lines.push(`- ${l}`)
              if (diff.newText != null) for (const l of diff.newText.split('\n')) lines.push(`+ ${l}`)
              this.chunks.push('\n```diff\n' + lines.join('\n') + '\n```\n')
            }
          }
        }
        break
    }
  }

  async readTextFile(params: acp.ReadTextFileRequest): Promise<acp.ReadTextFileResponse> {
    const content = await fs.promises.readFile(params.path, 'utf-8')
    return { content }
  }

  async writeTextFile(params: acp.WriteTextFileRequest): Promise<acp.WriteTextFileResponse> {
    await fs.promises.writeFile(params.path, params.content, 'utf-8')
    return {}
  }

  flush(): string {
    const text = this.chunks.join('')
    this.chunks = []
    return text
  }
}

// --- ACP session management ---

type UserSession = {
  userId: string
  chatId: string
  client: FeishuAcpClient
  process: ChildProcess
  connection: acp.ClientSideConnection
  sessionId: string
  queue: Array<{ prompt: acp.ContentBlock[]; chatId: string }>
  processing: boolean
  lastActivity: number
}

const userSessions = new Map<string, UserSession>()

// Idle cleanup
const cleanupTimer = setInterval(() => {
  if (IDLE_TIMEOUT_MS <= 0) return
  const now = Date.now()
  for (const [userId, session] of userSessions) {
    if (now - session.lastActivity > IDLE_TIMEOUT_MS && !session.processing) {
      process.stderr.write(`feishu acp-bridge: session for ${userId} idle, removing\n`)
      if (!session.process.killed) session.process.kill('SIGTERM')
      userSessions.delete(userId)
    }
  }
}, 2 * 60_000)
cleanupTimer.unref()

function evictOldestSession(): void {
  let oldest: { userId: string; lastActivity: number } | null = null
  for (const [uid, s] of userSessions) {
    if (!s.processing && (!oldest || s.lastActivity < oldest.lastActivity))
      oldest = { userId: uid, lastActivity: s.lastActivity }
  }
  if (oldest) {
    const s = userSessions.get(oldest.userId)
    if (s && !s.process.killed) s.process.kill('SIGTERM')
    userSessions.delete(oldest.userId)
  }
}

async function createSession(userId: string, chatId: string): Promise<UserSession> {
  process.stderr.write(`feishu acp-bridge: creating session for ${userId}\n`)
  const client = new FeishuAcpClient({
    log: (msg) => process.stderr.write(`feishu acp-bridge [${userId}]: ${msg}\n`),
  })

  const useShell = process.platform === 'win32'
  const proc = spawn(AGENT_COMMAND, AGENT_ARGS, {
    stdio: ['pipe', 'pipe', 'inherit'],
    cwd: getUserCwd(userId),
    env: { ...process.env, ...AGENT_ENV },
    shell: useShell,
  })
  proc.on('error', (err) => process.stderr.write(`feishu acp-bridge [${userId}]: agent error: ${err}\n`))

  if (!proc.stdin || !proc.stdout) { proc.kill(); throw new Error('Failed to get agent stdio') }

  // Wait briefly to detect immediate crash (e.g. missing API key, bad binary)
  await new Promise(resolve => setTimeout(resolve, 500))
  if (proc.exitCode !== null) {
    throw new Error(`Agent process exited immediately (code ${proc.exitCode}). Check that ANTHROPIC_API_KEY is set and the agent command is valid.`)
  }

  // Manual Web Stream wrappers (Bun's Writable.toWeb crashes on Windows — Issue #16087)
  const input = new WritableStream({
    write(chunk) { return new Promise<void>((resolve, reject) => { proc.stdin!.write(chunk, (err) => err ? reject(err) : resolve()) }) },
    close() { proc.stdin!.end() },
    abort() { proc.stdin!.destroy() },
  })
  const output = new ReadableStream<Uint8Array>({
    start(controller) {
      proc.stdout!.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)))
      proc.stdout!.on('end', () => controller.close())
      proc.stdout!.on('error', (err) => controller.error(err))
    },
  })
  const stream = acp.ndJsonStream(input, output)
  const connection = new acp.ClientSideConnection(() => client, stream)

  // Initialize ACP (with 30s timeout to prevent npx download hanging)
  const ACP_INIT_TIMEOUT_MS = 30_000
  const initResult = await Promise.race([
    connection.initialize({
      protocolVersion: acp.PROTOCOL_VERSION,
      clientInfo: { name: 'feishu-acp-bridge', title: 'Feishu ACP Bridge', version: '1.0.0' },
      clientCapabilities: { fs: { readTextFile: true, writeTextFile: true } },
    }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`ACP initialization timed out after ${ACP_INIT_TIMEOUT_MS / 1000}s — agent may be downloading dependencies`)), ACP_INIT_TIMEOUT_MS)),
  ])

  const sessionResult = await connection.newSession({ cwd: getUserCwd(userId), mcpServers: [] })

  const session: UserSession = {
    userId, chatId, client, process: proc, connection,
    sessionId: sessionResult.sessionId, queue: [], processing: false, lastActivity: Date.now(),
  }

  // Clean up on stream error (detect broken pipe before next write)
  proc.stdin!.on('error', () => {
    process.stderr.write(`feishu acp-bridge [${userId}]: stdin stream error, cleaning session\n`)
    const s = userSessions.get(userId)
    if (s?.process === proc) userSessions.delete(userId)
  })
  proc.on('exit', (code, signal) => {
    process.stderr.write(`feishu acp-bridge [${userId}]: agent exited code=${code} signal=${signal}\n`)
    const s = userSessions.get(userId)
    if (s?.process === proc) userSessions.delete(userId)
  })

  userSessions.set(userId, session)
  return session
}

async function processQueue(session: UserSession): Promise<void> {
  try {
    while (session.queue.length > 0 && !shuttingDown) {
      const pending = session.queue.shift()!
      session.client.flush()

      try {
        const result = await session.connection.prompt({
          sessionId: session.sessionId,
          prompt: pending.prompt,
        })

        let replyText = session.client.flush()
        if (result.stopReason === 'cancelled') replyText += '\n[cancelled]'
        else if (result.stopReason === 'refusal') replyText += '\n[agent refused]'

        if (replyText.trim()) {
          const plainText = markdownToPlaintext(replyText)
          const access = loadAccess()
          const limit = Math.max(1, Math.min(access.textChunkLimit ?? MAX_CHUNK_LIMIT, MAX_CHUNK_LIMIT))
          const chunks = chunk(plainText, limit)
          for (const c of chunks) {
            await sendTextMessage(pending.chatId, c)
          }
        }
      } catch (err) {
        process.stderr.write(`feishu acp-bridge [${session.userId}]: prompt error: ${err}\n`)
        if (session.process.killed || session.process.exitCode !== null) {
          userSessions.delete(session.userId)
          return
        }
        try { await sendTextMessage(pending.chatId, `⚠️ Agent error: ${err instanceof Error ? err.message : JSON.stringify(err)}`) } catch {}
      }
    }
  } finally {
    session.processing = false
  }
}

async function enqueueMessage(userId: string, chatId: string, promptBlocks: acp.ContentBlock[]): Promise<void> {
  let session = userSessions.get(userId)
  if (!session || session.process.killed || session.process.exitCode !== null) {
    if (userSessions.has(userId)) userSessions.delete(userId)
    if (userSessions.size >= MAX_CONCURRENT_USERS) evictOldestSession()
    const MAX_RETRIES = 2
    let lastErr: unknown
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        session = await createSession(userId, chatId)
        break
      } catch (err) {
        lastErr = err
        process.stderr.write(`feishu acp-bridge [${userId}]: session creation failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}): ${err instanceof Error ? err.message : JSON.stringify(err)}\n`)
        if (attempt < MAX_RETRIES) {
          await Bun.sleep(1000 * (attempt + 1))
          continue
        }
      }
    }
    if (!session) {
      try {
        await sendTextMessage(chatId,
          `⚠️ Agent 启动失败（重试 ${MAX_RETRIES + 1} 次）: ${lastErr instanceof Error ? lastErr.message : JSON.stringify(lastErr)}\n\n` +
          `常见原因：\n` +
          `1. 未安装 Node.js/npx\n` +
          `2. npx @agentclientprotocol/claude-agent-acp 下载超时\n` +
          `3. 未设置 ANTHROPIC_API_KEY\n\n` +
          `请检查终端输出的完整错误信息`)
      } catch {}
      return
    }
  }
  session.chatId = chatId
  session.lastActivity = Date.now()
  session.queue.push({ prompt: promptBlocks, chatId })
  if (!session.processing) {
    session.processing = true
    processQueue(session).catch((err) => process.stderr.write(`feishu acp-bridge [${userId}]: queue error: ${err}\n`))
  }
}

// --- Inbound handler ---

function extractText(data: any): string {
  const msg = data.message
  if (!msg) return ''
  const msgType = msg.message_type
  const content = msg.content ? JSON.parse(msg.content) : {}
  switch (msgType) {
    case 'text': return content.text ?? ''
    case 'post': {
      const lines: string[] = content.title ? [content.title] : []
      for (const para of content.content ?? []) {
        for (const node of para ?? []) {
          if (node.tag === 'text') lines.push(node.text ?? '')
          else if (node.tag === 'a') lines.push(node.text ?? node.href ?? '')
        }
      }
      return lines.join(' ').trim()
    }
    default: return `[${msgType} message]`
  }
}

async function handleInbound(data: any): Promise<void> {
  const sender = data.sender
  const msg = data.message
  if (!sender || !msg) return

  const senderId = sender.sender_id?.open_id ?? ''
  const chatId = msg.chat_id ?? ''
  if (!senderId) return

  userChatMap.set(senderId, chatId)

  // Group chat: only respond when @mentioned
  if ((msg.chat_type ?? 'p2p') === 'group') {
    const mentions = msg.mentions ?? []
    if (!mentions.some((m: any) => m.id?.open_id === creds.appId || m.name === 'bot')) return
  }

  const result = gate(senderId)
  if (result.action === 'drop') return

  if (result.action === 'pair') {
    const lead = result.isResend ? '仍在等待配对' : '需要配对验证'
    try {
      await sendTextMessage(chatId, `${lead} — 在 Claude Code 终端运行：\n\n/feishu:access pair ${result.code}`)
    } catch {}
    return
  }

  knownUsers.add(senderId)
  const text = extractText(data)
  if (!text) return

  // Commands
  if (text === '/toggle-debug') {
    setDebugMode(!isDebugMode())
    try { await sendTextMessage(chatId, `Debug 模式已${isDebugMode() ? '开启' : '关闭'}`) } catch {}
    return
  }
  if (text.startsWith('/echo ')) {
    try { await sendTextMessage(chatId, text.slice(6)) } catch {}
    return
  }
  if (text.startsWith('/cwd')) {
    const newCwd = text.slice(4).trim()
    if (!newCwd) {
      try { await sendTextMessage(chatId, `当前工作目录: ${getUserCwd(senderId)}`) } catch {}
      return
    }
    try {
      if (!statSync(newCwd).isDirectory()) {
        await sendTextMessage(chatId, `❌ 路径不是目录: ${newCwd}`)
        return
      }
    } catch {
      try { await sendTextMessage(chatId, `❌ 目录不存在: ${newCwd}`) } catch {}
      return
    }
    userCwdMap.set(senderId, newCwd)
    persistUserCwd()
    const s = userSessions.get(senderId)
    if (s) { if (!s.process.killed) s.process.kill('SIGTERM'); userSessions.delete(senderId) }
    try { await sendTextMessage(chatId, `✅ 工作目录已切换: ${newCwd}`) } catch {}
    return
  }

  await enqueueMessage(senderId, chatId, [{ type: 'text', text }])
}

// --- Start WebSocket ---

const wsClient = new Lark.WSClient({
  appId: creds.appId,
  appSecret: creds.appSecret,
  domain: DOMAIN,
  loggerLevel: Lark.LoggerLevel.info,
})

wsClient.start({
  eventDispatcher: new Lark.EventDispatcher({}).register({
    'im.message.receive_v1': async (data: any) => {
      try { await handleInbound(data) } catch (err) {
        process.stderr.write(`feishu acp-bridge: handler error: ${err}\n`)
      }
    },
  }),
})

process.stderr.write(`feishu acp-bridge: started (ACP mode, agent=${AGENT_COMMAND} ${AGENT_ARGS.join(' ')}, domain=${creds.domain ?? 'feishu'})\n`)

// --- Graceful shutdown ---

let shuttingDown = false

function shutdown(reason: string): void {
  if (shuttingDown) return
  shuttingDown = true
  process.stderr.write(`feishu acp-bridge: shutting down (${reason})\n`)

  for (const [uid, s] of userSessions) {
    if (!s.process.killed) {
      s.process.kill('SIGTERM')
      // Force kill after 5s if still alive (prevents zombie processes on Windows)
      setTimeout(() => {
        if (!s.process.killed) s.process.kill('SIGKILL')
      }, 5_000).unref()
    }
  }
  userSessions.clear()
  clearInterval(cleanupTimer)
  clearInterval(approvalTimer)

  setTimeout(() => process.exit(0), 500)
}

process.stdin.on('end', () => shutdown('stdin EOF'))
process.stdin.on('error', () => shutdown('stdin error'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('unhandledRejection', (err) => process.stderr.write(`feishu acp-bridge: unhandled rejection: ${err}\n`))
process.on('uncaughtException', (err) => { process.stderr.write(`feishu acp-bridge: uncaught exception: ${err}\n`); shutdown('uncaughtException') })
