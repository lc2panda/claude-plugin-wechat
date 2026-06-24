<!--
# AI Installation Instructions (Machine-Readable)

This section is for AI agents (Claude Code, Panda CLI / Codex) to autonomously install, configure, and verify this plugin. It is invisible in browser preview.

---

## Plugin Repository Info

- Repository: https://github.com/lc2panda/claude-plugin-wechat
- Branch: main
- Plugin name (marketplace): `wechat`
- Marketplace source: `lc2panda-plugins` (from `lc2panda/claude-plugin-wechat`)
- Package name (npm/bun): `claude-plugin-wechat`
- Version: 2.1.9
- Channels provided: `wechat` (WeChat/微信) + `feishu` (Feishu/Lark/飞书)
- Modes: Channel (MCP, full-featured) + ACP (standalone process, multi-agent)

---

## Supported Platforms

| Platform | State directory | Plugin install directory |
|----------|----------------|-------------------------|
| Claude Code | `~/.claude/channels/` | `~/.claude/plugins/cache/lc2panda-plugins/wechat/*/` |
| Panda CLI (Codex) | `~/.pandacc/channels/` | `~/.codex/plugins/cache/lc2panda-plugins/wechat/*/` |

Platform detection: `ls ~/.pandacc 2>/dev/null && echo "Panda CLI" || echo "Claude Code"`

---

## Installation Commands (4 combinations)

### 1. Claude Code + WeChat (Channel mode)

```bash
# Inside Claude Code session:
/plugin marketplace add lc2panda/claude-plugin-wechat
/plugin install wechat@lc2panda-plugins
/wechat:configure login
# Then launch with channel enabled:
claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

### 2. Claude Code + Feishu (Channel mode)

```bash
# Inside Claude Code session:
/plugin marketplace add lc2panda/claude-plugin-wechat
/plugin install wechat@lc2panda-plugins
/feishu:configure login
# Then launch with channel enabled:
claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

### 3. Panda CLI (Codex) + WeChat (Channel mode)

```bash
# Inside Panda CLI / Codex session:
/plugin marketplace add lc2panda/claude-plugin-wechat
/plugin install wechat@lc2panda-plugins
# Configure login (invoke skill or tell Codex "configure wechat login"):
/wechat:configure login
# Restart Codex session — MCP channel auto-starts via plugin.json mcpServers field
```

### 4. Panda CLI (Codex) + Feishu (Channel mode)

```bash
# Inside Panda CLI / Codex session:
/plugin marketplace add lc2panda/claude-plugin-wechat
/plugin install wechat@lc2panda-plugins
/feishu:configure login
# Restart Codex session — MCP channel auto-starts
```

### ACP Mode (all platforms, all channels)

```bash
# Install globally:
bun add -g github:lc2panda/claude-plugin-wechat

# WeChat:
wechat-acp                      # Default: Claude agent
ACP_AGENT=codex wechat-acp     # Codex agent
ACP_AGENT=copilot wechat-acp   # Copilot agent
ACP_AGENT=gemini wechat-acp    # Gemini agent

# Feishu:
feishu-acp                      # Default: Claude agent
ACP_AGENT=codex feishu-acp     # Codex agent
```

---

## Update Commands

| Mode | Command |
|------|---------|
| Channel (Claude Code) | `/plugin marketplace update lc2panda-plugins` then `/plugin install wechat@lc2panda-plugins` then restart Claude Code |
| Channel (Panda CLI) | `/plugin marketplace update lc2panda-plugins` then `/plugin install wechat@lc2panda-plugins` then restart Codex session |
| ACP | `bun add -g github:lc2panda/claude-plugin-wechat` then restart wechat-acp / feishu-acp |

---

## Post-Install Configuration

### WeChat credentials

