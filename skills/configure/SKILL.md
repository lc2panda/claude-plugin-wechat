---
name: configure
description: Set up the WeChat channel — scan QR code to login, check channel status. Use when the user asks to configure WeChat, login, or check channel status.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash(ls *)
  - Bash(mkdir *)
  - Bash(curl *)
---

# /weixin:configure — WeChat Channel Setup

Manages WeChat iLink Bot login and credential storage. Credentials live in
`~/.claude/channels/weixin/credentials.json`.

Arguments passed: `$ARGUMENTS`

---

## Dispatch on arguments

### No args — status and guidance

Read both state files and give the user a complete picture:

1. **Credentials** — check `~/.claude/channels/weixin/credentials.json` for
   `token` and `baseUrl`. Show set/not-set; if set, show token first 6 chars
   masked.

2. **Access** — read `~/.claude/channels/weixin/access.json` (missing file
   = defaults: `dmPolicy: "pairing"`, empty allowlist). Show:
   - DM policy and what it means
   - Allowed senders: count and list
   - Pending pairings: count with codes and sender IDs

3. **What next** — concrete next step based on state:
   - No credentials → *"Run `/weixin:configure login` to scan QR code and connect."*
   - Credentials set, nobody allowed → *"Send a message to the bot on WeChat. It replies with a code; approve with `/weixin:access pair <code>`."*
   - Credentials set, someone allowed → *"Ready. Message the bot on WeChat to reach the assistant."*

### `login` — QR code login

Interactive login flow using the WeChat iLink Bot API:

1. `mkdir -p ~/.claude/channels/weixin`

2. Fetch QR code:
   ```bash
   curl -s "https://ilinkai.weixin.qq.com/ilink/bot/get_bot_qrcode?bot_type=3"
   ```
   Response contains `qrcode` (token) and `qrcode_img_content` (URL to QR image).

3. Show the QR code URL to the user and tell them to scan with WeChat.

4. Poll for status in a loop (up to 5 minutes):
   ```bash
   curl -s "https://ilinkai.weixin.qq.com/ilink/bot/get_qrcode_status?qrcode=<qrcode>"
   ```
   Status values: `wait`, `scaned`, `confirmed`, `expired`.
   - `wait` → keep polling (every 2s)
   - `scaned` → tell user "已扫码，请在微信上确认"
   - `expired` → tell user to retry
   - `confirmed` → save credentials and finish

5. On `confirmed`, response has `bot_token`, `baseurl`, `ilink_bot_id`,
   `ilink_user_id`. Save to `~/.claude/channels/weixin/credentials.json`:
   ```json
   {
     "token": "<bot_token>",
     "baseUrl": "<baseurl>",
     "accountId": "<ilink_bot_id>",
     "userId": "<ilink_user_id>"
   }
   ```
   Write with mode 0o600.

6. Auto-add the scanner's `ilink_user_id` to the allowlist in access.json
   (they own the bot, they should be allowed).

7. Tell user to restart Claude Code session to activate the channel.

### `clear` — remove credentials

Delete `~/.claude/channels/weixin/credentials.json`.

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
  `/weixin:access` take effect immediately, no restart.
- Default API base URL is `https://ilinkai.weixin.qq.com/`.
