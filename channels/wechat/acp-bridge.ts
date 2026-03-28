#!/usr/bin/env bun
/**
 * Input: WeChat messages via iLink Bot API + ACP agent responses
 * Output: WeChat replies via iLink Bot API
 * Pos: ACP bridge — connects WeChat to any ACP-compatible AI agent (Claude Code, Copilot, Gemini, Codex, etc.)
 *
 * Uses Agent Client Protocol (ACP) for persistent agent sessions.
 * Each WeChat user gets a dedicated agent subprocess with session continuity.
 * State lives in ~/.claude/channels/wechat/
 */

import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import {
  readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync,
  statSync, renameSync, realpathSync,
} from 'fs'
import fs from 'node:fs'
import { homedir } from 'os'
import { join, sep } from 'path'
import { spawn, type ChildProcess } from 'node:child_process'
import { Writable, Readable } from 'node:stream'
import * as acp from '@agentclientprotocol/sdk'

// --- State directories ---

// Migrate state from old 'weixin' dir to 'wechat' if needed
const OLD_STATE_DIR = join(homedir(), '.claude', 'channels', 'weixin')
const STATE_DIR = join(homedir(), '.claude', 'channels', 'wechat')
try {
  const { existsSync } = await import('fs')
  if (existsSync(OLD_STATE_DIR) && !existsSync(STATE_DIR)) {
    renameSync(OLD_STATE_DIR, STATE_DIR)
    process.stderr.write('wechat acp-bridge: migrated state from channels/weixin to channels/wechat\n')
  }
} catch {}
const ACCESS_FILE = join(STATE_DIR, 'access.json')
const APPROVED_DIR = join(STATE_DIR, 'approved')
const CREDENTIALS_FILE = join(STATE_DIR, 'credentials.json')
const SYNC_BUF_FILE = join(STATE_DIR, 'sync_buf.txt')
const CONTEXT_TOKENS_FILE = join(STATE_DIR, 'context-tokens.json')
const INBOX_DIR = join(STATE_DIR, 'inbox')
const USER_CWD_FILE = join(STATE_DIR, 'user-cwd.json')
const CDN_BASE = 'https://novac2c.cdn.weixin.qq.com'
const DEBUG_MODE_FILE = join(STATE_DIR, 'debug-mode.json')

// --- ACP Agent configuration ---

// Built-in agent presets (matching wechat-acp convention)
// Claude Code CLI does NOT natively speak ACP — it needs the @zed-industries/claude-code-acp wrapper.
const AGENT_PRESETS: Record<string, { command: string; args: string[] }> = {
  claude:   { command: 'npx', args: ['@zed-industries/claude-code-acp'] },
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
let forceLogin = false
for (let i = 0; i < cliArgs.length; i++) {
  if (cliArgs[i] === '--cwd' && cliArgs[i + 1]) {
    defaultCwd = cliArgs[i + 1]
    i++
  } else if (cliArgs[i]?.startsWith('--cwd=')) {
    defaultCwd = cliArgs[i].split('=')[1]
  } else if (cliArgs[i] === '--login') {
    forceLogin = true
  }
}

const AGENT_CWD = defaultCwd
const AGENT_ENV: Record<string, string> = (() => {
  const raw = process.env.ACP_AGENT_ENV ?? ''
  if (!raw) return {}
  try { return JSON.parse(raw) } catch { return {} }
})()
const MAX_CONCURRENT_USERS = parseInt(process.env.ACP_MAX_USERS ?? '10', 10)
const IDLE_TIMEOUT_MS = parseInt(process.env.ACP_IDLE_TIMEOUT ?? '86400000', 10) // 24h default

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
  token: string
  baseUrl: string
  userId?: string
  accountId?: string
}

function loadCredentials(): Credentials | null {
  try {
    return JSON.parse(readFileSync(CREDENTIALS_FILE, 'utf8'))
  } catch {
    return null
  }
}

// --- Inline QR login flow ---

const WECHAT_BASE = 'https://ilinkai.weixin.qq.com/'
const QR_POLL_INTERVAL_MS = 3000
const QR_TIMEOUT_MS = 5 * 60_000
const MAX_QR_REFRESHES = 3

function saveCredentials(data: any): void {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 })
  const tmp = CREDENTIALS_FILE + '.tmp'
  writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n', { mode: 0o600 })
  renameSync(tmp, CREDENTIALS_FILE)
}

function addToAllowlist(userId: string): void {
  let access: any
  try {
    access = JSON.parse(readFileSync(ACCESS_FILE, 'utf8'))
  } catch {
    access = { dmPolicy: 'pairing', allowFrom: [], pending: {} }
  }
  if (!access.allowFrom) access.allowFrom = []
  if (!access.allowFrom.includes(userId)) {
    access.allowFrom.push(userId)
  }
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 })
  const tmp = ACCESS_FILE + '.tmp'
  writeFileSync(tmp, JSON.stringify(access, null, 2) + '\n', { mode: 0o600 })
  renameSync(tmp, ACCESS_FILE)
}

