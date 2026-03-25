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

> Works on **macOS / Linux / Windows**. All commands below are typed in your **terminal** (Terminal.app / PowerShell / CMD).
>
> 适用于 **macOS / Linux / Windows**，以下命令均在你电脑的**终端**中输入。

**Step 0 — Install Bun runtime / 安装 Bun 运行时**

> Skip if you already have Bun (`bun --version` to check).
>
> 如果已安装可跳过（`bun --version` 检查）。

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Step 1 — Install plugin / 安装插件**

Open a terminal, type:

打开终端，输入：
```bash
bun add -g claude-plugin-wechat
```
Done. Now `wechat-acp` command is available globally — you can run it from any folder.

完成。`wechat-acp` 命令现在全局可用，可以在任意目录运行。

**Step 2 — WeChat login / 微信登录（only once / 仅首次）**

> If you already used Channel mode, skip this — they share the same login.
>
> 如果你已用过 Channel 模式，跳过此步，两者共享登录。

In terminal:

在终端输入：
```bash
cd $(bun pm -g bin)/../lib/node_modules/claude-plugin-wechat
bun login-qr.ts
```
A QR code appears in terminal → scan with WeChat → confirm on phone.

终端显示二维码 → 微信扫码 → 手机确认。

Then paste the `qrcode` token from the output and run:

然后把输出中的 `qrcode` 值粘贴执行：
```bash
bun login-poll.ts "paste_qrcode_token_here"
```
Wait for "success" → login complete.

等待显示成功 → 登录完成。

**Step 3 — Start / 启动**

In terminal, from any folder:

在终端，任意目录下输入：
```bash
wechat-acp
```
That's it. The bridge is running. Keep this terminal window open.

就这样，服务已启动。保持终端窗口开着。

<details>
<summary>Advanced options / 进阶选项</summary>

```bash
wechat-acp --cwd /path/to/project      # Set default working directory / 指定默认工作目录
ACP_AGENT=gemini wechat-acp            # Use Gemini instead of Claude / 用 Gemini
ACP_AGENT=copilot wechat-acp           # Use GitHub Copilot / 用 Copilot
ACP_AGENT=codex wechat-acp             # Use OpenAI Codex / 用 Codex
ACP_AGENT=qwen wechat-acp              # Use Qwen / 用通义千问
```

Third-party API / 第三方 API (GLM, Kimi, 文心...):
```bash
ANTHROPIC_BASE_URL=https://your-provider/v1 ANTHROPIC_API_KEY=your-key wechat-acp
```

</details>

**Step 4 — Pair / 配对**

1. Open WeChat, send any message to the bot / 打开微信，给机器人发任意消息
2. Bot replies with a 6-char code / 机器人回复一个 6 位配对码
3. Open a **new terminal** (keep the bridge running), type: / 打开**新终端**输入：
```bash
# In Claude Code session:
/wechat:access pair <code>
```

Now you can chat with AI from WeChat!

现在可以从微信和 AI 对话了！

**Switch project directory from WeChat / 微信端切换项目目录：**

Send in WeChat / 在微信中发送：
```
/cwd /path/to/your/project
```
AI agent restarts in the new directory. No need to touch the terminal.

AI 会话在新目录重启，不用动终端。

**Stop / 停止：** Press `Ctrl+C` in the terminal running `wechat-acp`.

按终端中的 `Ctrl+C` 停止服务。

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

#### Steps 1-5 — Same as Channel mode

Complete Steps 1-5 (dependencies, build, QR login).

#### Step 6 — Start the bridge [HUMAN]

**Option A — Global install (recommended, works from any directory):**
```bash
bun add -g claude-plugin-wechat
wechat-acp
```

**Option B — Run from plugin directory:**
```bash
cd "$PLUGIN_ROOT"
bun acp-bridge.ts
```

**Option C — Zero-install:**
```bash
bunx claude-plugin-wechat
```

CLI options:
```bash
wechat-acp --cwd /path/to/project     # Set default working directory
ACP_AGENT=gemini wechat-acp           # Use different agent
ACP_AGENT=copilot wechat-acp          # GitHub Copilot
ACP_AGENT=codex wechat-acp            # OpenAI Codex
```

Built-in agent presets: `claude` (default), `copilot`, `gemini`, `qwen`, `codex`, `opencode`.

The bridge spawns the correct ACP command automatically (e.g. `npx @zed-industries/claude-code-acp` for claude). Tell user: each WeChat user gets a persistent ACP session with dedicated agent subprocess.

Users can switch working directory from WeChat by sending `/cwd /new/path`. This destroys the current session and creates a new one in the target directory.

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
