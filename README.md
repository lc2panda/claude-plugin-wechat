# claude-plugin-wechat

WeChat (微信) plugin for [Claude Code](https://claude.ai/claude-code) — text, images, files, voice, video, remote permission relay.

微信插件，让你通过微信直接与 Claude Code 对话。支持文字、图片、文件、语音、视频、远程权限审批。

<img src="docs/wechat-test-screenshot.jpg" alt="WeChat Channel Test" width="300" />

## Two modes / 两种模式

| | **Channel** | **ACP** |
|---|---|---|
| **Who / 适用** | claude.ai subscribers | API Key / any provider |
| **Features / 特点** | Full features, permission relay | Claude, Copilot, Gemini, Codex, Qwen... |
| **Install / 安装** | Plugin marketplace | `bun add -g` or `bunx` |

> claude.ai login → **Channel** / API Key → **ACP**

---

<details>
<summary><b>Channel mode / 频道模式</b>（click to expand / 点击展开）</summary>

> Requires [Claude Code](https://claude.ai/claude-code) v2.1.80+ with **claude.ai login**. All commands below are typed in your Claude Code terminal.
>
> 需要 [Claude Code](https://claude.ai/claude-code) v2.1.80+，并使用 **claude.ai 登录**。以下命令均在 Claude Code 终端中输入。

**1. Install plugin / 安装插件**

In Claude Code terminal, type:

在 Claude Code 终端中输入：
```bash
claude plugin marketplace add lc2panda/claude-plugin-wechat
claude plugin install wechat@lc2panda-plugins
```

**2. Login / 微信登录** — Type `/wechat:configure login`, scan QR with WeChat, confirm on phone.

输入 `/wechat:configure login`，微信扫码，手机确认。

**3. Start / 启动** — Quit Claude Code and restart with:

退出 Claude Code，用以下命令重新启动：
```bash
# Auto-approve (faster) / 自动授权（更快）
claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins

# Or: manual confirm (approve via WeChat) / 或：手动确认（微信审批）
claude --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

**4. Pair / 配对**

1. Open WeChat, send any message to the bot / 打开微信，给机器人发消息
2. Bot replies with a 6-char code / 机器人回复配对码
3. Back in Claude Code terminal, type: / 回到终端输入：`/wechat:access pair <code>`

**Stop / 停止：** Press `Ctrl+C` or type `/exit` in Claude Code.

</details>

<details>
<summary><b>ACP mode / ACP 模式</b>（click to expand / 点击展开）</summary>

> `wechat-acp` is a bridge service: WeChat ↔ AI Agent (Claude Code / Gemini / Copilot...).
> It runs in your terminal and **automatically launches** the AI agent in the background — you don't need to start Claude Code yourself.
>
> `wechat-acp` 是一个桥接服务：微信 ↔ AI（Claude Code / Gemini / Copilot...）。
> 在终端运行后，它会**自动启动** AI 引擎，你不需要手动打开 Claude Code。
>
> **macOS / Linux / Windows** — all commands typed in your **terminal** (Terminal.app / PowerShell / CMD).

**Step 1 — Install Bun + plugin / 安装 Bun + 插件**

<details>
<summary>1a. Install Bun (skip if already have) / 安装 Bun（已有可跳过，`bun --version` 检查）</summary>

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```
</details>

```bash
bun add -g claude-plugin-wechat
```
`wechat-acp` command is now available globally.

`wechat-acp` 命令现在全局可用。

**Step 2 — Start / 启动**

```bash
wechat-acp
```

- **First run:** QR code appears → scan with WeChat → confirm on phone → bridge starts + AI agent launches automatically.
- **Already logged in:** Bridge + AI agent start immediately.

- **首次运行：** 自动弹出二维码 → 微信扫码 → 手机确认 → 桥接服务启动，AI 引擎自动拉起。
- **已登录过：** 直接启动。

Keep this terminal window open — the service is running.

保持终端开着，服务运行中。

> Re-login: `wechat-acp --login` / 重新登录：`wechat-acp --login`

**Step 3 — Pair / 配对**

1. Open WeChat, send any message to the bot / 打开微信，给机器人发消息
2. Bot replies with a 6-char code / 收到 6 位配对码
3. In a **new terminal window**, start Claude Code and type: / 打开**另一个终端窗口**，启动 Claude Code 输入：`/wechat:access pair <code>`

**Done!** Now send messages in WeChat → AI responds. You're using Claude Code via WeChat.

**完成！** 微信发消息 → AI 回复。你正在通过微信使用 Claude Code。

<details>
<summary><b>How it works / 工作原理</b></summary>

```
You (WeChat) → wechat-acp bridge → Claude Code (auto-spawned) → response → WeChat
   手机微信        终端桥接服务        自动启动的 AI 引擎        回复        微信收到
```

- `wechat-acp` polls WeChat for messages and forwards them to the AI agent
- The AI agent (Claude Code by default) is a background subprocess — you never see it
- Each WeChat user gets their own persistent AI session
- `wechat-acp` 轮询微信消息，转发给 AI 引擎
- AI 引擎（默认 Claude Code）是后台子进程，你看不到它
- 每个微信用户都有独立的 AI 会话

</details>

<details>
<summary><b>Switch project / 切换项目目录</b></summary>

Send in WeChat / 在微信中发送：
```
/cwd /path/to/your/project
```
AI restarts in the new directory. No need to touch the terminal.

AI 在新目录重启，不用动终端。

View current directory / 查看当前目录：
```
/cwd
```

</details>

<details>
<summary><b>Use other AI agents / 使用其他 AI 引擎</b></summary>

```bash
ACP_AGENT=gemini wechat-acp            # Google Gemini
ACP_AGENT=copilot wechat-acp           # GitHub Copilot
ACP_AGENT=codex wechat-acp             # OpenAI Codex
ACP_AGENT=qwen wechat-acp              # Qwen / 通义千问
wechat-acp --cwd /path/to/project      # Set default working directory / 指定默认工作目录
```

Third-party API / 第三方 API (GLM, Kimi, 文心...):
```bash
ANTHROPIC_BASE_URL=https://your-provider/v1 ANTHROPIC_API_KEY=your-key wechat-acp
```

</details>

**Stop / 停止：** `Ctrl+C` in the terminal running `wechat-acp` / 在运行 `wechat-acp` 的终端按 `Ctrl+C`

</details>

<details>
<summary><b>WeChat commands / 微信端命令</b>（both modes / 两种模式通用）</summary>

Send these as messages in WeChat / 在微信中发送以下命令：

| Command | Effect |
|---------|--------|
| `/cwd [path]` | Show or switch working directory (ACP) / 查看或切换工作目录 |
| `/toggle-debug` | Toggle debug mode / 切换调试模式 |
| `/echo <text>` | Echo with latency / 回显并显示延迟 |

</details>

### Related / 相关项目

- **WeCom / 企业微信：** [dividduang/claude-plugin-wecom](https://github.com/dividduang/claude-plugin-wecom)

---

## For Claude Code (AI agent) — machine-readable instructions

Follow sequentially. Steps marked **[HUMAN]** need physical user action.

### Step 0 — Pre-flight & mode detection

```bash
claude --version   # >= 2.1.80 required
bun --version      # required
```

If `bun` is missing, tell user: `curl -fsSL https://bun.sh/install | bash`

**Detect auth mode:**
```bash
claude auth status --text
```
- **claude.ai login** → Channel mode (Steps 1-8)
- **API key / Console / Bedrock / Vertex** → ACP mode (Steps 1-5 then ACP setup)
- Ask user if unclear.

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

### ACP mode (API Key users)

For users with API key / Console / Bedrock / Vertex auth. Uses ACP (Agent Client Protocol) with persistent agent subprocess.

#### Step 1 — Install globally [HUMAN]

```bash
bun add -g claude-plugin-wechat
```

If `bun` is missing, tell user to install: `curl -fsSL https://bun.sh/install | bash`

#### Step 2 — Start the bridge [HUMAN]

```bash
wechat-acp
```

If no credentials exist, the bridge automatically starts an interactive QR login flow (QR renders in terminal, user scans with WeChat, confirms on phone). After login, the bridge continues to start normally.

To force re-login: `wechat-acp --login`

Alternative ways to start:
```bash
wechat-acp --cwd /path/to/project     # Set default working directory
ACP_AGENT=gemini wechat-acp           # Use different agent
cd "$PLUGIN_ROOT" && bun acp-bridge.ts # Run from plugin directory
bunx claude-plugin-wechat              # Zero-install
```

Built-in agent presets: `claude` (default), `copilot`, `gemini`, `qwen`, `codex`, `opencode`.

The bridge spawns the correct ACP command automatically (e.g. `npx @zed-industries/claude-code-acp` for claude). Each WeChat user gets a persistent ACP session with dedicated agent subprocess.

Users can switch working directory from WeChat by sending `/cwd /new/path`. This destroys the current session and creates a new one in the target directory.

#### Step 3 — Pair [HUMAN]

1. "Send any message to the bot from WeChat."
2. Bot replies with 6-char code.
3. In a separate Claude Code session, run `/wechat:access pair <code>`.

#### Step 4 — Verify

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

### ACP protocol

- Uses Agent Client Protocol (ACP) — JSON-RPC 2.0 over stdio
- Persistent agent subprocess per user (no cold start per message)
- Streaming responses via `session/update` → `agent_message_chunk`
- Permission requests via `session/request_permission` (auto-approved by default)
- Supports any ACP-compatible agent: Claude Code, Copilot, Gemini, Codex, Qwen, OpenCode
- Same media pipeline as Channel mode (inline download)
- Per-user working directory via `/cwd` command (persisted in `user-cwd.json`)

### WeChat commands (both modes)

| Command | Effect |
|---------|--------|
| `/cwd [path]` | Show or switch working directory (ACP only) |
| `/toggle-debug` | Toggle debug mode |
| `/echo <text>` | Echo with latency measurement |

### Skills (Channel mode only)

| Skill | Trigger |
|-------|---------|
| `/wechat:configure` | Login, status, base URL |
| `/wechat:access` | Pair, allow/remove, policy, `humanDelay`, `textChunkLimit` |

### Mode comparison

| Feature | Channel | ACP |
|---------|---------|-----------|
| Auth | claude.ai OAuth | API Key / any provider |
| Permission relay | via WeChat | auto-approve (extensible) |
| Connection | Persistent MCP | Persistent ACP subprocess |
| Streaming | yes | yes (agent_message_chunk) |
| Multi-agent | Claude Code only | Any ACP agent (Claude/Copilot/Gemini/Codex) |
| Multi-turn | yes | yes (persistent session) |
| Media | yes | yes |
| Working dir switch | N/A (bound to session) | `/cwd` command from WeChat |
| Global install | Plugin marketplace | `bun add -g` / `bunx` |

### State files (`~/.claude/channels/wechat/`)

| File | Content |
|------|---------|
| `credentials.json` | Bot auth |
| `access.json` | Access control |
| `sync_buf.txt` | Poll cursor |
| `context-tokens.json` | Per-user context_token |
| `user-cwd.json` | Per-user working directory (ACP) |
| `debug-mode.json` | Debug toggle |
| `inbox/` | Downloaded media |
| `approved/` | Pairing markers |

### Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Channels are not currently available` | Use ACP mode, or `claude logout` → `claude login` for claude.ai |
| `credentials required` | Run Step 5 (QR login) |
| No channel events | Add `--dangerously-load-development-channels` flag |
| `user not allowlisted` | `/wechat:access pair <code>` |
| `context_token required` | Pass from `<channel>` tag meta |
| `session expired` (errcode -14) | Auto-pauses 1h. Re-login if persists |
| Wrong working directory (ACP) | Send `/cwd /correct/path` from WeChat |

---

## Acknowledgement / 致谢

Based on [m1heng/claude-plugin-weixin](https://github.com/m1heng/claude-plugin-weixin). Thanks for the original work.

本项目基于 [m1heng/claude-plugin-weixin](https://github.com/m1heng/claude-plugin-weixin) 开发，感谢原作者的贡献。

---

License: MIT