async function interactiveLogin(): Promise<Credentials> {
  process.stderr.write('\n=== WeChat QR Login / 微信扫码登录 ===\n\n')

  // Step 1: Fetch QR code
  const qrRes = await fetch(`${WECHAT_BASE}ilink/bot/get_bot_qrcode?bot_type=3`)
  if (!qrRes.ok) {
    process.stderr.write(`Failed to get QR code: ${qrRes.status}\n`)
    process.exit(1)
  }
  const qrData = await qrRes.json() as any
  let currentQrcode: string = qrData.qrcode
  const qrUrl: string = qrData.qrcode_img_content

  // Render QR in terminal
  const qt = (await import('qrcode-terminal')).default
  qt.generate(qrUrl, { small: true })
  process.stderr.write('\nScan with WeChat, confirm on phone.\n用微信扫描上方二维码，手机确认。\n\n')

  // Step 2: Poll for status
  let refreshCount = 0
  let deadline = Date.now() + QR_TIMEOUT_MS
  let scannedShown = false

  while (Date.now() < deadline) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 35000)
    let resp: any
    try {
      const res = await fetch(
        `${WECHAT_BASE}ilink/bot/get_qrcode_status?qrcode=${encodeURIComponent(currentQrcode)}`,
        { signal: controller.signal },
      )
      clearTimeout(timer)
      if (!res.ok) throw new Error(`poll failed: ${res.status}`)
      resp = await res.json()
    } catch (err: any) {
      clearTimeout(timer)
      if (err?.name === 'AbortError') {
        resp = { status: 'wait' }
      } else {
        throw err
      }
    }

    switch (resp.status) {
      case 'wait':
        break

      case 'scaned':
        if (!scannedShown) {
          process.stderr.write('Scanned! Confirm on phone... / 已扫描，请在手机上确认...\n')
          scannedShown = true
        }
        break

      case 'expired': {
        if (refreshCount >= MAX_QR_REFRESHES) {
          process.stderr.write('QR expired, max retries reached. / 二维码已过期，超过最大重试次数。\n')
          process.exit(1)
        }
        refreshCount++
        process.stderr.write(`QR expired, refreshing (${refreshCount}/${MAX_QR_REFRESHES})... / 二维码过期，自动刷新...\n`)
        try {
          const refreshRes = await fetch(`${WECHAT_BASE}ilink/bot/get_bot_qrcode?bot_type=3`)
          if (!refreshRes.ok) { process.stderr.write('Failed to refresh QR.\n'); process.exit(1) }
          const refreshData = await refreshRes.json() as any
          currentQrcode = refreshData.qrcode
          const newUrl = refreshData.qrcode_img_content
          qt.generate(newUrl, { small: true })
          process.stderr.write('\nScan the new QR code. / 请扫描新二维码。\n\n')
        } catch {
          process.stderr.write('Failed to refresh QR.\n')
          process.exit(1)
        }
        scannedShown = false
        deadline = Date.now() + QR_TIMEOUT_MS
        break
      }

      case 'confirmed': {
        const creds: Credentials = {
          token: resp.bot_token,
          baseUrl: resp.baseurl ?? WECHAT_BASE,
          accountId: resp.ilink_bot_id,
          userId: resp.ilink_user_id,
        }
        saveCredentials(creds)
        if (creds.userId) addToAllowlist(creds.userId)
        process.stderr.write('\n✅ Login successful! / 登录成功！\n\n')
        return creds
      }
    }

    await Bun.sleep(QR_POLL_INTERVAL_MS)
  }

  process.stderr.write('Login timeout. / 登录超时。\n')
  process.exit(1)
}

// --- Load or acquire credentials ---

let creds = forceLogin ? null : loadCredentials()

if (!creds?.token || !creds?.baseUrl) {
  process.stderr.write('wechat-acp: No credentials found, starting login...\n')
  process.stderr.write('wechat-acp: 未检测到登录凭据，开始扫码登录...\n\n')
  creds = await interactiveLogin()
}

const TOKEN = creds.token
const BASE_URL = creds.baseUrl.endsWith('/') ? creds.baseUrl : `${creds.baseUrl}/`

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
  ackText?: string
  textChunkLimit?: number
  humanDelay?: boolean
}

function defaultAccess(): Access {
  return { dmPolicy: 'pairing', allowFrom: [], pending: {} }
}

const MAX_CHUNK_LIMIT = 2000

// Runtime set of allowed from_user_ids for outbound validation.
const knownUsers = new Set<string>()

// Map from_user_id → latest context_token. Required for sending replies.
const contextTokenMap = new Map<string, string>(
  (() => {
    try {
      const data = JSON.parse(readFileSync(CONTEXT_TOKENS_FILE, 'utf8'))
      return Object.entries(data) as [string, string][]
    } catch {
      return []
    }
  })()
)

function persistContextTokens(): void {
  try {
    mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 })
    const obj = Object.fromEntries(contextTokenMap)
    const tmp = CONTEXT_TOKENS_FILE + '.tmp'
    writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n', { mode: 0o600 })
    renameSync(tmp, CONTEXT_TOKENS_FILE)
  } catch (err) {
    process.stderr.write(`wechat acp-bridge: context-tokens persist failed: ${err}\n`)
  }
}

// Debounced persistence - write at most every 5 seconds
let persistTimer: ReturnType<typeof setTimeout> | null = null
function debouncedPersist(): void {
  if (persistTimer) return
  persistTimer = setTimeout(() => {
    persistTimer = null
    persistContextTokens()
  }, 5000)
}

// Per-user working directory overrides
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
  } catch (err) {
    process.stderr.write(`wechat acp-bridge: user-cwd persist failed: ${err}\n`)
  }
}

function getUserCwd(userId: string): string {
  return userCwdMap.get(userId) ?? AGENT_CWD
}

// Map attachment_id → download info for deferred media downloads
const pendingAttachments = new Map<string, { encryptQueryParam: string; aesKeyBase64: string; filename: string }>()

// Typing indicator state
let typingTicket = ''
let typingTicketExpiry = 0

// --- AES-128-ECB crypto (WeChat CDN media encryption) ---

function parseAesKey(rawKey: string): Buffer {
  const decoded = Buffer.from(rawKey, 'base64')
  if (decoded.length === 16) return decoded
  const hexStr = decoded.toString('utf-8')
  if (hexStr.length === 32 && /^[0-9a-fA-F]+$/.test(hexStr)) {
    return Buffer.from(hexStr, 'hex')
  }
  return decoded.subarray(0, 16)
}

function decryptAesEcb(encrypted: Buffer, key: Buffer): Buffer {
  const decipher = createDecipheriv('aes-128-ecb', key, null)
  return Buffer.concat([decipher.update(encrypted), decipher.final()])
}

function encryptAesEcb(plain: Buffer, key: Buffer): Buffer {
  const cipher = createCipheriv('aes-128-ecb', key, null)
  return Buffer.concat([cipher.update(plain), cipher.final()])
}

// --- API helpers ---

function randomWechatUin(): string {
  const uint32 = randomBytes(4).readUInt32BE(0)
  return Buffer.from(String(uint32), 'utf-8').toString('base64')
}

function buildHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'AuthorizationType': 'ilink_bot_token',
    'Authorization': `Bearer ${TOKEN}`,
    'X-WECHAT-UIN': randomWechatUin(),
  }
}

