# claude-plugin-wechat

## If you are a human / 如果你是人类

WeChat (微信) plugin for [Claude Code](https://claude.ai/claude-code) — text, images, files, voice, video, remote permission relay.

微信插件，让你通过微信直接与 Claude Code 对话。支持文字、图片、文件、语音、视频、远程权限审批。

<img src="docs/wechat-test-screenshot.jpg" alt="WeChat Channel Test" width="300" />

### Quick start / 快速开始

**1. Install / 安装**
```bash
claude plugin marketplace add lc2panda/claude-plugin-wechat
claude plugin install wechat@lc2panda-plugins
```

**2. Login / 登录：** Run `/wechat:configure login` in Claude Code, scan QR with WeChat.
在 Claude Code 中执行 `/wechat:configure login`，微信扫码。

**3. Start / 启动（choose one / 选一种）：**

| Mode / 模式 | Auth / 认证 | Command / 命令 |
|---|---|---|
| **Channel** (full features / 全功能) | claude.ai login | `claude --dangerously-load-development-channels plugin:wechat@lc2panda-plugins` |
| **Agent SDK** (API Key users) | ANTHROPIC_API_KEY | `ANTHROPIC_API_KEY=sk-xxx bun agent-bridge.ts` |

> Channel mode adds `--dangerously-skip-permissions` for auto-approve. Agent SDK mode works with any provider (Bedrock, Vertex, etc.).
>
> Channel 模式加 `--dangerously-skip-permissions` 可自动授权。Agent SDK 模式支持任何认证方式。

**4. Pair / 配对：** Send any message to the bot → get a code → `/wechat:access pair <code>`
微信给机器人发消息 → 收到配对码 → 终端执行 `/wechat:access pair <配对码>`

### Prerequisites / 前置条件

- [Claude Code](https://claude.ai/claude-code) v2.1.80+
- [Bun](https://bun.sh) runtime
- Channel mode requires **claude.ai login**; Agent SDK mode requires **API Key**

### Related / 相关项目

- **WeCom / 企业微信：** [dividduang/claude-plugin-wecom](https://github.com/dividduang/claude-plugin-wecom) — 感谢开发者 dividduang

---

## If you are Claude Code (AI agent), read below

Machine-readable instructions. Follow sequentially.
Steps marked **[HUMAN]** need the user to act physically.

### Step 0 — Pre-flight & mode detection

```bash
claude --version   # >= 2.1.80 required
bun --version      # required
```

If `bun` is missing, tell user to install: `curl -fsSL https://bun.sh/install | bash`

**Detect auth mode to choose the right path:**
```bash
claude auth status --text
```
- **claude.ai login** → Channel mode (Steps 1-8, full features including permission relay)
- **API key / Console / Bedrock / Vertex** → Agent SDK mode (Steps 1-5 then "Agent SDK setup" below)
- Ask the user which mode if unclear.

---

### Channel mode (claude.ai users)

#### Step 1 — Locate plugin root

Set `$PLUGIN_ROOT` to the absolute path of the directory containing this README.

#### Step 2 — Install dependencies

```bash
cd "$PLUGIN_ROOT" && bun install --no-summary
```

Verify: `node_modules/@modelcontextprotocol`, `node_modules/zod`, `node_modules/silk-wasm` must exist.

#### Step 3 — Build validation

```bash
cd "$PLUGIN_ROOT" && bun build --target=bun server.ts --outdir /tmp/wechat-build-check 2>&1
rm -rf /tmp/wechat-build-check
```

#### Step 4 — Register and install

```bash
claude plugin marketplace add lc2panda/claude-plugin-wechat
claude plugin install wechat@lc2panda-plugins
```

#### Step 5 — WeChat QR login [HUMAN]

Check if credentials exist: `cat ~/.claude/channels/wechat/credentials.json 2>/dev/null`

If yes, skip to Step 6. Otherwise:

1. `bun "$PLUGIN_ROOT/login-qr.ts"` — QR renders in terminal
2. Tell user: "Scan with WeChat, confirm on phone."
3. Parse last line JSON, extract `qrcode` field
4. `bun "$PLUGIN_ROOT/login-poll.ts" "<qrcode>"`
   - `scaned` → "Confirm on phone..."
   - `refreshed:<token>` → auto-refreshed (up to 3x)
   - `expired`/`timeout` → re-run from 5.1
   - JSON with `token` → success, tell user to restart

#### Step 6 — Restart with channel [HUMAN]

Ask user which permission mode:

**Option A — Auto-approve (faster):**
```
claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

**Option B — Manual confirm (safer, approvals via WeChat):**
```
claude --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

#### Step 7 — Pair [HUMAN]

1. "Send any message to the bot from WeChat."
2. Bot replies with 6-char code.
3. Run `/wechat:access pair <code>`.

#### Step 8 — Verify

Test message from WeChat → arrives as `<channel source="wechat" ...>` → reply with `reply` tool.

---

### Agent SDK mode (API Key users)

For users with API key / Console / Bedrock / Vertex auth. Uses `claude -p` subprocess instead of MCP Channels.

#### Steps 1-5 — Same as above

Complete Steps 1-5 (dependencies, build, QR login).

#### Step 6 — Start the bridge [HUMAN]

```bash
cd "$PLUGIN_ROOT"
ANTHROPIC_API_KEY=sk-your-key bun agent-bridge.ts
```

Tell user: each WeChat user gets a persistent session (auto-resumed). No restart needed between messages.

#### Step 7 — Pair [HUMAN]

Same as Channel mode Step 7.

#### Step 8 — Verify

Test message from WeChat → Claude responds → reply sent back to WeChat automatically.

---

## Reference (for AI)

### MCP tools (Channel mode only)

| Tool | Purpose | Params |
|------|---------|--------|
| `reply` | Send text/files to WeChat | `user_id`, `text`, `context_token`; optional `files[]` |
| `download_attachment` | Download media from CDN | `attachment_id` |

### Channel protocol

- Capabilities: `claude/channel` + `claude/channel/permission`
- Inbound: `notifications/claude/channel` → meta `{user_id, context_token, ts}`
- Outbound: `reply` tool. `context_token` **mandatory**.
- Permission relay: user replies `yes <code>` / `no <code>` from WeChat
- Media: AES-128-ECB CDN, 13 image + 11 video extensions auto-routed
- Voice: `voice_item.text` (ASR) preferred; otherwise SILK→WAV transcode
- Quoted messages: `ref_msg` extracted

### Agent SDK protocol

- Bridge spawns `claude -p --bare --resume <session>` per turn
- Session IDs persisted in `sdk-sessions.json` per WeChat user
- Responses chunked and sent via `sendMessage`
- Same media pipeline as Channel mode (inline download, no MCP tool)

### WeChat commands (both modes)

| Command | Effect |
|---------|--------|
| `/toggle-debug` | Toggle debug mode |
| `/echo <text>` | Echo with latency measurement |

### Skills (Channel mode only)

| Skill | Trigger |
|-------|---------|
| `/wechat:configure` | Login, status, base URL |
| `/wechat:access` | Pair, allow/remove, policy, `humanDelay`, `textChunkLimit` |

### Mode comparison

| Feature | Channel | Agent SDK |
|---------|---------|-----------|
| Auth | claude.ai OAuth | API Key / any provider |
| Permission relay | ✅ | ❌ |
| Connection | Persistent MCP | Per-turn subprocess |
| Multi-turn | ✅ | ✅ (--resume) |
| Media | ✅ | ✅ |
| Debug | ✅ | ✅ |
| Typing indicator | ✅ | ✅ |

### State files (`~/.claude/channels/wechat/`)

| File | Content |
|------|---------|
| `credentials.json` | Bot auth |
| `access.json` | Access control |
| `sync_buf.txt` | Poll cursor |
| `context-tokens.json` | Per-user context_token |
| `sdk-sessions.json` | Per-user Claude session ID (Agent SDK mode) |
| `debug-mode.json` | Debug toggle |
| `inbox/` | Downloaded media |
| `approved/` | Pairing markers |

### Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Channels are not currently available` | Use Agent SDK mode, or `claude logout` → `claude login` for claude.ai |
| `credentials required` | Run Step 5 (QR login) |
| No channel events | Add `--dangerously-load-development-channels` flag |
| `user not allowlisted` | `/wechat:access pair <code>` |
| `context_token required` | Pass from `<channel>` tag meta |
| `session expired` (errcode -14) | Auto-pauses 1h. Re-login if persists |

---

## Acknowledgement / 致谢

Based on [m1heng/claude-plugin-weixin](https://github.com/m1heng/claude-plugin-weixin). Thanks for the original work.

本项目基于 [m1heng/claude-plugin-weixin](https://github.com/m1heng/claude-plugin-weixin) 开发，感谢原作者的贡献。

---

License: MIT
