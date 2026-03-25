#!/usr/bin/env bun
/**
 * Input: WeChat messages via iLink Bot API + Claude Code CLI responses
 * Output: WeChat replies via iLink Bot API
 * Pos: Agent SDK bridge — alternative to MCP Channel mode for API Key users
 *
 * Self-contained bridge that connects WeChat to Claude Code via `claude -p` CLI.
 * State lives in ~/.claude/channels/wechat/ — shares credentials and access
 * control with the MCP Channel mode (server.ts).
 *
 * Uses WeChat iLink Bot API with HTTP long-poll — no public webhook needed.
 */

import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import {
  readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync,
  statSync, renameSync, realpathSync,
} from 'fs'
import { homedir } from 'os'
import { join, sep } from 'path'
import { spawn } from 'child_process'

// --- State directories ---

// Migrate state from old 'weixin' dir to 'wechat' if needed
const OLD_STATE_DIR = join(homedir(), '.claude', 'channels', 'weixin')
const STATE_DIR = join(homedir(), '.claude', 'channels', 'wechat')
try {
  const { existsSync } = await import('fs')
  if (existsSync(OLD_STATE_DIR) && !existsSync(STATE_DIR)) {
    renameSync(OLD_STATE_DIR, STATE_DIR)
    process.stderr.write('wechat agent-bridge: migrated state from channels/weixin to channels/wechat\n')
  }
} catch {}
const ACCESS_FILE = join(STATE_DIR, 'access.json')
const APPROVED_DIR = join(STATE_DIR, 'approved')
const CREDENTIALS_FILE = join(STATE_DIR, 'credentials.json')
const SYNC_BUF_FILE = join(STATE_DIR, 'sync_buf.txt')
const CONTEXT_TOKENS_FILE = join(STATE_DIR, 'context-tokens.json')
const INBOX_DIR = join(STATE_DIR, 'inbox')
const CDN_BASE = 'https://novac2c.cdn.weixin.qq.com'
const DEBUG_MODE_FILE = join(STATE_DIR, 'debug-mode.json')
const SESSIONS_FILE = join(STATE_DIR, 'sdk-sessions.json')

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

const creds = loadCredentials()

if (!creds?.token || !creds?.baseUrl) {
  process.stderr.write(
    `wechat agent-bridge: credentials required\n` +
    `  run /wechat:configure in Claude Code to scan QR and login\n`,
  )
  process.exit(1)
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
    process.stderr.write(`wechat agent-bridge: context-tokens persist failed: ${err}\n`)
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
      base_info: { channel_version: '1.0.0' },
    })
    if (resp.typing_ticket) {
      typingTicket = resp.typing_ticket
      typingTicketExpiry = Date.now() + 30 * 60 * 1000
    }
  } catch (err) {
    process.stderr.write(`wechat agent-bridge: getconfig failed: ${err}\n`)
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
    process.stderr.write(`wechat agent-bridge: sendtyping failed: ${err}\n`)
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
      process.stderr.write(`wechat agent-bridge: CDN upload attempt ${attempt} failed (${putRes.status}), retrying...\n`)
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
    process.stderr.write(`wechat agent-bridge: access.json is corrupt, moved aside. Starting fresh.\n`)
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
      process.stderr.write(`wechat agent-bridge: silk transcode failed: ${err}\n`)
    }
  }

  pendingAttachments.delete(attachmentId)
  return finalPath
}

// --- Session management ---

type SessionMap = Record<string, string>  // userId → sessionId

function loadSessions(): SessionMap {
  try { return JSON.parse(readFileSync(SESSIONS_FILE, 'utf8')) } catch { return {} }
}

function saveSessions(sessions: SessionMap): void {
  mkdirSync(STATE_DIR, { recursive: true, mode: 0o700 })
  const tmp = SESSIONS_FILE + '.tmp'
  writeFileSync(tmp, JSON.stringify(sessions, null, 2) + '\n', { mode: 0o600 })
  renameSync(tmp, SESSIONS_FILE)
}

// --- Claude Code CLI bridge ---