async function apiFetch(endpoint: string, body: object, timeoutMs = 15000): Promise<any> {
  const url = new URL(endpoint, BASE_URL)
  const bodyStr = JSON.stringify(body)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { ...buildHeaders(), 'Content-Length': String(Buffer.byteLength(bodyStr, 'utf-8')) },
      body: bodyStr,
      signal: controller.signal,
    })
    clearTimeout(timer)
    const text = await res.text()
    if (!res.ok) throw new Error(`${endpoint} ${res.status}: ${text}`)
    return JSON.parse(text)
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

async function getUpdates(buf: string, timeoutMs = 35000): Promise<any> {
  try {
    return await apiFetch('ilink/bot/getupdates', {
      get_updates_buf: buf,
      base_info: { channel_version: '1.0.0' },
    }, timeoutMs)
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { ret: 0, msgs: [], get_updates_buf: buf }
    }
    throw err
  }
}

async function sendMessage(to: string, text: string, contextToken: string): Promise<void> {
  const sendResp = await apiFetch('ilink/bot/sendmessage', {
    msg: {
      from_user_id: '',
      to_user_id: to,
      client_id: `claude-wechat-${Date.now()}-${randomBytes(4).toString('hex')}`,
      message_type: 2,
      message_state: 2,
      item_list: [{ type: 1, text_item: { text } }],
      context_token: contextToken,
    },
    base_info: { channel_version: '1.0.0' },
  })
  if (sendResp?.ret === -14 || sendResp?.errcode === -14) {
    throw new Error('session expired — re-login via /wechat:configure login')
  }
}

// --- Typing indicator ---

async function refreshTypingTicket(): Promise<string> {
  if (typingTicket && Date.now() < typingTicketExpiry) return typingTicket
  try {
    const resp = await apiFetch('ilink/bot/getconfig', {
      ilink_user_id: creds.userId ?? '',
      base_info: { channel_version: '1.0.0' },
    })
    if (resp.typing_ticket) {
      typingTicket = resp.typing_ticket
      typingTicketExpiry = Date.now() + 30 * 60 * 1000
    }
  } catch (err) {
    process.stderr.write(`wechat acp-bridge: getconfig failed: ${err}\n`)
  }
  return typingTicket
}

async function sendTyping(toUserId: string, contextToken: string): Promise<void> {
  const ticket = await refreshTypingTicket()
  if (!ticket) return
  try {
    await apiFetch('ilink/bot/sendtyping', {
      ilink_user_id: toUserId,
      typing_ticket: ticket,
      status: 1,
      base_info: { channel_version: '1.0.0' },
    })
  } catch (err) {
    process.stderr.write(`wechat acp-bridge: sendtyping failed: ${err}\n`)
  }
}

async function cancelTyping(toUserId: string): Promise<void> {
  const ticket = await refreshTypingTicket()
  if (!ticket) return
  try {
    await apiFetch('ilink/bot/sendtyping', {
      ilink_user_id: toUserId,
      typing_ticket: ticket,
      status: 2,
      base_info: { channel_version: '1.0.0' },
    })
  } catch {}
}

// --- CDN media upload ---

async function uploadMedia(filePath: string, toUserId: string, mediaType: number = 3): Promise<{ downloadParam: string; aesKeyHex: string; fileSize: number; fileSizeCiphertext: number }> {
  const fileData = readFileSync(filePath)
  const aesKey = randomBytes(16)
  const filekey = randomBytes(16).toString('hex')
  const { createHash } = await import('crypto')
  const rawfilemd5 = createHash('md5').update(fileData).digest('hex')
  const encrypted = encryptAesEcb(fileData, aesKey)

  const uploadResp = await apiFetch('ilink/bot/getuploadurl', {
    filekey,
    media_type: mediaType,
    to_user_id: toUserId,
    rawsize: fileData.length,
    rawfilemd5,
    filesize: encrypted.length,
    no_need_thumb: true,
    aeskey: aesKey.toString('hex'),
    base_info: { channel_version: '1.0.0' },
  })

  if (!uploadResp.upload_param) throw new Error('getuploadurl: no upload_param returned')

  const cdnUploadUrl = `${CDN_BASE}/c2c/upload?encrypted_query_param=${encodeURIComponent(uploadResp.upload_param)}&filekey=${filekey}`

  const MAX_CDN_RETRIES = 3
  let downloadParam = ''
  for (let attempt = 1; attempt <= MAX_CDN_RETRIES; attempt++) {
    const putRes = await fetch(cdnUploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: new Uint8Array(encrypted),
    })
    if (putRes.ok) {
      downloadParam = putRes.headers.get('x-encrypted-param') ?? ''
      if (!downloadParam) throw new Error('CDN upload: missing x-encrypted-param')
      break
    }
    if (putRes.status >= 400 && putRes.status < 500) {
      throw new Error(`CDN upload failed: ${putRes.status}`)
    }
    if (attempt < MAX_CDN_RETRIES) {
      process.stderr.write(`wechat acp-bridge: CDN upload attempt ${attempt} failed (${putRes.status}), retrying...\n`)
      await Bun.sleep(1000 * attempt)
    } else {
      throw new Error(`CDN upload failed after ${MAX_CDN_RETRIES} attempts: ${putRes.status}`)
    }
  }

  return {
    downloadParam,
    aesKeyHex: aesKey.toString('hex'),
    fileSize: fileData.length,
    fileSizeCiphertext: encrypted.length,
  }
}

