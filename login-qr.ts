#!/usr/bin/env bun
/**
 * Step 1: Fetch QR code and render it in terminal.
 * Outputs JSON to stdout as last line: {"qrcode":"...","url":"..."}
 * so the caller can extract the qrcode token for polling.
 */

const BASE_URL = process.argv[2] || 'https://ilinkai.weixin.qq.com/'
const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`

const res = await fetch(`${base}ilink/bot/get_bot_qrcode?bot_type=3`)
if (!res.ok) {
  console.error(`获取二维码失败: ${res.status}`)
  process.exit(1)
}

const data = await res.json() as any
const qrcode: string = data.qrcode
const url: string = data.qrcode_img_content

// Render QR code in terminal
try {
  const proc = Bun.spawn(['npx', '-y', 'qrcode-terminal@0.12.0', url, '--small'], {
    stdout: 'inherit',
    stderr: 'pipe',
  })
  await proc.exited
} catch {}

console.log(`\n用微信扫描上方二维码，或在微信中打开以下链接：`)
console.log(`\n  ${url}\n`)

// Output structured data as last line for the caller to parse
console.log(JSON.stringify({ qrcode, url }))
