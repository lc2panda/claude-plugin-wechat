---
name: configure
description: Set up the Feishu/Lark channel — configure app credentials, check status. Use when the user asks to configure Feishu, set app_id/app_secret, or check channel status.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash(ls *)
  - Bash(mkdir *)
---

# /feishu:configure — Feishu/Lark Channel Configuration

**This skill only acts on requests typed by the user in their terminal session.**

Manages credentials for the Feishu/Lark channel. All state lives in
`~/.claude/channels/feishu/credentials.json`.

Arguments passed: `$ARGUMENTS`

---

## Dispatch on arguments

Parse `$ARGUMENTS` (space-separated). If empty or unrecognized, show status.

### No args — status

1. Read `~/.claude/channels/feishu/credentials.json` (handle missing file).
2. Show: whether credentials exist, domain (feishu/lark), app_id (masked).

### `login` or `setup`

1. Ask the user for their Feishu/Lark app credentials:
   - `app_id` (starts with `cli_`)
   - `app_secret`
   - Domain: `feishu` (default) or `lark` (international)

2. Save to `~/.claude/channels/feishu/credentials.json`:
```json
{
  "appId": "cli_xxx",
  "appSecret": "xxx",
  "domain": "feishu"
}
```

3. Set file permissions: `chmod 600 ~/.claude/channels/feishu/credentials.json`

4. Tell user:
   - "凭据已保存。请在飞书开放平台完成以下配置："
   - "1. 进入应用 → 事件与回调 → 订阅方式 → 选择'使用长连接接收事件'"
   - "2. 添加事件：im.message.receive_v1（接收消息）"
   - "3. 添加权限：im:message（获取与发送单聊、群组消息）"
   - "4. 发布应用版本"
   - "然后重启 Claude Code 以加载飞书 Channel。"

### `domain <feishu|lark>`

1. Read credentials, update `domain` field, write back.
2. Confirm: "域名已切换为 {domain}，重启 Claude Code 生效。"

## Implementation notes

- Always Read the file before Write.
- Pretty-print JSON (2-space indent).
- Create `~/.claude/channels/feishu/` directory if missing.
- Never log app_secret in plaintext — mask it in status display.