async function sendMediaMessage(to: string, filePath: string, contextToken: string, mediaType: 'image' | 'video' | 'file' = 'file'): Promise<void> {
  const uploadMediaType = mediaType === 'image' ? 1 : mediaType === 'video' ? 2 : 3
  const upload = await uploadMedia(filePath, to, uploadMediaType)
  const itemType = mediaType === 'image' ? 2 : mediaType === 'video' ? 5 : 4

  const aesKeyBase64 = Buffer.from(upload.aesKeyHex).toString('base64')

  const item: any = { type: itemType }
  if (itemType === 2) {
    item.image_item = {
      media: {
        encrypt_query_param: upload.downloadParam,
        aes_key: aesKeyBase64,
        encrypt_type: 1,
      },
      mid_size: upload.fileSizeCiphertext,
    }
  } else if (itemType === 5) {
    item.video_item = {
      media: {
        encrypt_query_param: upload.downloadParam,
        aes_key: aesKeyBase64,
        encrypt_type: 1,
      },
      video_size: upload.fileSizeCiphertext,
    }
  } else {
    item.file_item = {
      media: {
        encrypt_query_param: upload.downloadParam,
        aes_key: aesKeyBase64,
        encrypt_type: 1,
      },
      file_name: filePath.split('/').pop() ?? 'file',
      len: String(upload.fileSize),
    }
  }

  await apiFetch('ilink/bot/sendmessage', {
    msg: {
      from_user_id: '',
      to_user_id: to,
      client_id: `claude-wechat-${Date.now()}-${randomBytes(4).toString('hex')}`,
      message_type: 2,
      message_state: 2,
      item_list: [item],
      context_token: contextToken,
    },
    base_info: { channel_version: '1.0.0' },
  })
}

// --- Security ---

function assertSendable(f: string): void {
  let real: string, stateReal: string
  try {
    real = realpathSync(f)
    stateReal = realpathSync(STATE_DIR)
  } catch { return }
  if (real.startsWith(stateReal + sep)) {
    throw new Error(`refusing to send channel state: ${f}`)
  }
}

// --- Access persistence ---

function readAccessFile(): Access {
  try {
    const raw = readFileSync(ACCESS_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Partial<Access>
    return {
      dmPolicy: parsed.dmPolicy ?? 'pairing',
      allowFrom: parsed.allowFrom ?? [],
      pending: parsed.pending ?? {},
      ackText: parsed.ackText,
      textChunkLimit: parsed.textChunkLimit,
      humanDelay: parsed.humanDelay,
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return defaultAccess()
    try {
      renameSync(ACCESS_FILE, `${ACCESS_FILE}.corrupt-${Date.now()}`)
    } catch {}
    process.stderr.write(`wechat acp-bridge: access.json is corrupt, moved aside. Starting fresh.\n`)
    return defaultAccess()
  }
}

function loadAccess(): Access {
  return readAccessFile()
}

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
    if (p.expiresAt < now) {
      delete a.pending[code]
      changed = true
    }
  }
  return changed
}

// --- Gate ---

type GateResult =
  | { action: 'deliver'; access: Access }
  | { action: 'drop' }
  | { action: 'pair'; code: string; isResend: boolean }

function gate(senderId: string): GateResult {
  const access = loadAccess()
  const pruned = pruneExpired(access)
  if (pruned) saveAccess(access)

  if (!senderId) return { action: 'drop' }

  if (access.dmPolicy === 'disabled') return { action: 'drop' }
  if (access.allowFrom.includes(senderId)) return { action: 'deliver', access }
  if (access.dmPolicy === 'allowlist') return { action: 'drop' }

  // pairing mode
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
  access.pending[code] = {
    senderId,
    createdAt: now,
    expiresAt: now + 60 * 60 * 1000,
    replies: 1,
  }
  saveAccess(access)
  return { action: 'pair', code, isResend: false }
}

// --- Pairing approval polling ---

function checkApprovals(): void {
  let files: string[]
  try {
    files = readdirSync(APPROVED_DIR)
  } catch { return }
  if (files.length === 0) return

  for (const senderId of files) {
    const file = join(APPROVED_DIR, senderId)
    rmSync(file, { force: true })
  }
}

setInterval(checkApprovals, 5000)

// --- Markdown to plaintext ---

