#!/usr/bin/env bun
/**
 * Step 2: Poll for QR scan status until confirmed or expired.
 * Usage: bun login-poll.ts <qrcode> [base-url]
 *
 * Outputs status lines to stderr, final result JSON to stdout.
 * Exit code 0 = confirmed, 1 = expired/error.
 */

import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const STATE_DIR = join(homedir(), '.claude', 'channels', 'wechat')
const CREDENTIALS_FILE = join(STATE_DIR, 'credentials.json')
const ACCESS_FILE = join(STATE_DIR, 'access.json')

const qrcode = process.argv[2]
if (!qrcode) {
  console.error('usage: bun login-poll.ts <qrcode> [base-url]')
  process.exit(1)
}

const baseUrl = (process.argv[3] || 'https://ilinkai.weixin.qq.com/').replace(/\/?$/, '/')

const POLL_INTERVAL_MS = 3000
const TIMEOUT_MS = 5 * 60_000

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

const MAX_QR_REFRESHES = 3

async function fetchNewQrCode(): Promise<string | null> {
  try {
    const res = await fetch(`${baseUrl}ilink/bot/get_bot_qrcode?bot_type=3`)
    if (!res.ok) return null
    const data = await res.json() as any
    return data.qrcode ?? null
  } catch {
    return null
  }
}

let currentQrcode = qrcode
let refreshCount = 0
let deadline = Date.now() + TIMEOUT_MS
let scannedShown = false

while (Date.now() < deadline) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 35000)
  let resp: any
  try {
    const res = await fetch(
      `${baseUrl}ilink/bot/get_qrcode_status?qrcode=${encodeURIComponent(currentQrcode)}`,
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
      // Network/gateway errors: degrade to 'wait' and retry (aligned with v2.1.7)
      console.error(`QR poll network error, will retry: ${String(err)}`)
      resp = { status: 'wait' }
    }
  }

  switch (resp.status) {
    case 'wait':
      break

    case 'scaned':
      if (!scannedShown) {
        console.log('scaned')
        scannedShown = true
      }
      break

    // IDC redirection: user scanned but needs to switch to regional server (v2.1.7+)
    case 'scaned_but_redirect': {
      const redirectHost = resp.redirect_host
      if (redirectHost) {
        const newBase = `https://${redirectHost}/`
        console.error(`IDC redirect: switching to ${newBase}`)
        // Update base URL for subsequent polls — note: QR fetch stays on fixed URL
        Object.defineProperty(globalThis, '__redirectedBase', { value: newBase, writable: true })
      }
      if (!scannedShown) {
        console.log('scaned')
        scannedShown = true
      }
      break
    }

    case 'expired': {
      if (refreshCount >= MAX_QR_REFRESHES) {
        console.log('expired')
        process.exit(1)
      }
      refreshCount++
      console.error(`QR 码已过期，正在自动刷新 (${refreshCount}/${MAX_QR_REFRESHES})...`)
      const newQr = await fetchNewQrCode()
      if (!newQr) {
        console.log('expired')
        process.exit(1)
      }
      currentQrcode = newQr
      scannedShown = false
      deadline = Date.now() + TIMEOUT_MS // reset deadline
      console.log(`refreshed:${newQr}`)
      break
    }

    case 'confirmed': {
      // Use redirected base URL if IDC redirection occurred, then server-provided baseurl, then original
      const redirectedBase = (globalThis as any).__redirectedBase
      const creds = {
        token: resp.bot_token,
        baseUrl: resp.baseurl ?? redirectedBase ?? baseUrl,
        accountId: resp.ilink_bot_id,
        userId: resp.ilink_user_id,
      }

      saveCredentials(creds)

      if (creds.userId) {
        addToAllowlist(creds.userId)
      }

      console.log(JSON.stringify(creds))
      process.exit(0)
    }
  }

  await Bun.sleep(POLL_INTERVAL_MS)
}

console.log('timeout')
process.exit(1)