Skill: `/wechat:configure login`
- Displays QR code in terminal
- User scans with WeChat on phone and confirms
- Credentials saved to `<STATE_DIR>/channels/wechat/credentials.json`
- The scanning WeChat account is auto-allowlisted (no pairing needed)

### Feishu credentials

Skill: `/feishu:configure login`
- Requires App ID + App Secret from Feishu Open Platform (open.feishu.cn) or Lark Developer (open.larksuite.com)
- For Lark (international): run `/feishu:configure domain lark` first
- Required permissions (batch import JSON): `{"scopes":{"tenant":["im:message","im:message.p2p_msg:readonly","im:message.group_at_msg:readonly","im:message:send_as_bot","im:resource"]}}`
- Event subscription: enable "Long connection" mode, add `im.message.receive_v1`
- Credentials saved to `<STATE_DIR>/channels/feishu/credentials.json`

---

## Verify Installation Success

1. **Channel mode**: After launching, send a message from WeChat/Feishu. It appears as `<channel source="wechat" ...>` or `<channel source="feishu" ...>` in the Claude/Codex session. Use the `reply` tool to respond.
2. **ACP mode**: After `wechat-acp` or `feishu-acp` starts without errors and prints "polling..." or "connected", send a message from the IM app. The agent responds automatically.
3. **Credential check**: `cat <STATE_DIR>/channels/wechat/credentials.json` (or feishu) should contain `bot_token` (wechat) or `app_id` + `app_secret` (feishu).

---

## Common Error Troubleshooting

| Symptom | Solution |
|---------|----------|
| `Channels are not currently available` | Use ACP mode instead, or `claude logout` then `claude login` |
| `credentials required` | Run `/wechat:configure login` or `/feishu:configure login` |
| Messages not arriving | Claude Code: ensure launch command includes `--dangerously-load-development-channels`; Codex: restart session after install |
| `user not allowlisted` | Run `/wechat:access pair <code>` or `/feishu:access pair <code>` |
| Feishu card shows plain text | Enable message card capability in app settings |
| Feishu long connection fails | Ensure event subscription is set to "Long connection" mode |
| `bun: command not found` | Install Bun: `curl -fsSL https://bun.sh/install \| bash` |
| ACP agent fails to start | Ensure `claude` CLI is installed and in PATH; or set `ACP_AGENT_COMMAND` |

---

## MCP Server Configuration (.mcp.json)

Both platforms share the same `.mcp.json`:
- **Claude Code**: reads `.mcp.json` from plugin root, `${CLAUDE_PLUGIN_ROOT}` resolves to plugin directory
- **Panda CLI (Codex)**: discovers `.mcp.json` via `.codex-plugin/plugin.json` `mcpServers` field; `${CLAUDE_PLUGIN_ROOT:-.}` falls back to current directory

---

## Skills Reference

| Skill | Channel | Purpose |
|-------|---------|---------|
| `/wechat:configure` | WeChat | Login (QR scan), check status |
| `/wechat:access` | WeChat | Pair users, manage allowlist, set DM policy |
| `/feishu:configure` | Feishu | Set app credentials, switch domain (feishu/lark), check status |
| `/feishu:access` | Feishu | Pair users, manage allowlist, set DM policy |

## Tools Reference

| Tool | Channel | Parameters |
|------|---------|-----------|
| `reply` | WeChat | `user_id` (required), `text` (required), `context_token` (optional), `files[]` (optional) |
| `reply` | Feishu | `user_id` (required), `text` (required), `chat_id` (required), `files[]` (optional) |
| `download_attachment` | Both | `attachment_id` (required) |

-->

# claude-plugin-wechat

**Multi-channel AI messaging bridge** — chat with AI through WeChat and Feishu/Lark.

Supports: **Claude Code** and **Panda CLI (Codex)**

---

## Features

