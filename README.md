# claude-plugin-wechat

## If you are a human / 如果你是人类

WeChat (微信) channel plugin for [Claude Code](https://claude.ai/claude-code).
Chat with Claude Code from WeChat — text, images, files, voice, video, with remote permission relay.

微信频道插件，让你可以通过微信直接与 Claude Code 对话，支持文字、图片、文件、语音、视频，以及远程权限审批。

**Install / 安装：**

```bash
claude plugin marketplace add lc2panda/claude-plugin-wechat
claude plugin install wechat@lc2panda-plugins
```

**Start / 启动：**

```bash
claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

**Setup / 配置：** Run `/wechat:configure login` in Claude Code to scan QR and connect.
在 Claude Code 中执行 `/wechat:configure login` 扫码连接微信。

**Pair / 配对：** Send any message to the bot on WeChat → get a code → run `/wechat:access pair <code>`.
从微信给机器人发任意消息 → 收到配对码 → 在终端执行 `/wechat:access pair <配对码>`。

Prerequisites / 前置条件: [Claude Code](https://claude.ai/claude-code) v2.1.80+, [Bun](https://bun.sh) runtime, **claude.ai login required** (API key / Console auth not supported — Channels is a claude.ai feature). License: MIT.

前置条件：[Claude Code](https://claude.ai/claude-code) v2.1.80+、[Bun](https://bun.sh) 运行时、**必须使用 claude.ai 登录**（不支持 API Key / Console 认证 — Channels 是 claude.ai 功能）。

**WeCom / 企业微信：** Looking for WeCom (企业微信) integration? Check out [dividduang/claude-plugin-wecom](https://github.com/dividduang/claude-plugin-wecom).
如需接入企业微信，请查看 [dividduang/claude-plugin-wecom](https://github.com/dividduang/claude-plugin-wecom)，感谢开发者 dividduang 的贡献。

**Screenshot / 效果截图：**

<img src="docs/wechat-test-screenshot.jpg" alt="WeChat Channel Test" width="300" />

---

## If you are Claude Code (AI agent), read below

Everything below is machine-readable instructions. Follow sequentially.
Steps marked **[HUMAN]** require prompting the user to act physically.

### Step 0 — Pre-flight

```bash
claude --version   # >= 2.1.80 required
bun --version      # required
```

If `bun` is missing, tell user: "Please install Bun first: `curl -fsSL https://bun.sh/install | bash` then restart your terminal."

**CRITICAL**: Channels require **claude.ai OAuth login**. If the user is authenticated via API key, Console, or a third-party provider (e.g. Bedrock, Vertex), channels will not work — Claude Code will show "Channels are not currently available". Tell the user: "Channels require claude.ai login. Please run `claude logout` then `claude login` to switch to claude.ai authentication."

### Step 1 — Locate plugin root

Set `$PLUGIN_ROOT` to the absolute path of the directory containing this README.

### Step 2 — Install dependencies

```bash
cd "$PLUGIN_ROOT" && bun install --no-summary
```

Verify: `node_modules/@modelcontextprotocol`, `node_modules/zod`, and `node_modules/silk-wasm` must exist.

### Step 3 — Build validation

```bash
cd "$PLUGIN_ROOT" && bun build --target=bun server.ts --outdir /tmp/wechat-build-check 2>&1
rm -rf /tmp/wechat-build-check
```

Expect `Bundled ... modules` with zero errors.

### Step 4 — Register and install

```bash
claude plugin marketplace add lc2panda/claude-plugin-wechat
claude plugin install wechat@lc2panda-plugins
```

Fallback (local dev, must pass on every startup):
```bash
claude --plugin-dir "$PLUGIN_ROOT"
```

### Step 5 — WeChat QR login [HUMAN]

First check if credentials already exist:
```bash
cat ~/.claude/channels/wechat/credentials.json 2>/dev/null
```

If credentials exist and contain `token` + `baseUrl`, skip to Step 6.

Otherwise run the two-step QR login:

1. Run `bun "$PLUGIN_ROOT/login-qr.ts"` — a QR code renders in terminal.
2. Tell user: "Please scan the QR code with WeChat and confirm on your phone."
3. Parse the last line of output as JSON, extract the `qrcode` field.
4. Run `bun "$PLUGIN_ROOT/login-poll.ts" "<qrcode>"` and handle output:
   - `scaned` → tell user "Scanned, please confirm on your phone..."
   - `refreshed:<new_token>` → QR auto-refreshed, no action needed (up to 3 times)
   - `expired` or `timeout` (exit 1) → re-run from 5.1
   - JSON with `token` field (exit 0) → credentials saved. Tell user: "WeChat connected! Please restart Claude Code to enable the channel."

### Step 6 — Restart with channel enabled [HUMAN]

Ask the user which permission mode they prefer, then give the corresponding command:

**Option A — Auto-approve all permissions (faster, less interruption):**
```
claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

**Option B — Manual approval for each action (safer, you confirm every tool use):**
```
claude --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

Explain the difference: Option A lets Claude execute commands without asking. Option B prompts for confirmation on sensitive actions (file writes, shell commands, etc.) — approvals can also come from WeChat via permission relay.

### Step 7 — Pair WeChat account [HUMAN]

1. Tell user: "Send any message to the bot from WeChat."
2. The bot replies with a 6-character pairing code.
3. Ask user for the code, then run `/wechat:access pair <code>`.
4. Confirm the user is now allowlisted.

### Step 8 — Verify

Send a test message from WeChat. It should arrive as a `<channel source="wechat" ...>` notification. Use the `reply` tool to respond.

---

## Reference (for AI)

### MCP tools

| Tool | Purpose | Required params |
|------|---------|-----------------|
| `reply` | Send text and/or files to WeChat. Supports image, video, and file attachments via MIME auto-detection. | `user_id`, `text`, `context_token`; optional `files` (string array of local paths) |
| `download_attachment` | Download media (image/voice/file/video) from WeChat CDN. AES-128-ECB decrypted automatically. Voice files (.silk) are transcoded to WAV. | `attachment_id` |

### Channel protocol

- Capabilities: `experimental['claude/channel']` + `experimental['claude/channel/permission']`
- Inbound events: `notifications/claude/channel` with meta `{user_id, context_token, ts}`
- Outbound: via `reply` MCP tool. `context_token` is **mandatory** — without it the reply fails.
- Permission relay: remote user can reply `yes <code>` or `no <code>` from WeChat to approve/deny tool use.
- Media types: image (13 extensions), video (11 extensions), file (everything else). Auto-detected by file extension.
- Voice: if `voice_item.text` exists (WeChat ASR), transcription is used directly. Otherwise audio is downloadable via `download_attachment` and transcoded from SILK to WAV.
- Quoted messages: `ref_msg` content (text + media) is extracted and included in channel notification.

### WeChat slash commands (handled by the channel, not Claude Code)

| Command | Effect |
|---------|--------|
| `/toggle-debug` | Toggle debug mode on/off (persists to disk). When on, reply tool appends timing diagnostics. |
| `/echo <text>` | Echo text back with channel latency measurement. Does not reach Claude. |

### Skills

| Skill | Trigger |
|-------|---------|
| `/wechat:configure` | User asks to login, check status, or change base URL |
| `/wechat:access` | User asks to pair, approve/remove users, change DM policy, or configure `humanDelay`/`textChunkLimit` |

### Key constraints

- WeChat has **no message history API**. Ask user to paste or summarize earlier context.
- Session can expire (errcode -14). Channel auto-pauses for 1 hour. User may need to re-login via `/wechat:configure login`.
- CDN uploads retry up to 3 times on server errors. 4xx errors fail immediately.

### Access config options (in `access.json`)

| Key | Type | Description |
|-----|------|-------------|
| `dmPolicy` | `pairing` / `allowlist` / `disabled` | Who can message the bot |
| `allowFrom` | `string[]` | Allowlisted user IDs |
| `textChunkLimit` | `number` | Max chars per message (default 2000) |
| `humanDelay` | `boolean` | Simulate typing delay (~50ms/char, max 3s) between chunks |

### State files (all under `~/.claude/channels/wechat/`)

| File | Content |
|------|---------|
| `credentials.json` | `{token, baseUrl, userId, accountId}` |
| `access.json` | `{dmPolicy, allowFrom[], pending{}, textChunkLimit?, humanDelay?}` |
| `sync_buf.txt` | getUpdates long-poll cursor |
| `context-tokens.json` | per-user context_token (debounced 5s persist) |
| `debug-mode.json` | `{enabled: boolean}` — debug mode state |
| `inbox/` | downloaded media attachments |
| `approved/` | pairing approval marker files |

### Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Channels are not currently available` | Using API key / Console / third-party auth instead of claude.ai login | Run `claude logout` then `claude login` to switch to claude.ai OAuth |
| `credentials required` on start | No QR login | Run Step 5 |
| No channel events arriving | Missing `--dangerously-load-development-channels` flag | Run Step 6 |
| `user X is not allowlisted` | User not paired | Run Step 7 |
| `context_token is required` | Missing from tool call | Always pass `context_token` from inbound `<channel>` tag meta |
| `CDN download failed` | Network or expired URL | Retry `download_attachment` |
| `getuploadurl` returns `ret:-2` | Invalid params or expired token | Re-login via `/wechat:configure login` |
| `session expired` error | errcode -14 from API | Channel auto-pauses 1 hour. Re-login if persists. |
| Voice file is `.silk` format | No silk-wasm or transcode failed | Run `bun install` to ensure silk-wasm is installed |

---

## Acknowledgement / 致谢

This project is based on [m1heng/claude-plugin-weixin](https://github.com/m1heng/claude-plugin-weixin). Thanks for the original work.

本项目基于 [m1heng/claude-plugin-weixin](https://github.com/m1heng/claude-plugin-weixin) 开发，感谢原作者的贡献。

---

License: MIT
