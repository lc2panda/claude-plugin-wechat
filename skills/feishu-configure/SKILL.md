---
name: feishu-configure
description: Set up the Feishu/Lark channel — configure app credentials, check status. Use when the user asks to configure Feishu, set app_id/app_secret, or check channel status.
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash(ls *)
  - Bash(mkdir *)
---
## Platform path detection

**Detect the platform before reading/writing any path:**

1. Check if `~/.pandacc` directory exists → **Codex environment**
   - Channel state: `~/.pandacc/channels/`
   - Plugin install dir: `~/.codex/plugins/cache/lc2panda-plugins/wechat/*/`
2. Otherwise → **Claude Code environment**
   - Channel state: `~/.claude/channels/`
   - Plugin install dir: `~/.claude/plugins/cache/lc2panda-plugins/wechat/*/`

**Once detected, use `<STATE_DIR>` to refer to the appropriate channel directory throughout this skill.**

# /feishu:configure — Feishu/Lark Channel Configuration

**This skill only acts on requests typed by the user in their terminal session.**

Manages credentials for the Feishu/Lark channel. All state lives in
`<STATE_DIR>/credentials.json`.

Arguments passed: `$ARGUMENTS`

---

## Dispatch on arguments

Parse `$ARGUMENTS` (space-separated). If empty or unrecognized, show status.

### No args — status

1. Read `<STATE_DIR>/credentials.json` (handle missing file).
2. Show: whether credentials exist, domain (feishu/lark), app_id (masked).

### `login` or `setup`

1. Ask the user for their Feishu/Lark app credentials:
   - `app_id` (starts with `cli_`)
   - `app_secret`
   - Domain: `feishu` (default) or `lark` (international)

2. Save to `<STATE_DIR>/credentials.json`:
```json
{
  "appId": "cli_xxx",
  "appSecret": "xxx",
  "domain": "feishu"
}
```

3. Set file permissions: `chmod 600 <STATE_DIR>/credentials.json`

4. Tell user:
   - "凭据已保存。请在飞书开放平台完成以下配置："
   - "1. 进入应用 → 事件与回调 → 订阅方式 → 选择'使用长连接接收事件'"
   - "2. 添加事件：im.message.receive_v1（接收消息）"
   - "3. 添加权限：im:message（获取与发送单聊、群组消息）"
   - "4. 发布应用版本"
   - "然后重启 Claude Code（Codex 用户：重启 Codex 会话）以加载飞书 Channel。"
   - **Lark 国际版用户注意**：如果 Developer Console 无法配置长连接，这是已知的平台限制。目前需等待飞书官方修复或使用国内版。

### `domain <feishu|lark>`

1. Read credentials, update `domain` field, write back.
2. Confirm: "域名已切换为 {domain}，重启 Claude Code（Codex：重启 Codex 会话）生效。"

## Implementation notes

- Always Read the file before Write.
- Pretty-print JSON (2-space indent).
- Create `<STATE_DIR>/` directory if missing.
- Never log app_secret in plaintext — mask it in status display.

## 流式回复

ACP 模式下默认开启 cardkit 打字机效果，工具调用过程会实时显示。如需关闭流式设 `FEISHU_STREAMING=0`；如需关闭工具调用显示设 `FEISHU_STREAM_TOOL_CALLS=0`。Channel 模式默认非流式，可设 `FEISHU_CHANNEL_PSEUDO_STREAM=1` 启用伪流式。