- **Dual channel**: WeChat (微信) + Feishu/Lark (飞书)
- **Dual mode**: Channel (MCP, full-featured) + ACP (standalone, multi-agent)
- **Streaming replies**: Real-time typing effect in ACP mode; cardkit streaming for Feishu
- **Remote permission relay**: Approve/deny Claude Code permission prompts from your phone
- **Full media**: Text, images, files, voice (SILK to WAV), video
- **Multi-agent ACP**: Claude, Codex, Copilot, Gemini, Qwen
- **Access control**: Pairing codes, allowlists, DM policy

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| [Bun](https://bun.sh) | Required runtime. Install: `curl -fsSL https://bun.sh/install \| bash` |
| Claude Code v2.1.111+ | For Channel mode. Check: `claude --version` |
| WeChat account | For WeChat channel (iOS/Android) |
| Feishu/Lark self-built app | For Feishu channel (App ID + App Secret required) |

---

## Installation

### Channel Mode (full-featured, requires platform login)

Works inside Claude Code or Panda CLI (Codex) sessions.

```bash
# Step 1: Add marketplace source
/plugin marketplace add lc2panda/claude-plugin-wechat

# Step 2: Install plugin
/plugin install wechat@lc2panda-plugins
```

**Launch (Claude Code):**
```bash
claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

**Launch (Panda CLI / Codex):**
Restart your Codex session after install. The MCP channel starts automatically.

---

### ACP Mode (standalone, API Key users, multi-agent)

Does not require Claude Code or Codex session. Runs as independent process.

```bash
# Install globally
bun add -g github:lc2panda/claude-plugin-wechat

# WeChat
wechat-acp

# Feishu
feishu-acp
```

Select agent with `ACP_AGENT` environment variable:
```bash
ACP_AGENT=codex wechat-acp
ACP_AGENT=copilot wechat-acp
ACP_AGENT=gemini wechat-acp
```

---

## Configuration

### WeChat

Run `/wechat:configure login` in your Claude Code / Codex session.
- Terminal displays QR code
- Scan with WeChat on your phone, confirm login
- The scanning account is auto-authorized (no pairing needed)
- Credentials saved to:
  - Claude Code: `~/.claude/channels/wechat/credentials.json`
  - Panda CLI: `~/.pandacc/channels/wechat/credentials.json`

### Feishu / Lark

1. Create a self-built app at [Feishu Open Platform](https://open.feishu.cn) or [Lark Developer](https://open.larksuite.com)
2. Import permissions (batch JSON):
   ```json
   {"scopes":{"tenant":["im:message","im:message.p2p_msg:readonly","im:message.group_at_msg:readonly","im:message:send_as_bot","im:resource"]}}
   ```
3. Event subscription: select "Long connection" mode, add `im.message.receive_v1`
4. Create version and publish
5. Run `/feishu:configure login` and enter App ID + App Secret
   - Lark users: run `/feishu:configure domain lark` first

Credentials saved to:
- Claude Code: `~/.claude/channels/feishu/credentials.json`
- Panda CLI: `~/.pandacc/channels/feishu/credentials.json`

---

## Usage

### Receiving messages

Messages arrive in your session as:
```
<channel source="wechat" user_id="..." context_token="..." ts="...">message text</channel>
<channel source="feishu" user_id="..." chat_id="..." ts="...">message text</channel>
```

### Replying

Use the `reply` tool:
- WeChat: pass `user_id` and `text` (context_token optional)
- Feishu: pass `user_id`, `text`, and `chat_id` (required)

### Access control (pairing)

The scanning/login account is auto-authorized. Other users:
1. They send a message to the bot
2. They receive a 6-digit pairing code
3. You run `/wechat:access pair <code>` or `/feishu:access pair <code>`

### IM-side commands

| Command | Function | Mode |
|---------|----------|------|
| `/cwd [path]` | View or switch working directory | ACP |
| `/toggle-debug` | Toggle debug mode | All |
| `/echo <text>` | Echo with latency info | All |

---

## Environment Variables

### Streaming (ACP mode)

| Variable | Default | Description |
|----------|---------|-------------|
| `WECHAT_STREAMING` | on | WeChat ACP streaming toggle. Set `0`/`false`/`off` to disable |
| `WECHAT_STREAM_CHARS` | 100 | Flush threshold by character count |
| `WECHAT_STREAM_MS` | 1000 | Flush threshold by time (ms) |
| `WECHAT_STREAM_SAFE_MULTI` | 0 | Conservative multi-chunk mode (set `1` if client deviates from append semantics) |
| `FEISHU_STREAMING` | on | Feishu ACP cardkit streaming toggle |
| `FEISHU_CHANNEL_PSEUDO_STREAM` | off | Feishu Channel pseudo-streaming (set `1` to enable; note 5 QPS limit) |
| `FEISHU_STREAMING_FREQ_MS` | 70 | Cardkit typewriter refresh interval (ms) |
| `FEISHU_STREAMING_STEP` | 1 | Cardkit characters per step |
| `FEISHU_STREAMING_STRATEGY` | fast | Cardkit strategy (`fast` / `delay`) |
| `FEISHU_STREAM_TOOL_CALLS` | on | Show tool call progress in Feishu cards |

### ACP General

| Variable | Default | Description |
|----------|---------|-------------|
| `ACP_AGENT` | claude | Agent selection: `claude` / `codex` / `copilot` / `gemini` |
| `ACP_AGENT_COMMAND` | (auto) | Custom agent launch command |
| `ACP_AGENT_ARGS` | (auto) | Custom agent arguments |
| `ACP_AGENT_CWD` | (auto) | Agent working directory |
| `ACP_MAX_USERS` | 10 | Max concurrent user sessions |
| `ACP_IDLE_TIMEOUT` | 24h | Session idle timeout |

---

## Architecture

```
WeChat User ──→ iLink Bot API (long-poll) ──→ server.ts (MCP) ──→ Claude Code / Codex
Feishu User ──→ Feishu SDK (WebSocket)    ──→ server.ts (MCP) ──→ Claude Code / Codex

                                          ──→ acp-bridge.ts (ACP) ──→ Any ACP Agent
```

Key files:
| File | Role |
|------|------|
| `channels/wechat/server.ts` | WeChat MCP channel server |
| `channels/wechat/acp-bridge.ts` | WeChat ACP bridge |
| `channels/feishu/server.ts` | Feishu MCP channel server |
| `channels/feishu/acp-bridge.ts` | Feishu ACP bridge |
| `channels/feishu/cardkit-stream.ts` | Feishu cardkit streaming controller |
| `channels/shared/acp-packages.ts` | ACP agent presets |

---

## Troubleshooting

| Symptom | Solution |
|---------|----------|
| `Channels are not currently available` | Use ACP mode, or `claude logout` then `claude login` |
| `credentials required` | `/wechat:configure login` or `/feishu:configure login` |
| Messages not arriving | Claude Code: ensure `--dangerously-load-development-channels` in launch command. Codex: restart session |
| `user not allowlisted` | `/wechat:access pair <code>` or `/feishu:access pair <code>` |
| Feishu card shows plain text | Enable message card capability in app settings |
| Feishu long connection fails | Check event subscription is set to "Long connection" mode |
| `bun: command not found` | `curl -fsSL https://bun.sh/install \| bash` |
| ACP agent won't start | Ensure `claude` CLI is in PATH; or set `ACP_AGENT_COMMAND` explicitly |
| WeChat QR expired | Re-run `/wechat:configure login` (auto-refreshes up to 3 times) |

---

## Related Projects

- **WeCom (企业微信):** [dividduang/claude-plugin-wecom](https://github.com/dividduang/claude-plugin-wecom)

---

## Acknowledgments

Based on [m1heng/claude-plugin-weixin](https://github.com/m1heng/claude-plugin-weixin). Thanks to the original author.

---

## License

MIT
