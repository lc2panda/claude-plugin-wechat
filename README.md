# claude-plugin-wechat

WeChat (微信) channel plugin for Claude Code — receive and reply to WeChat messages directly in your terminal, with media support and remote permission relay. MIT License.

---

**Below is for Claude Code (the AI agent). Follow the steps sequentially. Steps marked [HUMAN] require prompting the user to perform a physical action.**

## Step 0 — Pre-flight checks

```bash
claude --version   # must be >= 2.1.80
bun --version      # must be installed
```

If `bun` is missing, tell the user:
> 请先安装 Bun: `curl -fsSL https://bun.sh/install | bash`，安装后重启终端。

## Step 1 — Locate plugin root

Store the absolute path to this directory as `$PLUGIN_ROOT`.

## Step 2 — Install dependencies

```bash
cd "$PLUGIN_ROOT" && bun install --no-summary
```

Verify `node_modules/@modelcontextprotocol` and `node_modules/zod` exist.

## Step 3 — Build validation

```bash
cd "$PLUGIN_ROOT" && bun build --target=bun server.ts --outdir /tmp/wechat-build-check 2>&1
rm -rf /tmp/wechat-build-check
```

Must output `Bundled ... modules` with zero errors.

## Step 4 — Register plugin

```bash
claude plugin marketplace add lc2panda/claude-plugin-wechat
claude plugin install wechat@lc2panda-plugins
```

Fallback (local, must pass every startup):
```bash
claude --plugin-dir "$PLUGIN_ROOT"
```

## Step 5 — WeChat QR Login [HUMAN]

Check credentials first:
```bash
cat ~/.claude/channels/wechat/credentials.json 2>/dev/null
```

If credentials exist, skip to Step 6. Otherwise:

1. `bun "$PLUGIN_ROOT/login-qr.ts"` — QR renders in terminal
2. Tell user: **请用微信扫描二维码，然后在手机上点击确认。**
3. Extract `qrcode` from last line JSON output
4. `bun "$PLUGIN_ROOT/login-poll.ts" "<qrcode>"`
5. Outputs:
   - `scaned` → **已扫码，请在手机上点击确认...**
   - `refreshed:<token>` → QR auto-refreshed (up to 3x)
   - `expired` / `timeout` → re-run from step 5.1
   - JSON (exit 0) → **Success!** Tell user: **微信连接成功！重启 Claude Code 以启用频道。**

## Step 6 — Start with channel [HUMAN]

Tell user to restart:

> ```
> claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
> ```

## Step 7 — Pair WeChat account [HUMAN]

1. Tell user: **请从微信给机器人发一条消息。**
2. Bot replies with 6-char pairing code
3. Ask user for the code, then run: `/wechat:access pair <code>`

## Step 8 — Verify

A test message from WeChat should arrive as `<channel source="wechat" ...>`. Reply using the `reply` tool.

---

## Plugin capabilities

### MCP Tools

| Tool | Purpose | Params |
|------|---------|--------|
| `reply` | Send text/files to WeChat | `user_id`, `text`, `context_token`, optional `files[]` |
| `download_attachment` | Download media from CDN | `attachment_id` |

### Channel protocol

- Capabilities: `claude/channel` + `claude/channel/permission`
- Inbound: `notifications/claude/channel` → meta `{user_id, context_token, ts}`
- Outbound: `reply` tool (context_token mandatory)
- Permission relay: user replies `yes <code>` / `no <code>` from WeChat
- Media: AES-128-ECB encrypted CDN (image/voice/file/video)

### Skills

| Skill | Use when |
|-------|----------|
| `/wechat:configure` | Login, check status, change base URL |
| `/wechat:access` | Pair, approve, remove users, change DM policy |

### Constraint

WeChat has **no message history API**. Ask the user to paste or summarize earlier context if needed.

---

## State files

All under `~/.claude/channels/wechat/`:

| File | Content |
|------|---------|
| `credentials.json` | Bot auth (token, baseUrl, userId, accountId) |
| `access.json` | Access control (dmPolicy, allowFrom, pending) |
| `sync_buf.txt` | Long-poll cursor |
| `context-tokens.json` | Per-user context_token persistence |
| `inbox/` | Downloaded media attachments |
| `approved/` | Pairing approval markers |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `credentials required` | Run Step 5 (QR login) |
| Channel events not arriving | Restart with `--dangerously-load-development-channels` flag |
| `user X is not allowlisted` | Run `/wechat:access pair <code>` (Step 7) |
| `context_token is required` | Pass context_token from inbound `<channel>` tag |
| `CDN download failed` | Retry; check network |
| `getuploadurl` error | Verify credentials are valid |

---

## License

MIT