function markdownToPlaintext(md: string): string {
  return md
    .replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(?<!\w)\*([^*]+)\*(?!\w)/g, '$1')
    .replace(/(?<!\w)_([^_]+)_(?!\w)/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '(图片: $2)')
    .replace(/^>\s+/gm, '')
    .replace(/^---+$/gm, '————')
    .replace(/^\*\*\*+$/gm, '————')
    .replace(/^[\s]*[-*+]\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// --- Chunking ---

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

// --- Extract text from message items ---

function resolveImageAesKeyBase64(img: any): string | null {
  if (img.aeskey && typeof img.aeskey === 'string' && /^[0-9a-fA-F]{32}$/.test(img.aeskey)) {
    return Buffer.from(img.aeskey, 'hex').toString('base64')
  }
  if (img.media?.aes_key) return img.media.aes_key
  return null
}

function extractText(msg: any): string {
  const items = msg.item_list ?? []
  const parts: string[] = []
  for (const item of items) {
    if (item.type === 1 && item.text_item?.text) {
      parts.push(item.text_item.text)
      if (item.ref_msg?.message_item) {
        const ref = item.ref_msg.message_item
        const refTitle = item.ref_msg.title ?? ''
        if (ref.text_item?.text) parts.push(`[引用: ${refTitle ? refTitle + ' | ' : ''}${ref.text_item.text}]`)
        if (ref.type === 2 && ref.image_item?.media?.encrypt_query_param) {
          const img = ref.image_item
          const aesKeyB64 = img.aeskey ? Buffer.from(img.aeskey, 'hex').toString('base64') : img.media?.aes_key
          if (aesKeyB64) {
            const id = `ref_img_${Date.now()}_${randomBytes(3).toString('hex')}`
            pendingAttachments.set(id, { encryptQueryParam: img.media.encrypt_query_param, aesKeyBase64: aesKeyB64, filename: 'ref_image.jpg' })
            parts.push(`(referenced image: attachment_id=${id})`)
          }
        }
      }
    } else if (item.type === 2) {
      const img = item.image_item
      const eqp = img?.media?.encrypt_query_param
      const aesKeyB64 = img ? resolveImageAesKeyBase64(img) : null
      if (eqp) {
        const id = `img_${Date.now()}_${randomBytes(3).toString('hex')}`
        pendingAttachments.set(id, { encryptQueryParam: eqp, aesKeyBase64: aesKeyB64 ?? '', filename: `image.jpg` })
        parts.push(`(image: attachment_id=${id})`)
      } else {
        parts.push('(image)')
      }
    } else if (item.type === 3) {
      const v = item.voice_item
      if (v?.text) {
        parts.push(`(voice transcription: ${v.text})`)
      } else {
        const eqp = v?.media?.encrypt_query_param
        const aesKeyB64 = v?.media?.aes_key
        if (eqp) {
          const id = `voice_${Date.now()}_${randomBytes(3).toString('hex')}`
          pendingAttachments.set(id, { encryptQueryParam: eqp, aesKeyBase64: aesKeyB64 ?? '', filename: `voice.silk` })
          parts.push(`(voice: attachment_id=${id})`)
        } else {
          parts.push('(voice)')
        }
      }
    } else if (item.type === 4) {
      const f = item.file_item
      const eqp = f?.media?.encrypt_query_param
      const aesKeyB64 = f?.media?.aes_key
      if (eqp) {
        const id = `file_${Date.now()}_${randomBytes(3).toString('hex')}`
        pendingAttachments.set(id, { encryptQueryParam: eqp, aesKeyBase64: aesKeyB64 ?? '', filename: f.file_name ?? 'file' })
        parts.push(`(file: ${f.file_name ?? 'unknown'}, attachment_id=${id})`)
      } else {
        parts.push(`(file: ${item.file_item?.file_name ?? 'unknown'})`)
      }
    } else if (item.type === 5) {
      const v = item.video_item
      const eqp = v?.media?.encrypt_query_param
      const aesKeyB64 = v?.media?.aes_key
      if (eqp) {
        const id = `video_${Date.now()}_${randomBytes(3).toString('hex')}`
        pendingAttachments.set(id, { encryptQueryParam: eqp, aesKeyBase64: aesKeyB64 ?? '', filename: `video.mp4` })
        parts.push(`(video: attachment_id=${id})`)
      } else {
        parts.push('(video)')
      }
    }
  }
  return parts.join('\n') || '(empty message)'
}

// --- Inline media download (no MCP tool — download directly) ---

async function downloadAttachment(attachmentId: string): Promise<string | null> {
  const info = pendingAttachments.get(attachmentId)
  if (!info) return null

  mkdirSync(INBOX_DIR, { recursive: true, mode: 0o700 })

  const cdnUrl = `${CDN_BASE}/c2c/download?encrypted_query_param=${encodeURIComponent(info.encryptQueryParam)}`
  const res = await fetch(cdnUrl)
  if (!res.ok) throw new Error(`CDN download failed: ${res.status}`)
  const encrypted = Buffer.from(await res.arrayBuffer())
  const decrypted = info.aesKeyBase64
    ? decryptAesEcb(encrypted, parseAesKey(info.aesKeyBase64))
    : encrypted

  const safeName = info.filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const outPath = join(INBOX_DIR, `${Date.now()}-${safeName}`)
  writeFileSync(outPath, decrypted, { mode: 0o600 })

  let finalPath = outPath
  if (info.filename.endsWith('.silk')) {
    try {
      const { decode } = await import('silk-wasm')
      const result = await decode(decrypted, 24000)
      const pcm = result.data
      const wavSize = 44 + pcm.byteLength
      const wav = Buffer.allocUnsafe(wavSize)
      let o = 0
      wav.write('RIFF', o); o += 4; wav.writeUInt32LE(wavSize - 8, o); o += 4
      wav.write('WAVE', o); o += 4; wav.write('fmt ', o); o += 4
      wav.writeUInt32LE(16, o); o += 4; wav.writeUInt16LE(1, o); o += 2
      wav.writeUInt16LE(1, o); o += 2; wav.writeUInt32LE(24000, o); o += 4
      wav.writeUInt32LE(48000, o); o += 4; wav.writeUInt16LE(2, o); o += 2
      wav.writeUInt16LE(16, o); o += 2; wav.write('data', o); o += 4
      wav.writeUInt32LE(pcm.byteLength, o); o += 4
      Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength).copy(wav, o)
      finalPath = outPath.replace(/\.silk$/, '.wav')
      writeFileSync(finalPath, wav, { mode: 0o600 })
    } catch (err) {
      process.stderr.write(`wechat acp-bridge: silk transcode failed: ${err}\n`)
    }
  }

  pendingAttachments.delete(attachmentId)
  return finalPath
}

// --- ACP Client implementation ---

class WeChatAcpClient implements acp.Client {
  private chunks: string[] = []
  private lastTypingAt = 0
  private static readonly TYPING_INTERVAL_MS = 5_000
  private sendTypingFn: () => Promise<void>
  private logFn: (msg: string) => void

  constructor(opts: { sendTyping: () => Promise<void>; log: (msg: string) => void }) {
    this.sendTypingFn = opts.sendTyping
    this.logFn = opts.log
  }

  updateSendTyping(sendTypingFn: () => Promise<void>): void {
    this.sendTypingFn = sendTypingFn
  }

  async requestPermission(
    params: acp.RequestPermissionRequest,
  ): Promise<acp.RequestPermissionResponse> {
    const allowOpt = params.options.find(
      (o) => o.kind === 'allow_once' || o.kind === 'allow_always',
    )
    const optionId = allowOpt?.optionId ?? params.options[0]?.optionId ?? 'allow'

    this.logFn(`[permission] auto-allowed: ${params.toolCall?.title ?? 'unknown'} → ${optionId}`)

    return {
      outcome: {
        outcome: 'selected',
        optionId,
      },
    }
  }

  async sessionUpdate(params: acp.SessionNotification): Promise<void> {
    const update = params.update

    switch (update.sessionUpdate) {
      case 'agent_message_chunk':
        if (update.content.type === 'text') {
          this.chunks.push(update.content.text)
        }
        await this.maybeSendTyping()
        break

      case 'tool_call':
        this.logFn(`[tool] ${update.title} (${update.status})`)
        await this.maybeSendTyping()
        break

      case 'tool_call_update':
        if (update.status === 'completed' && update.content) {
          for (const c of update.content) {
            if (c.type === 'diff') {
              const diff = c as acp.Diff
              const header = `--- ${diff.path}`
              const lines: string[] = [header]
              if (diff.oldText != null) {
                for (const l of diff.oldText.split('\n')) lines.push(`- ${l}`)
              }
              if (diff.newText != null) {
                for (const l of diff.newText.split('\n')) lines.push(`+ ${l}`)
              }
              this.chunks.push('\n```diff\n' + lines.join('\n') + '\n```\n')
            }
          }
        }
        if (update.status) {
          this.logFn(`[tool] ${update.toolCallId} → ${update.status}`)
        }
        break

      case 'plan':
        if (update.entries) {
          const items = update.entries
            .map((e: acp.PlanEntry, i: number) => `  ${i + 1}. [${e.status}] ${e.content}`)
            .join('\n')
          this.logFn(`[plan]\n${items}`)
        }
        break
    }
  }

