# claude-channel-weixin

WeChat (微信) channel plugin for [Claude Code](https://claude.com/claude-code) — receive and reply to WeChat messages directly in your terminal.

Uses the WeChat iLink Bot API with HTTP long-poll. No public webhook needed.

## Prerequisites

- [Claude Code](https://claude.com/claude-code) v2.1.80+
- [Bun](https://bun.sh) runtime

## Install

```bash
# Add the marketplace (one-time)
claude plugin marketplace add m1heng/claude-plugins

# Install the plugin
claude plugin install weixin@m1heng-plugins
```

## Configure

### Login with QR code

In Claude Code, run:

```
/weixin:configure login
```

This will fetch a QR code from the WeChat iLink Bot API. Scan it with WeChat and confirm on your phone. Credentials are saved automatically.

### Start with channels

```bash
claude --dangerously-load-development-channels plugin:weixin@m1heng-plugins
```

> The `--dangerously-load-development-channels` flag is required during the [channels research preview](https://code.claude.com/docs/en/channels-reference#test-during-the-research-preview) for non-official plugins.

### Pair your WeChat account

1. Send a message to the bot on WeChat — it replies with a pairing code
2. In Claude Code, run `/weixin:access pair <code>` to approve

## Skills

| Skill | Description |
|---|---|
| `/weixin:configure` | QR code login, check channel status |
| `/weixin:access` | Manage pairing, allowlists, DM policy |

## How it works

The plugin runs a local MCP server that long-polls the WeChat iLink Bot API for new messages. No public URL or webhook needed — everything runs locally. Messages from allowed senders are forwarded to your Claude Code session; Claude replies back through the same API.

### Key difference from Telegram/Feishu

WeChat requires a `context_token` to be passed back when replying. This token comes from the inbound message and is automatically included in the channel notification metadata. Claude passes it back through the reply tool.

## License

MIT
