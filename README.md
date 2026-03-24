# claude-channel-weixin

WeChat (微信) channel plugin for Claude Code. MIT License.

此项目的任何功能、架构更新，必须在结束后同步更新相关文档。这是我们契约的一部分。

---

## For Claude Code: Auto-Install & Setup Procedure

This README is written for Claude Code (the AI agent), not for humans.
Follow the steps below sequentially. Steps marked **[HUMAN]** require
prompting the user to perform a physical action.

### Step 0 — Pre-flight checks

Run these checks silently. If any fail, stop and tell the user what to fix.

```
# 1. Claude Code version must be >= 2.1.80
claude --version

# 2. Bun runtime must be installed
bun --version
```

If `bun` is missing, tell the user:
> 请先安装 Bun 运行时: `curl -fsSL https://bun.sh/install | bash`，安装后重启终端。

### Step 1 — Locate plugin root

Determine the absolute path to this plugin directory (where this README.md lives).
Store it as `$PLUGIN_ROOT` for all subsequent steps.

```bash
PLUGIN_ROOT="<absolute path to this directory>"
```

### Step 2 — Install dependencies

```bash
cd "$PLUGIN_ROOT" && bun install --no-summary
```

Verify: `node_modules/@modelcontextprotocol` and `node_modules/zod` must exist.

### Step 3 — Build validation

```bash
cd "$PLUGIN_ROOT" && bun build --target=bun server.ts --outdir /tmp/weixin-build-check 2>&1
```

Must output `Bundled ... modules` with zero errors. Clean up after:
```bash
rm -rf /tmp/weixin-build-check
```

### Step 4 — Register plugin with Claude Code

```bash
# Add marketplace (one-time)
claude plugin marketplace add lc2panda/claude-plugin-wechat

# Install plugin
claude plugin install weixin@lc2panda-plugins
```

If the above fails (e.g. network issue), fallback to local install:
```bash
claude --plugin-dir "$PLUGIN_ROOT"
```
Note: `--plugin-dir` must be passed every time Claude Code starts.

### Step 5 — WeChat QR Login **[HUMAN]**

This step requires the user to physically scan a QR code with their phone.

1. Run the QR fetcher:
```bash
bun "$PLUGIN_ROOT/login-qr.ts"
```

2. A QR code renders in the terminal. Tell the user:
> 请用微信扫描终端中的二维码，然后在手机上点击确认。

3. Extract the `qrcode` token from the last line of output (JSON: `{"qrcode":"...","url":"..."}`).

4. Poll for confirmation:
```bash
bun "$PLUGIN_ROOT/login-poll.ts" "<qrcode_token>"
```

5. Wait for output:
   - `scaned` → Tell user: **已扫码，请在手机上点击确认...**
   - `refreshed:<new_token>` → QR expired, auto-refreshed (up to 3 times). No action needed.
   - `expired` (exit 1) → All refreshes exhausted. Re-run from step 5.1.
   - `timeout` (exit 1) → Timed out. Re-run from step 5.1.
   - JSON output (exit 0) → **Success!** Credentials saved to `~/.claude/channels/weixin/credentials.json`.

6. On success, tell the user:
> 微信连接成功！凭据已保存。需要重启 Claude Code 会话以启用微信频道。

### Step 6 — Start with channel enabled **[HUMAN]**

The user must restart Claude Code with the channel flag. Tell them to run:

> 请退出当前会话，用以下命令重新启动 Claude Code:
> ```
> claude --dangerously-load-development-channels plugin:weixin@lc2panda-plugins
> ```
> 如果使用本地目录安装:
> ```
> claude --dangerously-load-development-channels --plugin-dir <插件路径> server:weixin
> ```

The `--dangerously-load-development-channels` flag is required during the
channels research preview for non-official plugins.

### Step 7 — Pair WeChat account **[HUMAN]**

After the channel is running, the user must send a test message from WeChat:

1. Tell user: **请从微信给机器人发一条消息（任意内容）。**
2. The bot replies with a 6-character pairing code.
3. Tell user: **请告诉我收到的配对码。**
4. Run: `/weixin:access pair <code>`
5. Confirm: user is now allowlisted.

### Step 8 — Verify

Send a test message from WeChat. It should arrive as a `<channel source="weixin" ...>`
notification in the Claude Code session. Reply using the `reply` tool.

---

## Plugin Capabilities

### MCP Tools (3)

| Tool | Purpose | Required params |
|------|---------|----------------|
| `reply` | Send text/files back to WeChat user | `user_id`, `text`, `context_token`, optional `files[]` |
| `download_attachment` | Download media (image/voice/file/video) from WeChat CDN | `attachment_id` |

### Channel Protocol

- Capability: `experimental['claude/channel']` + `experimental['claude/channel/permission']`
- Inbound: `notifications/claude/channel` with meta `{user_id, context_token, ts}`
- Outbound: via `reply` MCP tool (context_token is **mandatory**)
- Permission relay: users can reply `yes <code>` / `no <code>` from WeChat to approve/deny tool use

### Skills (2)

| Skill | When to suggest |
|-------|----------------|
| `/weixin:configure` | User asks to login, check status, or change base URL |
| `/weixin:access` | User asks to pair, approve, remove users, or change DM policy |

### Key constraint

WeChat has **no message history API**. If context is needed from earlier
messages, ask the user to paste or summarize.

---

## State files

All under `~/.claude/channels/weixin/`:

| File | Content |
|------|---------|
| `credentials.json` | `{token, baseUrl, userId, accountId}` — bot auth |
| `access.json` | `{dmPolicy, allowFrom[], pending{}}` — access control |
| `sync_buf.txt` | Long-poll cursor for getUpdates |
| `context-tokens.json` | Per-user context_token persistence |
| `inbox/` | Downloaded media attachments |
| `approved/` | Pairing approval markers |

---

## Troubleshooting for Claude Code

| Symptom | Diagnosis | Fix |
|---------|-----------|-----|
| `credentials required` on server start | No QR login done | Run Step 5 |
| Channel events not arriving | Session started without `--dangerously-load-development-channels` | Run Step 6 |
| `user X is not allowlisted` on reply | User not paired | Run Step 7 |
| `context_token is required` on reply | Missing context_token in tool call | Always pass context_token from the inbound `<channel>` tag |
| `CDN download failed` | Media URL expired or network issue | Retry; attachment_id is still valid in pendingAttachments |
| `getuploadurl: no upload_url` | API error on file send | Retry; check credentials validity |
| QR expired during login | Normal — auto-refreshes up to 3 times | If all 3 fail, re-run Step 5 |

---

## License

MIT