  async readTextFile(params: acp.ReadTextFileRequest): Promise<acp.ReadTextFileResponse> {
    try {
      const content = await fs.promises.readFile(params.path, 'utf-8')
      return { content }
    } catch (err) {
      throw new Error(`Failed to read file ${params.path}: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
    }
  }

  async writeTextFile(params: acp.WriteTextFileRequest): Promise<acp.WriteTextFileResponse> {
    try {
      await fs.promises.writeFile(params.path, params.content, 'utf-8')
      return {}
    } catch (err) {
      throw new Error(`Failed to write file ${params.path}: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
    }
  }

  flush(): string {
    const text = this.chunks.join('')
    this.chunks = []
    this.lastTypingAt = 0
    return text
  }

  private async maybeSendTyping(): Promise<void> {
    const now = Date.now()
    if (now - this.lastTypingAt < WeChatAcpClient.TYPING_INTERVAL_MS) return
    this.lastTypingAt = now
    try {
      await this.sendTypingFn()
    } catch {
      // typing is best-effort
    }
  }
}

// --- ACP session management ---

type UserSession = {
  userId: string
  contextToken: string
  client: WeChatAcpClient
  process: ChildProcess
  connection: acp.ClientSideConnection
  sessionId: string
  queue: Array<{ prompt: acp.ContentBlock[]; contextToken: string }>
  processing: boolean
  lastActivity: number
}

const userSessions = new Map<string, UserSession>()

// Idle session cleanup every 2 minutes
const cleanupTimer = setInterval(() => {
  if (IDLE_TIMEOUT_MS <= 0) return
  const now = Date.now()
  for (const [userId, session] of userSessions) {
    if (now - session.lastActivity > IDLE_TIMEOUT_MS && !session.processing) {
      process.stderr.write(`wechat acp-bridge: session for ${userId} idle for ${Math.round((now - session.lastActivity) / 60_000)}min, removing\n`)
      if (!session.process.killed) session.process.kill('SIGTERM')
      userSessions.delete(userId)
    }
  }
}, 2 * 60_000)
cleanupTimer.unref()

function evictOldestSession(): void {
  let oldest: { userId: string; lastActivity: number } | null = null
  for (const [uid, s] of userSessions) {
    if (!s.processing && (!oldest || s.lastActivity < oldest.lastActivity)) {
      oldest = { userId: uid, lastActivity: s.lastActivity }
    }
  }
  if (oldest) {
    process.stderr.write(`wechat acp-bridge: evicting oldest idle session: ${oldest.userId}\n`)
    const s = userSessions.get(oldest.userId)
    if (s && !s.process.killed) s.process.kill('SIGTERM')
    userSessions.delete(oldest.userId)
  }
}

async function createSession(userId: string, contextToken: string): Promise<UserSession> {
  process.stderr.write(`wechat acp-bridge: creating session for ${userId}\n`)

  const client = new WeChatAcpClient({
    sendTyping: () => sendTyping(userId, contextToken),
    log: (msg) => process.stderr.write(`wechat acp-bridge [${userId}]: ${msg}\n`),
  })

  // Spawn agent subprocess
  const useShell = process.platform === 'win32'
  const proc = spawn(AGENT_COMMAND, AGENT_ARGS, {
    stdio: ['pipe', 'pipe', 'inherit'],
    cwd: getUserCwd(userId),
    env: { ...process.env, ...AGENT_ENV },
    shell: useShell,
  })

  proc.on('error', (err) => {
    process.stderr.write(`wechat acp-bridge [${userId}]: agent process error: ${err instanceof Error ? err.message : JSON.stringify(err)}\n`)
  })

  if (!proc.stdin || !proc.stdout) {
    proc.kill()
    throw new Error('Failed to get agent process stdio')
  }

  // Wait briefly to detect immediate crash (e.g. missing API key, bad binary)
  await new Promise(resolve => setTimeout(resolve, 500))
  if (proc.exitCode !== null) {
    throw new Error(`Agent process exited immediately (code ${proc.exitCode}). Check that ANTHROPIC_API_KEY is set and the agent command is valid.`)
  }

  // Set up ACP connection — manual Web Stream wrappers (Bun's Writable.toWeb crashes on Windows)
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

  // Initialize ACP
  process.stderr.write(`wechat acp-bridge [${userId}]: initializing ACP connection...\n`)
  const initResult = await connection.initialize({
    protocolVersion: acp.PROTOCOL_VERSION,
    clientInfo: {
      name: 'wechat-acp-bridge',
      title: 'WeChat ACP Bridge',
      version: '1.0.0',
    },
    clientCapabilities: {
      fs: {
        readTextFile: true,
        writeTextFile: true,
      },
    },
  })
  process.stderr.write(`wechat acp-bridge [${userId}]: ACP initialized (protocol v${initResult.protocolVersion})\n`)

  // Create session
  const sessionResult = await connection.newSession({
    cwd: getUserCwd(userId),
    mcpServers: [],
  })
  process.stderr.write(`wechat acp-bridge [${userId}]: session created (sessionId=${sessionResult.sessionId})\n`)

  const session: UserSession = {
    userId,
    contextToken,
    client,
    process: proc,
    connection,
    sessionId: sessionResult.sessionId,
    queue: [],
    processing: false,
    lastActivity: Date.now(),
  }

  // Clean up on process exit
  proc.on('exit', (code, signal) => {
    process.stderr.write(`wechat acp-bridge [${userId}]: agent exited code=${code} signal=${signal}\n`)
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

      // Update typing callback to use latest context_token
      session.client.updateSendTyping(() =>
        sendTyping(session.userId, pending.contextToken),
      )

      // Reset chunks for the new turn
      session.client.flush()

      try {
        // Send typing immediately
        sendTyping(session.userId, pending.contextToken).catch(() => {})

        // Send ACP prompt
        process.stderr.write(`wechat acp-bridge [${session.userId}]: sending prompt to agent...\n`)
        const result = await session.connection.prompt({
          sessionId: session.sessionId,
          prompt: pending.prompt,
        })

        // Collect accumulated text
        let replyText = session.client.flush()

        if (result.stopReason === 'cancelled') {
          replyText += '\n[cancelled]'
        } else if (result.stopReason === 'refusal') {
          replyText += '\n[agent refused to continue]'
        }

        process.stderr.write(`wechat acp-bridge [${session.userId}]: agent done (${result.stopReason}), reply ${replyText.length} chars\n`)

        // Send reply back to WeChat
        if (replyText.trim()) {
          const plainText = markdownToPlaintext(replyText)
          const access = loadAccess()
          const limit = Math.max(1, Math.min(access.textChunkLimit ?? MAX_CHUNK_LIMIT, MAX_CHUNK_LIMIT))
          const chunks = chunk(plainText, limit)

          for (const c of chunks) {
            if (access.humanDelay && chunks.length > 1) {
              await Bun.sleep(Math.min(c.length * 50, 3000))
            }
            await sendMessage(session.userId, c, pending.contextToken)
          }
        }

        cancelTyping(session.userId).catch(() => {})
      } catch (err) {
        process.stderr.write(`wechat acp-bridge [${session.userId}]: agent prompt error: ${err instanceof Error ? err.message : JSON.stringify(err)}\n`)

        // Check if agent died
        if (session.process.killed || session.process.exitCode !== null) {
          process.stderr.write(`wechat acp-bridge [${session.userId}]: agent process died, removing session\n`)
          userSessions.delete(session.userId)
          return
        }

        // Send error message to user
        try {
          await sendMessage(
            session.userId,
            `⚠️ Agent error: ${err instanceof Error ? err.message : JSON.stringify(err)}`,
            pending.contextToken,
          )
        } catch {
          // best effort
        }
      }
    }
  } finally {
    session.processing = false
  }
}

async function enqueueMessage(userId: string, promptBlocks: acp.ContentBlock[], contextToken: string): Promise<void> {
  let session = userSessions.get(userId)

  if (!session || session.process.killed || session.process.exitCode !== null) {
    // Need a new session
    if (userSessions.has(userId)) userSessions.delete(userId)
    if (userSessions.size >= MAX_CONCURRENT_USERS) {
      evictOldestSession()
    }
    const MAX_RETRIES = 2
    let lastErr: unknown
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        session = await createSession(userId, contextToken)
        break
      } catch (err) {
        lastErr = err
        process.stderr.write(`wechat acp-bridge [${userId}]: session creation failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}): ${err instanceof Error ? err.message : JSON.stringify(err)}\n`)
        if (attempt < MAX_RETRIES) {
          await Bun.sleep(1000 * (attempt + 1)) // 1s, 2s backoff
          continue
        }
      }
    }
    if (!session) {
      try {
        await sendMessage(userId,
          `⚠️ Agent 启动失败（重试 ${MAX_RETRIES + 1} 次）: ${lastErr instanceof Error ? lastErr.message : JSON.stringify(lastErr)}\n\n` +
          `常见原因：\n` +
          `1. 未安装 Node.js/npx\n` +
          `2. npx @zed-industries/claude-code-acp 下载超时\n` +
          `3. 未设置 ANTHROPIC_API_KEY`,
          contextToken)
      } catch {}
      return
    }
  }

  // Always update contextToken to the latest
  session.contextToken = contextToken
  session.lastActivity = Date.now()
  session.queue.push({ prompt: promptBlocks, contextToken })

  if (!session.processing) {
    session.processing = true
    processQueue(session).catch((err) => {
      process.stderr.write(`wechat acp-bridge [${userId}]: queue processing error: ${err instanceof Error ? err.message : JSON.stringify(err)}\n`)
    })
  }
}