async function queryClaudeSDK(prompt: string, userId: string): Promise<string> {
  const sessions = loadSessions()
  const sessionId = sessions[userId]

  const args = ['-p', prompt, '--bare', '--output-format', 'json',
    '--allowedTools', 'Bash,Read,Edit,Write']
  if (sessionId) {
    args.push('--resume', sessionId)
  }

  return new Promise((resolve, reject) => {
    const proc = spawn('claude', args, {
      env: { ...process.env },  // ANTHROPIC_API_KEY from env
      cwd: process.cwd(),
    })

    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', (d: Buffer) => { stdout += d })
    proc.stderr.on('data', (d: Buffer) => { stderr += d })

    proc.on('close', (code) => {
      if (code !== 0 && !stdout) {
        reject(new Error(`claude exited ${code}: ${stderr}`))
        return
      }
      try {
        const result = JSON.parse(stdout)
        // Update session ID for next turn
        if (result.session_id) {
          sessions[userId] = result.session_id
          saveSessions(sessions)
        }
        resolve(result.result ?? result.text ?? stdout)
      } catch {
        resolve(stdout)  // fallback: raw output
      }
    })
  })
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
        process.stderr.write(`wechat agent-bridge: pairing reply failed: ${err}\n`)
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
        process.stderr.write(`wechat agent-bridge: attachment download failed (${aid}): ${err}\n`)
      }
    }
    if (downloadedPaths.length > 0) {
      promptText += '\n\n[已下载的附件文件路径:\n' + downloadedPaths.join('\n') + '\n]'
    }
  }

  // Query Claude Code via CLI
  try {
    if (msg.context_token) {
      sendTyping(senderId, msg.context_token).catch(() => {})
    }

    const response = await queryClaudeSDK(promptText, senderId)

    // Convert markdown and chunk the response
    const plainText = markdownToPlaintext(response)
    const access = loadAccess()
    const limit = Math.max(1, Math.min(access.textChunkLimit ?? MAX_CHUNK_LIMIT, MAX_CHUNK_LIMIT))
    const chunks = chunk(plainText, limit)

    for (const c of chunks) {
      if (access.humanDelay && chunks.length > 1) {
        await Bun.sleep(Math.min(c.length * 50, 3000))
      }
      await sendMessage(senderId, c, msg.context_token)
    }

    cancelTyping(senderId).catch(() => {})
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    process.stderr.write(`wechat agent-bridge: claude query failed: ${errMsg}\n`)
    if (msg.context_token) {
      await sendMessage(senderId, `⚠️ Claude Code 响应失败: ${errMsg}`, msg.context_token).catch(() => {})
    }
  }
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
          process.stderr.write('wechat agent-bridge: session expired (ret=-14), stopping poll\n')
          break
        }
        failures++
        process.stderr.write(`wechat agent-bridge: getUpdates error ret=${resp.ret} errmsg=${resp.errmsg ?? ''} (${failures}/${MAX_FAILURES})\n`)
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
          process.stderr.write(`wechat agent-bridge: message handler error: ${err}\n`)
        })
      }
    } catch (err) {
      failures++
      process.stderr.write(`wechat agent-bridge: poll error (${failures}/${MAX_FAILURES}): ${err}\n`)
      if (failures >= MAX_FAILURES) {
        failures = 0
        await Bun.sleep(BACKOFF_MS)
      } else {
        await Bun.sleep(RETRY_MS)
      }
    }
  }

  process.stderr.write('wechat agent-bridge: poll loop stopped\n')
}

// --- Start ---

process.stderr.write(`wechat agent-bridge: started (Agent SDK mode, API Key)\n`)
process.stderr.write(`wechat agent-bridge: long-poll started (${BASE_URL})\n`)

pollLoop()

// --- Graceful shutdown ---

function shutdown(reason: string): void {
  if (shuttingDown) return
  shuttingDown = true
  process.stderr.write(`wechat agent-bridge: shutting down (${reason})\n`)

  // Persist any pending context tokens
  if (persistTimer) {
    clearTimeout(persistTimer)
    persistTimer = null
    persistContextTokens()
  }

  const forceTimer = setTimeout(() => {
    process.stderr.write('wechat agent-bridge: force exit after timeout\n')
    process.exit(0)
  }, 2000)
  forceTimer.unref()

  // No MCP to close — just exit after a short delay for pending I/O
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
  process.stderr.write(`wechat agent-bridge: unhandled rejection: ${err}\n`)
})
process.on('uncaughtException', (err) => {
  process.stderr.write(`wechat agent-bridge: uncaught exception: ${err}\n`)
  shutdown('uncaughtException')
})
