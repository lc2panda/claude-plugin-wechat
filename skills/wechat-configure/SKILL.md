---
name: wechat-configure
description: Set up the WeChat channel — scan QR code to login, check channel status. Use when the user asks to configure WeChat, login, or check channel status.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash(ls *)
  - Bash(mkdir *)
  - Bash(bun *)
---

# /wechat:configure — WeChat Channel Setup

Manages WeChat iLink Bot login and credential storage. Credentials live in
`~/.claude/channels/wechat/credentials.json`.

Arguments passed: `$ARGUMENTS`

---

## Dispatch on arguments

### No args — status and guidance

Read both state files and give the user a complete picture:

1. **Credentials** — check `~/.claude/channels/wechat/credentials.json` for
   `token` and `baseUrl`. Show set/not-set; if set, show token first 6 chars
   masked.

2. **Access** — read `~/.claude/channels/wechat/access.json` (missing file
   = defaults: `dmPolicy: "pairing"`, empty allowlist). Show:
   - DM policy and what it means
   - Allowed senders: count and list
   - Pending pairings: count with codes and sender IDs

3. **What next** — concrete next step based on state:
   - No credentials → *"Run `/wechat:configure login` to scan QR code and connect."*
   - Credentials set, nobody allowed → *"Send a message to the bot on WeChat. It replies with a code; approve with `/wechat:access pair <code>`."*
   - Credentials set, someone allowed → *"Ready. Message the bot on WeChat to reach the assistant."*

### `login` — QR code login

This is a TWO-STEP process. The scripts are in the plugin install directory.
Find the plugin root by looking for the `channels/wechat/login-qr.ts` file:

```
~/.claude/plugins/cache/lc2panda-plugins/wechat/*/channels/wechat/login-qr.ts
```

Use `ls` to resolve the wildcard and get the actual path.

**Step 1: Fetch and display QR code**

```bash
bun <plugin-root>/channels/wechat/login-qr.ts
```

This script:
- Fetches a QR code from `https://ilinkai.weixin.qq.com/`
- Renders it in the terminal using `npx qrcode-terminal`
- Shows the direct link (user can open in WeChat)
- Outputs JSON as the last line: `{"qrcode":"...","url":"..."}`

**Wait for the user** after showing the QR code. Tell them:
*"用微信扫描二维码，或在微信中打开上面的链接。扫码完成后告诉我。"*

Extract the `qrcode` value from the last line of output — you'll need it
for step 2.

**Step 2: Poll for scan result**

After the user says they've scanned (or just proceed after showing the QR):

```bash
bun <plugin-root>/channels/wechat/login-poll.ts <qrcode>
```

This script polls the WeChat API for scan status. It outputs one line:
- `scaned` — user scanned, waiting for confirmation on phone
- `expired` — QR expired (exit code 1). Offer to re-run step 1.
- `timeout` — timed out (exit code 1). Offer to re-run step 1.
- `{"token":"...","baseUrl":"...","accountId":"...","userId":"..."}` — success!
  Credentials saved and scanner added to allowlist. (exit code 0)

On success, tell the user:
- *"✅ 微信连接成功！"*
- Credentials saved, user added to allowlist
- *"重启 Claude Code 会话以启用微信频道"*

On `scaned`, tell the user *"已扫码，请在微信上点击确认..."* and note
the poll script is still running.

### `clear` — remove credentials

Delete `~/.claude/channels/wechat/credentials.json`.

### `baseurl <url>` — set custom API base URL

For testing or alternative iLink endpoints. Read existing credentials.json,
update `baseUrl`, write back.

---

## Implementation notes

- The channels dir might not exist if the server hasn't run yet. Missing file
  = not configured, not an error.
- The server reads credentials.json once at boot. Credential changes need a
  session restart. Say so after saving.
- `access.json` is re-read on every inbound message — policy changes via
  `/wechat:access` take effect immediately, no restart.
- Default API base URL is `https://ilinkai.weixin.qq.com/`.
- The QR code URL is a WeChat mini-program link. It works when scanned with
  WeChat's QR scanner OR when opened in WeChat's built-in browser.

---

## FAQ

**Q: 我派出的 sub-agent / worker 报错 "cannot send to WeChat" / "session timeout" / "errcode -14"，第二次主会话直接发就成功，怎么回事？**

A: 这是 MCP 协议的物理限制，不是 bug。Sub-agent（Task 工具派出的 worker）运行在隔离上下文中，**没有 MCP 句柄**，无法直接调用 `reply` 工具。Worker 拿到的 `context_token` 也只是任务派发时刻的字符串字面量，几分钟后已过期。

**正确做法**：让 sub-agent 把要发送的内容作为返回值交给主会话，主会话调用 `reply` 工具。

**新版插件已加固**（v2.1.3+）：`reply` 工具的 `context_token` 改为可选——主会话不传也能发，服务端自动 fallback 到该 user_id 的最新缓存 token（与腾讯官方 SDK `@tencent-weixin/openclaw-weixin` v2.1.10 同款行为）。

**Q: 为什么不能直接在 sub-agent 里调用 iLink HTTP API？**

A: 即使 sub-agent 直接 POST 到 `https://ilinkai.weixin.qq.com/ilink/bot/sendmessage`，也需要 `context_token`，而它手上的 token 在派发时刻就已经是旧的——iLink 协议是 last-wins 模型，只有最新一条入站消息的 token 才有效。这就是 B 组日志中第一次失败的真实根因。