// --- Inbound message handler ---

async function handleInbound(msg: any): Promise<void> {
  if (msg.message_type !== 1) return

  const senderId = msg.from_user_id
  if (!senderId) return

  if (msg.context_token) {
    contextTokenMap.set(senderId, msg.context_token)
    debouncedPersist()
  }

  const result = gate(senderId)

  if (result.action === 'drop') return

  if (result.action === 'pair') {
    const ct = msg.context_token
    if (ct) {
      const lead = result.isResend ? '仍在等待配对' : '需要配对验证'
      await sendMessage(
        senderId,
        `${lead} — 在 Claude Code 终端运行：\n\n/wechat:access pair ${result.code}`,
        ct,
      ).catch((err: any) => {
        process.stderr.write(`wechat acp-bridge: pairing reply failed: ${err}\n`)
      })
    }
    return
  }

  // Message approved
  knownUsers.add(senderId)

  const cmdText = (msg.item_list ?? []).filter((i: any) => i.type === 1 && i.text_item?.text).map((i: any) => i.text_item.text).join(' ').trim()
  if (cmdText === '/toggle-debug') {
    setDebugMode(!isDebugMode())
    if (msg.context_token) await sendMessage(senderId, `Debug 模式已${isDebugMode() ? '开启' : '关闭'}`, msg.context_token).catch(() => {})
    return
  }
  if (cmdText.startsWith('/echo ')) {
    if (msg.context_token) await sendMessage(senderId, `${cmdText.slice(6)}\n\n⏱ 延迟: ${Date.now() - (msg.create_time_ms ?? Date.now())}ms`, msg.context_token).catch(() => {})
    return
  }
  if (cmdText.startsWith('/cwd')) {
    const newCwd = cmdText.slice(4).trim()
    if (!newCwd) {
      // 显示当前 cwd
      const currentCwd = getUserCwd(senderId)
      if (msg.context_token) await sendMessage(senderId, `当前工作目录: ${currentCwd}`, msg.context_token).catch(() => {})
      return
    }
    // 验证路径存在
    try {
      const stat = statSync(newCwd)
      if (!stat.isDirectory()) {
        if (msg.context_token) await sendMessage(senderId, `❌ 路径不是目录: ${newCwd}`, msg.context_token).catch(() => {})
        return
      }
    } catch {
      if (msg.context_token) await sendMessage(senderId, `❌ 目录不存在: ${newCwd}`, msg.context_token).catch(() => {})
      return
    }
    // 保存 per-user cwd
    userCwdMap.set(senderId, newCwd)
    persistUserCwd()
    // 销毁当前 session，下次消息时会用新 cwd 重建
    const existingSession = userSessions.get(senderId)
    if (existingSession) {
      if (!existingSession.process.killed) existingSession.process.kill('SIGTERM')
      userSessions.delete(senderId)
    }
    if (msg.context_token) await sendMessage(senderId, `✅ 工作目录已切换: ${newCwd}\nAgent 会话已重置，下条消息将在新目录启动`, msg.context_token).catch(() => {})
    return
  }

  // Extract text and download any media attachments inline
  const text = extractText(msg)

  // Download any pending attachments and include file paths in prompt
  let promptText = text
  const attachmentIds = [...text.matchAll(/attachment_id=([a-z_0-9]+)/g)].map(m => m[1])
  if (attachmentIds.length > 0) {
    const downloadedPaths: string[] = []
    for (const aid of attachmentIds) {
      try {
        const localPath = await downloadAttachment(aid)
        if (localPath) downloadedPaths.push(localPath)
      } catch (err) {
        process.stderr.write(`wechat acp-bridge: attachment download failed (${aid}): ${err}\n`)
      }
    }
    if (downloadedPaths.length > 0) {
      promptText += '\n\n[已下载的附件文件路径:\n' + downloadedPaths.join('\n') + '\n]'
    }
  }

  // Send to ACP agent via session queue
  const promptBlocks: acp.ContentBlock[] = [{ type: 'text', text: promptText }]
  await enqueueMessage(senderId, promptBlocks, msg.context_token)
}

// --- Long-poll loop ---

let getUpdatesBuf = ''
try {
  getUpdatesBuf = readFileSync(SYNC_BUF_FILE, 'utf8').trim()
} catch {}

const MAX_FAILURES = 3
const BACKOFF_MS = 30000
const RETRY_MS = 2000
let failures = 0
let pollTimeoutMs = 35000
let shuttingDown = false

async function pollLoop(): Promise<void> {
  while (!shuttingDown) {
    try {
      const resp = await getUpdates(getUpdatesBuf, pollTimeoutMs + 5000)

      if (resp.ret !== undefined && resp.ret !== 0) {
        if (resp.ret === -14 || resp.errcode === -14) {
          process.stderr.write('wechat acp-bridge: session expired (ret=-14), stopping poll\n')
          break
        }
        failures++
        process.stderr.write(`wechat acp-bridge: getUpdates error ret=${resp.ret} errmsg=${resp.errmsg ?? ''} (${failures}/${MAX_FAILURES})\n`)
        if (failures >= MAX_FAILURES) {
          failures = 0
          await Bun.sleep(BACKOFF_MS)
        } else {
          await Bun.sleep(RETRY_MS)
        }
        continue
      }

      failures = 0
      if (resp.longpolling_timeout_ms && typeof resp.longpolling_timeout_ms === 'number') pollTimeoutMs = resp.longpolling_timeout_ms

      if (resp.get_updates_buf) {
        getUpdatesBuf = resp.get_updates_buf
        mkdirSync(STATE_DIR, { recursive: true })
        writeFileSync(SYNC_BUF_FILE, getUpdatesBuf)
      }

      const msgs = resp.msgs ?? []
      for (const msg of msgs) {
        await handleInbound(msg).catch((err: any) => {
          process.stderr.write(`wechat acp-bridge: message handler error: ${err}\n`)
        })
      }
    } catch (err) {
      failures++
      process.stderr.write(`wechat acp-bridge: poll error (${failures}/${MAX_FAILURES}): ${err}\n`)
      if (failures >= MAX_FAILURES) {
        failures = 0
        await Bun.sleep(BACKOFF_MS)
      } else {
        await Bun.sleep(RETRY_MS)
      }
    }
  }

  process.stderr.write('wechat acp-bridge: poll loop stopped\n')
}

// --- Start ---

process.stderr.write(`wechat acp-bridge: started (ACP mode, agent=${AGENT_COMMAND} ${AGENT_ARGS.join(' ')}, default cwd=${AGENT_CWD})\n`)
process.stderr.write(`wechat acp-bridge: long-poll started (${BASE_URL})\n`)

pollLoop()

// --- Graceful shutdown ---

function shutdown(reason: string): void {
  if (shuttingDown) return
  shuttingDown = true
  process.stderr.write(`wechat acp-bridge: shutting down (${reason})\n`)

  // Persist any pending context tokens
  if (persistTimer) {
    clearTimeout(persistTimer)
    persistTimer = null
    persistContextTokens()
  }

  // Kill all agent sessions
  for (const [uid, s] of userSessions) {
    process.stderr.write(`wechat acp-bridge: stopping session for ${uid}\n`)
    if (!s.process.killed) {
      s.process.kill('SIGTERM')
      // Force kill after 5s if still alive
      setTimeout(() => {
        if (!s.process.killed) s.process.kill('SIGKILL')
      }, 5_000).unref()
    }
  }
  userSessions.clear()

  // Clear idle cleanup timer
  clearInterval(cleanupTimer)

  const forceTimer = setTimeout(() => {
    process.stderr.write('wechat acp-bridge: force exit after timeout\n')
    process.exit(0)
  }, 2000)
  forceTimer.unref()

  // Exit after a short delay for pending I/O
  setTimeout(() => {
    clearTimeout(forceTimer)
    process.exit(0)
  }, 500)
}

process.stdin.on('end', () => shutdown('stdin EOF'))
process.stdin.on('error', () => shutdown('stdin error'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('unhandledRejection', (err) => {
  process.stderr.write(`wechat acp-bridge: unhandled rejection: ${err}\n`)
})
process.on('uncaughtException', (err) => {
  process.stderr.write(`wechat acp-bridge: uncaught exception: ${err}\n`)
  shutdown('uncaughtException')
})
