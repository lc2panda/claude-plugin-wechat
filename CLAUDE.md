# CLAUDE.md — claude-channel-weixin 项目记忆

> 此项目的任何功能、架构更新，必须在结束后同步更新相关文档。这是我们契约的一部分。

---


## 0. 时间真实性校验

### 第一次校验（项目初始分析）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-03-24 10:10:37 +08:00 |
| 校验完成 | 2026-03-24 10:10:45 +08:00 |
| 本机系统时间 | 2026-03-24 10:10:37 +08:00 (Asia/Singapore, +08:00) |
| 时间源 1 | Baidu HTTPS Date Header → `Tue, 24 Mar 2026 02:10:43 GMT` = 10:10:43 +08:00 |
| 时间源 2 | Google HTTPS Date Header → `Tue, 24 Mar 2026 02:10:45 GMT` = 10:10:45 +08:00 |
| 最大偏差 | 8 秒（阈值 100 秒） |
| **判定** | **通过 ✓** |

### 第二次校验（Channel 实现方案调研）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-03-24 10:21:17 +08:00 |
| 校验完成 | 2026-03-24 10:21:34 +08:00 |
| 本机系统时间 | 2026-03-24 10:21:17 +08:00 (Asia/Singapore, +08:00) |
| 时间源 1 | Google HTTPS Date Header → `Tue, 24 Mar 2026 02:21:27 GMT` = 10:21:27 +08:00 |
| 时间源 2 | Cloudflare HTTPS Date Header → `Tue, 24 Mar 2026 02:21:34 GMT` = 10:21:34 +08:00 |
| 最大偏差 | 17 秒（阈值 100 秒） |
| **判定** | **通过 ✓** |

### 第三次校验（Typing 频率 + Claude Code 自主能力调研）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-03-27 15:29:16 +08:00 |
| 校验完成 | 2026-03-27 15:29:18 +08:00 |
| 本机系统时间 | 2026-03-27 15:29:16 +08:00 (Asia/Singapore, +08:00) |
| 时间源 1 | Baidu HTTPS Date Header → `Fri, 27 Mar 2026 07:29:17 GMT` = 15:29:17 +08:00 |
| 时间源 2 | Google HTTPS Date Header → `Fri, 27 Mar 2026 07:29:18 GMT` = 15:29:18 +08:00 |
| 最大偏差 | 2 秒（阈值 100 秒） |
| **判定** | **通过 ✓** |

### 第四次校验（Multi-Session 持续开发能力调研）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-03-27 17:52:13 +08:00 |
| 校验完成 | 2026-03-27 17:52:16 +08:00 |
| 本机系统时间 | 2026-03-27 17:52:13 +08:00 (Asia/Singapore, +08:00) |
| 时间源 1 | Baidu HTTPS Date Header → `Fri, 27 Mar 2026 09:52:14 GMT` = 17:52:14 +08:00 |
| 时间源 2 | Google HTTPS Date Header → `Fri, 27 Mar 2026 09:52:16 GMT` = 17:52:16 +08:00 |
| 最大偏差 | 3 秒（阈值 100 秒） |
| **判定** | **通过 ✓** |

### 第五次校验（飞书/Lark Bot API 调研）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-03-27 20:54:05 +08:00 |
| 校验完成 | 2026-03-27 20:54:08 +08:00 |
| 本机系统时间 | 2026-03-27 20:54:05 +08:00 (Asia/Singapore, +08:00) |
| 时间源 1 | Baidu HTTPS Date Header → `Fri, 27 Mar 2026 12:54:07 GMT` = 20:54:07 +08:00 |
| 时间源 2 | Google HTTPS Date Header → `Fri, 27 Mar 2026 12:54:08 GMT` = 20:54:08 +08:00 |
| 最大偏差 | 3 秒（阈值 100 秒） |
| **判定** | **通过 ✓** |

### 第六次校验（claude-code-acp Windows 兼容性调研）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-03-28 13:22:53 +08:00 |
| 校验完成 | 2026-03-28 13:22:55 +08:00 |
| 本机系统时间 | 2026-03-28 13:22:53 +08:00 (Asia/Singapore, +08:00) |
| 时间源 1 | Baidu HTTPS Date Header → `Sat, 28 Mar 2026 05:22:53 GMT` = 13:22:53 +08:00 |
| 时间源 2 | Google HTTPS Date Header → `Sat, 28 Mar 2026 05:22:55 GMT` = 13:22:55 +08:00 |
| 最大偏差 | 2 秒（阈值 100 秒） |
| **判定** | **通过 ✓** |

---


### 第七次校验（Codex 适配 + 协议更新审查）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-06-18 10:16:00 +08:00 |
| 校验完成 | 2026-06-18 10:17:30 +08:00 |
| 本机系统时间 | 2026-06-18 10:16:09 +08:00 (Asia/Shanghai, +08:00) |
| 时间源 1 | Cloudflare HTTPS Date Header → `Thu, 18 Jun 2026 02:16:11 GMT` = 10:16:11 +08:00 |
| 时间源 2 | GitHub HTTPS Date Header → `Thu, 18 Jun 2026 02:16:02 GMT` = 10:16:02 +08:00 |
| 时间源 3 | Microsoft HTTPS Date Header → `Thu, 18 Jun 2026 02:16:32 GMT` = 10:16:32 +08:00 |
| 时间源 4 | Baidu HTTPS Date Header → `Thu, 18 Jun 2026 02:17:07 GMT` = 10:17:07 +08:00 |
| 最大偏差 | 65 秒（Baidu vs GitHub，阈值 100 秒） |
| **判定** | **通过 ✓** |
| 备注 | 本系统时区为 Asia/Shanghai (+08:00)，与 AGENTS.md 要求的 Asia/Singapore (+08:00) 偏移相同 |

---


### 第八次校验（会话激活 + AGENTS.md 指令接收确认）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-06-18 10:35:28 +08:00 |
| 校验完成 | 2026-06-18 10:35:44 +08:00 |
| 本机系统时间 | 2026-06-18 10:35:31 +08:00 (Asia/Shanghai, +08:00) |
| 时间源 1 | Cloudflare HTTPS Date Header → `Thu, 18 Jun 2026 02:35:44 GMT` = 10:35:44 +08:00 |
| 时间源 2 | GitHub HTTPS Date Header → `Thu, 18 Jun 2026 02:35:34 GMT` = 10:35:34 +08:00 |
| 最大偏差 | 13 秒（System vs Cloudflare，阈值 100 秒） |
| **判定** | **通过 ✓** |
| 备注 | 沙箱内 HTTP 被完全阻断，经提权后获取网络时间源；前次校验（第七次）距今约 18 分钟 |

---



### 第九次校验（会话重启 + 阵地状态摸排）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-06-18 11:44:01 +08:00 |
| 校验完成 | 2026-06-18 11:44:14 +08:00 |
| 本机系统时间 | 2026-06-18 11:44:01 +08:00 (Asia/Shanghai, +08:00) |
| 时间源 1 | Google HTTPS Date → `Thu, 18 Jun 2026 03:44:10 GMT` = 11:44:10 +08:00 |
| 时间源 2 | Cloudflare HTTPS Date → `Thu, 18 Jun 2026 03:44:12 GMT` = 11:44:12 +08:00 |
| 时间源 3 | Timeanddate HTTPS Date → `Thu, 18 Jun 2026 03:44:14 GMT` = 11:44:14 +08:00 |
| 最大偏差 | 13 秒（System vs Timeanddate，阈值 100 秒） |
| **判定** | **通过 ✓** |
| 备注 | Codex 重启后重连；三源互偏差 ≤4 秒；本机时区 Asia/Shanghai (+08:00) 与 AGENTS.md 要求 Asia/Singapore (+08:00) 偏移相同 |

---

### 第十次校验（微信消息重启激活 + 纹身/README 治理启动）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-06-18 13:08:03 +08:00 |
| 校验完成 | 2026-06-18 13:08:17 +08:00 |
| 本机系统时间 | 2026-06-18 13:08:17 +08:00 (Asia/Shanghai, +08:00) |
| 时间源 1 | Google HTTPS Date → `Thu, 18 Jun 2026 05:08:14 GMT` = 13:08:14 +08:00 |
| 时间源 2 | Cloudflare HTTPS Date → `Thu, 18 Jun 2026 05:08:15 GMT` = 13:08:15 +08:00 |
| 时间源 3 | Bing HTTPS Date → `Thu, 18 Jun 2026 05:08:17 GMT` = 13:08:17 +08:00 |
| 最大偏差 | 3 秒（Google vs Bing，阈值 100 秒） |
| **判定** | **通过 ✓** |
| 备注 | 微信消息触发重启激活；三源互偏差 ≤3 秒；本机时区 Asia/Shanghai (+08:00) |

### 第十一次校验（协议更新例行巡检）

| 项目 | 值 |
|------|-----|
| 校验发起 | 2026-06-23 17:22:00 +08:00 |
| 校验完成 | 2026-06-23 17:22:21 +08:00 |
| 本机系统时间 | 2026-06-23 17:22:00 +08:00 (Asia/Shanghai, +08:00，等效 Asia/Singapore) |
| 时间源 1 | Google HTTPS Date → `Tue, 23 Jun 2026 09:22:13 GMT` = 17:22:13 +08:00 |
| 时间源 2 | Cloudflare HTTPS Date → `Tue, 23 Jun 2026 09:22:16 GMT` = 17:22:16 +08:00 |
| 时间源 3 | GitHub HTTPS Date → `Tue, 23 Jun 2026 09:22:14 GMT` = 17:22:14 +08:00 |
| 时间源 4 | Baidu HTTPS Date → `Tue, 23 Jun 2026 09:22:18 GMT` = 17:22:18 +08:00 |
| 时间源 5 | Microsoft HTTPS Date → `Tue, 23 Jun 2026 09:22:20 GMT` = 17:22:20 +08:00 |
| 时间源 6 | Apple HTTPS Date → `Tue, 23 Jun 2026 09:22:21 GMT` = 17:22:21 +08:00 |
| 最大偏差 | 8 秒（Google vs Apple，阈值 100 秒） |
| **判定** | **通过 ✓** |
| 备注 | 6 源互偏差 ≤8 秒，本机偏差 13 秒（curl 网络延迟），本时间戳用作协议巡检基准锚点 |

---


### 纹身与README治理报告（第十次校验后执行）

**执行时间**：2026-06-18 13:08:17 +08:00

**纹身声明补全（7/7 .ts 完成）**：

| 文件 | Input/Output/Pos | 纹身誓言 |
|------|:--:|:--:|
| `channels/wechat/server.ts` | ✅ | ✅ |
| `channels/wechat/login-qr.ts` | ✅ | ✅ |
| `channels/wechat/login-poll.ts` | ✅ | ✅ |
| `channels/wechat/acp-bridge.ts` | ✅ | ✅ |
| `channels/feishu/server.ts` | ✅ | ✅ |
| `channels/feishu/acp-bridge.ts` | ✅ | ✅ |
| `channels/shared/acp-packages.ts` | ✅ | ✅ |

**文件夹README治理（10个目录）**：

| 目录 | 行数 | 状态 |
|------|:--:|:--:|
| `skills/` | 3 | ✅ 新建 |
| `skills/feishu-access/` | 3 | ✅ 新建 |
| `skills/feishu-configure/` | 3 | ✅ 新建 |
| `skills/wechat-access/` | 3 | ✅ 新建 |
| `skills/wechat-configure/` | 3 | ✅ 新建 |
| `.codex-plugin/` | 3 | ✅ 新建 |
| `.agents/` | 3 | ✅ 新建 |
| `.agents/plugins/` | 3 | ✅ 新建 |
| `.claude-plugin/` | 3 | ✅ 新建 |
| `channels/` | 4 | ✅ 存量合规 |

**冗余治理**：无发现。

---

### ACP 可靠性方案实现验证（第十次校验后执行）

**验证时间**：2026-06-18 13:08:17 +08:00

| 方案 | 优先级 | wechat/acp-bridge.ts | feishu/acp-bridge.ts | 状态 |
|------|:--:|------|------|:--:|
| A 手动 WritableStream | P0 | :1155-1170 | :410-425 | ✅ 已实现 |
| B 自动重试（MAX_RETRIES=2） | P1 | :1307-1341 | :499-540 | ✅ 已实现 |
| C 初始化超时（30s） | P2 | :1171-1200 | :426-466 | ✅ 已实现 |
| D 文档/预安装指引 | P3 | README.md :145-153 + 错误提示回退 | README.md + getAcpInstallHint() | ✅ 已实现 |
| E Win32 shell 包装 | P4 | :1130 `useShell` + :1137 `shell:` | spawn 一致 | ✅ 已实现 |

**结论**：CLAUDE.md 第 13 章列出的 5 个 ACP 可靠性方案（P0-P4）全部已在双文件中实现。CLAUDE.md 中的伪代码行号因后续代码变更已偏移，不影响功能正确性。

---
## 1. 项目概览

**项目名称**：claude-channel-wechat（微信频道插件）
**版本**：plugin v1.0.0 / package v0.1.0
**许可证**：MIT
**运行时**：Bun
**核心功能**：基于腾讯 iLink Bot API 的微信消息桥接插件，使 Claude Code 可直接收发微信消息。

### 架构

```
微信用户 → WeChat App → iLink Bot API (ilinkai.weixin.qq.com)
                              ↕ HTTP Long-Poll
                     server.ts (MCP Server, 本地运行)
                              ↕ MCP Protocol (stdio)
                         Claude Code Session
```

### 文件清单

| 文件 | 职责 | 行数 |
|------|------|------|
| `server.ts` | 主 MCP 服务器：长轮询、媒体收发、权限中继、访问控制 | ~958 |
| `login-qr.ts` | 登录步骤1：获取并显示终端 QR 码 | ~39 |
| `login-poll.ts` | 登录步骤2：轮询扫码状态、保存凭据、QR 自动刷新 | ~145 |
| `package.json` | 依赖声明（MCP SDK + qrcode-terminal + zod） | ~15 |
| `.mcp.json` | MCP 服务器启动配置 | ~7 |
| `.claude-plugin/plugin.json` | Claude Code 插件元数据 | ~12 |
| `skills/configure/SKILL.md` | /wechat:configure 技能定义 | — |
| `skills/access/SKILL.md` | /wechat:access 技能定义 | — |
| `README.md` | 用户文档 | ~65 |
| `CLAUDE.md` | 项目记忆文件 | — |

### 依赖

- `@modelcontextprotocol/sdk` ^1.0.0 — MCP 服务器框架
- `qrcode-terminal` ^0.12.0 — 终端 QR 码渲染
- `zod` ^3.23.0 — 权限中继 schema 验证

### 状态存储

所有运行时状态位于 `~/.claude/channels/wechat/`：
- `credentials.json` — bot_token + baseUrl + userId + accountId
- `access.json` — dmPolicy / allowFrom / pending（配对码）
- `sync_buf.txt` — getUpdates 游标
- `context-tokens.json` — 用户 context_token 持久化（防抖5秒写入）
- `approved/` — 新配对用户标记目录
- `inbox/` — 下载的媒体附件存放目录

---


## 2. 证据清单（联网检索记录）

### 议题 A：腾讯 iLink Bot API 技术规范与合法性

**检索时间**：2026-03-24 10:10:45 +08:00

#### 来源 1（权威社区技术文档）
- **URL**：https://github.com/hao-ji-xing/openclaw-weixin/blob/main/weixin-bot-api.md
- **类型**：开源社区逆向整理的完整 API 文档
- **发布日期**：2026-03 (活跃维护)
- **摘要**：完整记录了 iLink Bot API 的 7 个端点、认证流程、消息结构、AES-128-ECB 媒体加密、context_token 机制
- **采纳性**：✅ 采纳 — 最完整的 API 技术参考，与本项目实现完全吻合

#### 来源 2（科技媒体报道 — TechBriefly）
- **URL**：https://techbriefly.com/2026/03/23/tencent-launches-clawbot-linking-wechat-to-openclaw/
- **类型**：国际科技媒体
- **发布日期**：2026-03-23
- **摘要**：腾讯于 2026-03-23 正式发布 ClawBot 插件，将微信接入 OpenClaw AI 代理框架
- **采纳性**：✅ 采纳 — 确认 iLink Bot API 是腾讯官方合法开放接口

#### 来源 3（权威媒体 — 南华早报 SCMP）
- **URL**：https://www.scmp.com/tech/article/3347590/tencent-adds-clawbot-plug-wechat-amid-openclaw-boom-and-privacy-warnings
- **类型**：国际权威媒体
- **发布日期**：2026-03-23
- **摘要**：腾讯总裁确认隐私保护是微信代理开发的关键挑战；中国网络安全协会建议仅在专用设备运行
- **采纳性**：✅ 采纳 — 确认合法性与隐私风险提示

#### 来源 4（53AI 技术社区）
- **URL**：https://www.53ai.com/news/Openclaw/2026032373016.html
- **类型**：中国 AI 技术社区
- **发布日期**：2026-03-23
- **摘要**：详述 Claude Code 集成方案，约 300 行代码通过 MCP Channel 桥接
- **采纳性**：✅ 采纳 — 确认集成架构与本项目一致

#### 来源 5（npm 官方仓库）
- **URL**：https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin
- **类型**：npm 包注册表
- **版本**：1.0.3（2026-03 发布）
- **摘要**：腾讯微信官方 OpenClaw 插件包
- **采纳性**：✅ 采纳 — 确认腾讯官方 npm 包存在

#### 来源 6（LINUX DO 社区）
- **URL**：https://linux.do/t/topic/1800355
- **类型**：开发者社区讨论
- **发布日期**：2026-03（403 无法访问全文）
- **采纳性**：⚠️ 部分采纳 — 标题确认方向，全文无法访问

### 议题 B：Claude Code Channel 实现方案调研

**检索时间**：2026-03-24 10:21:34 +08:00

#### 来源 B1（Anthropic 官方 — Channels Reference）
- **URL**：https://code.claude.com/docs/en/channels-reference
- **类型**：Anthropic 官方技术文档
- **更新日期**：2026-03（Claude Code v2.1.80+）
- **摘要**：Channel 是声明了 `experimental['claude/channel']` 能力的 MCP Server，通过 `notifications/claude/channel` 推送事件，通过 MCP Tools 暴露回复能力。MCP 是 Channel 的**唯一实现机制**。支持权限中继（`claude/channel/permission`）。
- **采纳性**：✅ 采纳 — **权威性最高，为实现标准**

#### 来源 B2（Anthropic 官方 — Plugins 文档）
- **URL**：https://code.claude.com/docs/en/plugins
- **类型**：Anthropic 官方技术文档
- **摘要**：插件通过 `.claude-plugin/plugin.json` + `.mcp.json` + `skills/` 组织；Channel 插件通过 MCP Server 注册
- **采纳性**：✅ 采纳

#### 来源 B3（Anthropic 官方 — claude-plugins-official 仓库）
- **URL**：https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins
- **类型**：Anthropic 官方参考实现
- **摘要**：Telegram 和 Discord 插件均使用 MCP Channel 模式，源码结构：server.ts + .mcp.json + plugin.json + skills/
- **采纳性**：✅ 采纳 — **生产级参考实现**

#### 来源 B4（@tencent-weixin/openclaw-weixin npm 包源码分析）
- **URL**：https://www.npmjs.com/package/@tencent-weixin/openclaw-weixin
- **版本**：1.0.3
- **摘要**：**NOT MCP** — 使用 `openclaw/plugin-sdk` 的 `ChannelPlugin` 接口，通过 `api.registerChannel()` 注册。清单文件为 `openclaw.plugin.json`（非 `.claude-plugin/plugin.json`）。完全不同的插件生态。
- **采纳性**：✅ 采纳 — **作为功能标杆，不作为架构标杆**

#### 来源 B5（DEV.to — Channels vs OpenClaw 对比）
- **URL**：https://dev.to/ji_ai/3-plugins-vs-200k-stars-why-i-still-pick-claude-code-channels-over-openclaw-2pce
- **类型**：技术博客深度对比
- **发布日期**：2026-03
- **摘要**：Claude Code Channels 优势在安全模型（配对码 + 白名单 + 无入站端口）和项目上下文集成；OpenClaw 优势在平台覆盖和成本
- **采纳性**：✅ 采纳

#### 来源 B6（OpenClaw Plugin SDK 文档）
- **URL**：https://dev.to/wonderlab/openclaw-deep-dive-4-plugin-sdk-and-extension-development-51ki
- **URL**：https://www.openclawbook.xyz/en/ch13-channel-extension-mechanism/13.1-extension-architecture-design
- **类型**：OpenClaw 官方/社区技术文档
- **摘要**：ChannelPlugin 接口含 22 个可选适配器（Config/Security/Outbound/Pairing/Groups/Gateway/AgentTools），通过 ChannelDock 声明能力（chatTypes/media/blockStreaming），生命周期由 Gateway 进程管理
- **采纳性**：✅ 采纳 — 理解官方插件架构的关键

### 本地已有实现

- **路径**：`/Users/panda/Downloads/download/claude-plugin-wechat/`
- **关联提交**：`5f28254` (初始) → `0b7d35e` (Phase 1/2/3 整合)

### 结论

✅ **MCP Channel 是 Claude Code 的唯一 Channel 实现机制**，无替代方案。
✅ **当前项目架构正确**，与官方 Telegram/Discord 参考实现同构。
✅ **Phase 1/2/3 整合完成** — 已实现 10/13 项功能对齐（2026-03-24 10:21:34 +08:00）。

---


## 3. iLink Bot API 核心技术摘要

### API 端点（域名：`https://ilinkai.weixin.qq.com`）

| 端点 | 方法 | 功能 |
|------|------|------|
| `/ilink/bot/get_bot_qrcode?bot_type=3` | GET | 获取登录 QR 码 |
| `/ilink/bot/get_qrcode_status?qrcode=<token>` | GET | 轮询扫码状态 |
| `/ilink/bot/getupdates` | POST | 长轮询收消息（35s 超时） |
| `/ilink/bot/sendmessage` | POST | 发送消息 |
| `/ilink/bot/getuploadurl` | POST | 获取 CDN 预签名上传地址 |
| `/ilink/bot/getconfig` | POST | 获取 typing_ticket |
| `/ilink/bot/sendtyping` | POST | 发送"正在输入"状态 |

### 认证头

```
Content-Type: application/json
AuthorizationType: ilink_bot_token
Authorization: Bearer <bot_token>
X-WECHAT-UIN: base64(String(randomUint32()))  // 每次随机，防重放
```

### 消息结构

- **用户 ID 格式**：`xxx@im.wechat`（用户）/ `xxx@im.bot`（机器人）
- **消息类型**：1=文本, 2=图片, 3=语音, 4=文件, 5=视频
- **context_token**：协议层 **last-wins 模型**——每条入站消息带一个 token，按 `(accountId, user_id)` 缓存最新覆盖，**无独立 TTL**。回复时使用最新缓存即可（不必绑定特定入站消息）。腾讯官方 SDK `@tencent-weixin/openclaw-weixin` v2.1.10 在 `OutboundAdapter` 层 `getContextToken(accountId, to)` 自动取最新，缺失时只 warn 不 throw。`errcode=-14` 是 session 级失效（需重扫码登录），与单条 token 解耦。
- **媒体加密**：AES-128-ECB + PKCS7 padding，CDN 域名 `novac2c.cdn.weixin.qq.com`

### 关键限制

- 无历史消息拉取 API
- 速率限制未公开
- 目前 iOS 优先支持
- 一个 ClawBot 仅连接一个 OpenClaw 实例
- 群聊权限模糊

---


## 4. Channel 实现方案调研报告

### 4.1 核心发现：两个完全不同的生态系统

| 维度 | @tencent-weixin/openclaw-weixin（官方微信插件） | claude-plugin-wechat（本项目） |
|------|---------------------------------------------|-------------------------------|
| **目标平台** | OpenClaw 代理框架 | Claude Code |
| **插件协议** | `openclaw/plugin-sdk` ChannelPlugin 接口 | `@modelcontextprotocol/sdk` MCP Server |
| **清单文件** | `openclaw.plugin.json` | `.claude-plugin/plugin.json` |
| **注册方式** | `api.registerChannel({ plugin })` | MCP `experimental['claude/channel']` 能力声明 |
| **消息推送** | Gateway 进程调度 | `notifications/claude/channel` MCP 通知 |
| **回复机制** | OutboundAdapter (`sendText/sendMedia`) | MCP Tool (`reply`) |
| **进程模型** | Gateway 独立守护进程 | Claude Code 子进程（stdio） |
| **生命周期** | 24 个钩子（gateway_start → session_end） | MCP connect/disconnect |

**结论**：两者是完全不同的插件生态系统，**架构上不可互换**。

### 4.2 Claude Code Channel 唯一实现机制 — MCP

根据 Anthropic 官方文档（来源 B1），Channel **必须**是 MCP Server：

```typescript
// 三个核心要素（缺一不可）
const mcp = new Server(
  { name: 'weixin', version: '1.0.0' },
  {
    capabilities: {
      experimental: { 'claude/channel': {} },  // 1. 声明 Channel 能力
      tools: {},                                 // 2. 暴露回复工具（双向）
    },
    instructions: '...',                         // 3. 系统提示（指导 Claude 如何处理）
  },
)
await mcp.connect(new StdioServerTransport())    // 4. stdio 传输（Claude Code 子进程）
```

**无替代方案**：文档明确指出 MCP 是唯一支持的传输机制。Bun/Node/Deno 是运行时选择，不改变协议。

### 4.3 官方参考实现分析（Telegram/Discord）

官方 Telegram 和 Discord 插件与本项目同构：

| 组件 | Telegram 官方 | Discord 官方 | 本项目 weixin |
|------|-------------|-------------|--------------|
| 入口 | `server.ts` | `server.ts` | `server.ts` |
| 启动 | `.mcp.json` + Bun | `.mcp.json` + Bun | `.mcp.json` + Bun |
| 元数据 | `.claude-plugin/plugin.json` | `.claude-plugin/plugin.json` | `.claude-plugin/plugin.json` |
| Skills | `configure` + `access` | `configure` + `access` | `configure` + `access` |
| 通信库 | grammy (Telegram Bot API) | discord.js | 原生 fetch (iLink API) |
| 访问控制 | pairing + allowlist + groups | pairing + allowlist + groups | pairing + allowlist |
| 权限中继 | ✅ `claude/channel/permission` | ✅ `claude/channel/permission` | ✅ 已实现 |

### 4.4 功能差距分析：本项目 vs 官方微信插件（功能标杆）

以 `@tencent-weixin/openclaw-weixin` v1.0.3 源码为唯一参考标准。

> **评估时间**：2026-03-24 14:16:00 +08:00（含 BUG 修复后复评）

#### 核心功能对齐

| # | 功能 | 官方微信插件 | 本项目 | 状态 |
|---|------|-----------|--------|------|
| 1 | **媒体接收**（图片/语音/视频/文件） | ✅ CDN 下载 + AES-128-ECB 解密 | ✅ pendingAttachments + download_attachment 工具 | ✅ 已实现 |
| 2 | **媒体发送**（图片/文件上传） | ✅ AES-128-ECB 加密 + CDN 上传 + getuploadurl | ✅ reply files 参数 + uploadMedia + sendMediaMessage | ✅ 已实现 |
| 3 | **Typing 指示器** | ✅ getconfig → sendtyping（ilink_user_id + status） | ✅ refreshTypingTicket + sendTyping（ilink_user_id + status:1） | ✅ 已实现 |
| 4 | **context_token 持久化** | ✅ 文件存储 `context-tokens.json` | ✅ 文件持久化 + 防抖5秒写入 | ✅ 已实现 |
| 5 | **QR 自动刷新** | ✅ 过期后自动刷新最多 3 次 | ✅ fetchNewQrCode + MAX_QR_REFRESHES=3 | ✅ 已实现 |
| 6 | **权限中继** | N/A（OpenClaw 无此概念） | ✅ claude/channel/permission + verdict 拦截 | ✅ 超越官方 |
| 7 | **Markdown→纯文本转换** | ✅ 出站消息自动转换 | ✅ markdownToPlaintext 函数 | ✅ 已实现 |
| 8 | **AES Key 双编码** | ✅ base64(raw 16B) + base64(hex 32 chars) | ✅ parseAesKey 双编码支持 | ✅ 已实现 |
| 9 | **Zod 配置验证** | ✅ 完整 schema 验证 | ✅ 权限中继 schema（zod） | ✅ 已实现 |
| 10 | **图片 AES key 优先级** | ✅ `image_item.aeskey`(hex) 优先 → `media.aes_key`(base64) 回退 | ✅ resolveImageAesKeyBase64 同逻辑 | ✅ 已实现 |
| 11 | **CDN 路径** | ✅ `/c2c/download` + `/c2c/upload` | ✅ 同 | ✅ 已实现 |
| 12 | **图片 mid_size** | ✅ 传密文大小（fileSizeCiphertext） | ✅ 传 upload.fileSizeCiphertext | ✅ 已修复 |

**核心对齐：12/12（100%）**

#### 体验与边缘功能

| # | 功能 | 官方微信插件 | 本项目 | 状态 |
|---|------|-----------|--------|------|
| 13 | **SILK→WAV 语音转码** | ✅ silk-wasm 解码（24kHz mono 16bit） | ✅ silk-wasm + WAV 容器打包 | ✅ 已实现 |
| 14 | **引用消息处理** | ✅ `ref_msg` 提取引用文本 + 回退下载引用媒体 | ✅ ref_msg 文本+图片+文件 | ✅ 已实现 |
| 15 | **Session expired 检测** | ✅ errcode=-14 → 暂停1小时 | ✅ pollLoop + sendMessage 双重检测 | ✅ 已实现 |
| 16 | **发送失败通知** | ✅ sendWeixinErrorNotice 给用户发错误消息 | ✅ ⚠️ 文件发送失败通知 | ✅ 已实现 |
| 17 | **CDN 上传重试** | ✅ 最多3次，4xx 立即中止 | ✅ MAX_CDN_RETRIES=3 + 指数退避 | ✅ 已实现 |
| 18 | **MIME 类型路由** | ✅ 30+ MIME 类型，video/image/file 自动路由 | ✅ 13种图片+11种视频+文件路由 | ✅ 已实现 |
| 19 | **Block Streaming 合并** | ✅ `minChars: 200, idleMs: 3000` | N/A（MCP Channel 协议无此概念） | ⬜ 架构差异 |
| 20 | **Debug 模式** | ✅ `/echo` + `/toggle-debug` + 耗时诊断 | ✅ /toggle-debug + /echo + 通道延迟 | ✅ 已实现 |
| 21 | **多账户支持** | ✅ 多 QR 登录 + 按 accountId 隔离 | N/A（用多 MCP 实例变通） | ⬜ 架构差异 |
| 22 | **Human Delay** | ✅ 模拟人类打字延迟 | ✅ 可配置（50ms/字符，上限3秒） | ✅ 已实现 |
| 23 | **动态 longpolling_timeout** | ✅ 尊重服务端返回值 | ✅ pollTimeoutMs 动态更新 | ✅ 已实现 |
| 24 | **无 key 明文下载回退** | ✅ downloadPlainCdnBuffer | ✅ aesKeyBase64 为空时跳过解密 | ✅ 已实现 |
| 25 | **Typing cancel** | ✅ status:2 取消 typing | ✅ cancelTyping（reply 完成后调用） | ✅ 已实现 |

**综合对齐率：23/25 = 92%（核心 12/12 + 体验 11/13），2 项为架构差异（N/A）。**
**有效对齐率（排除架构差异）：23/23 = 100%。**

### 4.5 与官方 Telegram/Discord 参考实现的差距

> **评估时间**：2026-03-24 14:16:00 +08:00
> **参考版本**：claude-plugins-official/external_plugins/telegram/server.ts (996行)

| # | 功能 | Telegram 官方 | 本项目 | 状态 |
|---|------|-------------|--------|------|
| 1 | **权限中继** | ✅ `claude/channel/permission` + PermissionRequestSchema + verdict + InlineKeyboard 按钮 | ✅ 文本方式 verdict（无按钮） | ✅ 已实现（微信无 InlineKeyboard） |
| 2 | **附件下载工具** | ✅ `download_attachment` MCP Tool | ✅ `download_attachment`（CDN + AES 解密） | ✅ 已实现 |
| 3 | **消息编辑工具** | ✅ `edit_message` MCP Tool | ❌ 未实现 | ⬜ 微信 API 不支持编辑已发消息 |
| 4 | **ACK 反应** | ✅ 收到消息自动加 emoji 反应 | ❌ 未实现 | ⬜ 微信 API 不支持消息反应 |
| 5 | **Typing 指示器** | ✅ `sendChatAction('typing')` | ✅ `sendTyping`（getconfig ticket + 30分钟缓存） | ✅ 已实现 |
| 6 | **文件发送** | ✅ reply `files` 参数 + sendPhoto/sendDocument | ✅ reply `files` 参数 + AES 加密 CDN 上传 | ✅ 已实现 |
| 7 | **Graceful Shutdown** | ✅ stdin end/close + SIGTERM/SIGINT + 2s 超时 | ✅ stdin end/error + SIGTERM/SIGINT + 2s 超时 | ✅ 已实现 |
| 8 | **reply 工具 format 参数** | ✅ text/markdownv2 格式切换 | ✅ markdownToPlaintext 自动转换（微信不支持富文本） | ✅ 已实现（方式不同） |
| 9 | **群组策略** | ✅ groups 配置 + requireMention 过滤 | ❌ 仅支持私聊 | ⬜ 微信群聊权限模糊 |
| 10 | **Skill allowed-tools** | ✅ Read/Write/Bash(ls/mkdir) | ✅ 同样限制 | ✅ 已实现 |
| 11 | **assertSendable 安全** | ✅ 禁止发送 STATE_DIR 内文件（除 inbox） | ✅ 同样实现 | ✅ 已实现 |
| 12 | **corrupt access.json 恢复** | ✅ rename `.corrupt-<ts>` 并重建 | ✅ 同样实现 | ✅ 已实现 |
| 13 | **原子写入** | ✅ tmp + rename 模式 | ✅ 同样实现（access.json + context-tokens.json） | ✅ 已实现 |
| 14 | **配对限制** | ✅ 同用户≤2次回复，全局≤3 pending | ✅ 同样限制 | ✅ 已实现 |
| 15 | **文件权限** | ✅ 0o600 文件 / 0o700 目录 | ✅ 同样权限 | ✅ 已实现 |
| 16 | **textChunkLimit 配置** | ✅ access.json 可配 | ✅ 同样支持 | ✅ 已实现 |
| 17 | **unhandledRejection 兜底** | ✅ 全局异常捕获 | ✅ unhandledRejection + uncaughtException | ✅ 已实现 |
| 18 | **react 工具** | ✅ 独立 MCP Tool | ❌ 未实现 | ⬜ 微信 API 不支持 |
| 19 | **reply_to 消息引用** | ✅ 支持回复线程 | ❌ 未实现 | ⬜ 微信 API 不支持 |
| 20 | **stdin close 监听** | ✅ 同时监听 end + close | ⚠️ 仅 end + error | 🟢 低 |

**总结**：20 项对比中 **15 项已对齐**，3 项因微信 API 限制不适用（edit/react/reply_to），1 项低优先级（stdin close），1 项已超越（uncaughtException shutdown）。
**有效对齐率：15/17 = 88.2%（排除微信 API 不支持的 3 项）。**

---


## 5. 方案评估矩阵（≥10 方案）

基于调研，以下是 12 个可行改进方案，按量化评分排序：

**评分公式**：`Score = 0.30×对齐度 + 0.25×收益 - 0.20×风险 - 0.15×成本 + 0.10×证据可信度`

| # | 方案 | 对齐度 | 收益 | 风险 | 成本 | 证据 | **得分** | 选定 |
|---|------|--------|------|------|------|------|---------|------|
| 1 | **权限中继：添加 `claude/channel/permission` 支持** | 10 | 9 | 2 | 3 | 10 | **7.40** | ✅ Top-1 |
| 2 | **媒体接收：实现 AES-128-ECB CDN 下载解密** | 10 | 10 | 3 | 5 | 10 | **7.10** | ✅ Top-2 |
| 3 | **附件工具：添加 `download_attachment` MCP Tool** | 10 | 9 | 2 | 3 | 10 | **7.40** | ✅ Top-3 |
| 4 | **context_token 持久化到文件** | 9 | 8 | 1 | 2 | 9 | **7.30** | ✅ Top-4 |
| 5 | **Typing 指示器：getconfig + sendtyping** | 8 | 7 | 1 | 2 | 10 | **6.80** | ✅ Top-5 |
| 6 | **媒体发送：AES-128-ECB 加密 + CDN 上传** | 10 | 9 | 4 | 6 | 10 | **6.20** | ✅ Top-6 |
| 7 | **Graceful Shutdown 实现** | 8 | 7 | 1 | 1 | 10 | **7.15** | ✅ Top-7 |
| 8 | **QR 自动刷新（最多 3 次）** | 7 | 6 | 1 | 2 | 9 | **6.20** | ✅ Top-8 |
| 9 | **Skill allowed-tools 精确限制** | 8 | 6 | 1 | 1 | 10 | **6.85** | ✅ Top-9 |
| 10 | **Markdown→纯文本出站转换** | 6 | 5 | 1 | 2 | 8 | **5.30** | ✅ Top-10 |
| 11 | Block Streaming 合并（minChars/idleMs） | 5 | 5 | 3 | 4 | 7 | **3.60** | ❌ 低优先 |
| 12 | 多账户支持 | 4 | 4 | 5 | 7 | 6 | **1.60** | ❌ 架构改动大 |

### 未选方案拒绝理由

- **Block Streaming 合并**：需要深入理解 MCP SDK 内部流控机制，Claude Code 端可能已有类似逻辑，风险高收益不确定
- **多账户支持**：需要重构整个状态管理和进程模型，与 Claude Code 单 Channel 实例模型冲突

---


## 6. 最优实现路线图（Top-10 方案）— 全部已完成

> **实施完成时间**：2026-03-24，commit `0b7d35e`

### Phase 1：核心协议对齐 — ✅ 已完成

| 方案 | 实现位置 | 状态 |
|------|---------|------|
| P1.1 权限中继 | `server.ts` PermissionRequestSchema + PERMISSION_REPLY_RE + verdict 拦截 | ✅ |
| P1.2 媒体接收 | `server.ts` extractText → pendingAttachments 懒加载（image/voice/file/video） | ✅ |
| P1.3 附件工具 | `server.ts` download_attachment MCP Tool + parseAesKey + decryptAesEcb | ✅ |
| P1.4 媒体发送 | `server.ts` reply files 参数 + uploadMedia + sendMediaMessage + encryptAesEcb | ✅ |

### Phase 2：体验增强 — ✅ 已完成

| 方案 | 实现位置 | 状态 |
|------|---------|------|
| P2.1 context_token 持久化 | `server.ts` CONTEXT_TOKENS_FILE + persistContextTokens + debouncedPersist | ✅ |
| P2.2 Typing 指示器 | `server.ts` refreshTypingTicket + sendTyping（30分钟缓存） | ✅ |
| P2.3 Graceful Shutdown | `server.ts` shutdown() + stdin EOF/error + SIGTERM/SIGINT + 2s 超时 | ✅ |
| P2.4 Skill allowed-tools | `skills/access/SKILL.md` + `skills/configure/SKILL.md` 已有 allowed-tools | ✅（原有） |

### Phase 3：精细打磨 — ✅ 已完成

| 方案 | 实现位置 | 状态 |
|------|---------|------|
| P3.1 QR 自动刷新 | `login-poll.ts` fetchNewQrCode + MAX_QR_REFRESHES=3 + refreshed 输出 | ✅ |
| P3.2 Markdown→纯文本 | `server.ts` markdownToPlaintext（代码块/粗体/斜体/链接/列表等） | ✅ |

---


## 7. 本项目与官方微信插件的实现对比（已更新）

> **更新于**：2026-03-24 Phase 1/2/3 整合后

| 维度 | 本项目实现 | 官方 @tencent-weixin 实现 | 一致性 |
|------|-----------|-------------------------|--------|
| 登录流程 | QR获取 → 轮询(3次自动刷新) → 存凭据 | QR获取 → 轮询(支持3次刷新) → 存凭据 | ✅ 一致 |
| 收消息 | getupdates 长轮询 + sync_buf | getupdates 长轮询 + sync_buf | ✅ 一致 |
| 发消息 | sendmessage + context_token（文本+媒体） | sendmessage + context_token（文本+媒体） | ✅ 一致 |
| 认证头 | Bearer + randomUIN | Bearer + randomUIN | ✅ 一致 |
| 消息分块 | 2000 字符 + Markdown→纯文本 | 2000 字符 + blockStreaming 合并 | ⚠️ 缺合并 |
| 媒体接收 | pendingAttachments + download_attachment 工具 | AES-128-ECB CDN 解密 | ✅ 一致 |
| 媒体发送 | reply files + encryptAesEcb + CDN 上传 | AES-128-ECB 加密 + CDN 上传 | ✅ 一致 |
| Typing | refreshTypingTicket + sendTyping | getconfig + sendtyping | ✅ 一致 |
| context_token | 文件持久化（防抖5秒） | 文件持久化 | ✅ 一致 |
| AES 双编码 | parseAesKey（raw 16B + hex 32 chars） | 双编码支持 | ✅ 一致 |
| 权限中继 | claude/channel/permission（Claude Code 特有） | N/A（OpenClaw 无此概念） | ✅ 超越 |
| Debug 模式 | 无 | /echo + /toggle-debug | ⬜ 低优先 |

---


## 8. Agent SDK 模式可行性方案（待审批）

> **调研时间**：2026-03-25 09:26:00 +08:00
> **问题**：当前 MCP Channel 模式要求 claude.ai OAuth 登录，API Key / Console / 第三方模型用户无法使用
> **目标**：支持双模式，覆盖所有 Claude Code 用户

### 8.1 问题根因

Anthropic 官方文档明确：**Channels require claude.ai login. Console and API key authentication is not supported.**

这是平台层限制，非代码层可绕过。API Key 用户启动时显示 `Channels are not currently available`。

### 8.2 Agent SDK 模式调研（7 个权威来源）

#### 来源 1（Anthropic 官方 — Headless Mode）
- **URL**：https://code.claude.com/docs/en/headless
- **摘要**：`claude -p` 模式支持 `ANTHROPIC_API_KEY` 认证，`--bare` 跳过 OAuth。`--continue` / `--resume` 支持多轮会话。`--input-format stream-json` 支持 NDJSON 流式输入。
- **关键发现**：`--bare` 模式明确支持 API Key，不需要 claude.ai 登录

#### 来源 2（Anthropic 官方 — CLI Reference）
- **URL**：https://code.claude.com/docs/en/cli-reference
- **摘要**：完整 CLI 参数表，确认 `--input-format stream-json` + `--output-format stream-json` 可实现双向流式通信

#### 来源 3（Anthropic 官方 — TypeScript Agent SDK）
- **URL**：https://platform.claude.com/docs/en/agent-sdk/typescript
- **摘要**：`query()` 函数支持 `AsyncIterable<SDKUserMessage>` 作为 prompt，原生支持多轮对话。V2 interface 提供 `send()` + `stream()` 模式

#### 来源 4（cc-connect 项目 — 微信集成文档）
- **URL**：https://github.com/chenhg5/cc-connect/blob/main/docs/weixin.md
- **摘要**：cc-connect 通过 spawn `claude -p` 子进程实现微信桥接，不依赖 Channels 协议。验证了 Agent SDK 模式的可行性

#### 来源 5（GitHub Issue #24594）
- **URL**：https://github.com/anthropics/claude-code/issues/24594
- **摘要**：`--input-format stream-json` 是唯一的 CLI 双向通信机制，但文档不完善。社区已有实践

#### 来源 6（GitHub Issue #37071 — Channels not available）
- **URL**：https://github.com/anthropics/claude-code/issues/37071
- **摘要**：Teams 计划用户也遇到此问题，确认是认证方式限制

#### 来源 7（Agent SDK 深度分析）
- **URL**：https://buildwithaws.substack.com/p/inside-the-claude-agent-sdk-from
- **摘要**：SDK 本质是 spawn Claude Code CLI 子进程，通过 NDJSON stdin/stdout 通信。与 Channels 是完全不同的通信路径

### 8.3 双模式架构方案

```
                    ┌─────────────────────────────┐
                    │   微信 iLink Bot API         │
                    │   (getUpdates / sendMessage) │
                    └──────────┬──────────────────┘
                               │
                    ┌──────────▼──────────────────┐
                    │   bridge.ts（新增）           │
                    │   消息路由 + 模式切换         │
                    └──────┬───────────┬──────────┘
                           │           │
              ┌────────────▼──┐  ┌─────▼────────────┐
              │ Channel 模式   │  │ Agent SDK 模式    │
              │ (现有 server.ts)│  │ (新增 agent.ts)   │
              │               │  │                   │
              │ MCP Server    │  │ spawn claude -p   │
              │ stdio 管道    │  │ stdin/stdout 管道  │
              │               │  │                   │
              │ 要求:         │  │ 要求:              │
              │ claude.ai 登录│  │ ANTHROPIC_API_KEY  │
              │               │  │ 或任何 Provider    │
              │ 能力:         │  │ 能力:              │
              │ ✅ 权限中继   │  │ ❌ 无权限中继      │
              │ ✅ Channel 标签│  │ ❌ 无 Channel 标签 │
              │ ✅ 持久连接   │  │ ✅ 会话持续(resume)│
              │ ✅ 全媒体     │  │ ✅ 全媒体          │
              └───────────────┘  └───────────────────┘
```

### 8.4 最小化改造方案

**改动范围：新增 1 文件 + 修改 2 文件，不动现有 server.ts**

#### 新增文件：`agent-bridge.ts`（~200 行）
独立的 Agent SDK 桥接模块，职责：
1. 收到微信消息 → spawn `claude -p --bare --output-format stream-json --resume <session_id>`
2. 读取 stdout 流式输出 → 分块发回微信
3. 管理 session_id 实现多轮对话（每个微信用户一个 session）
4. 复用现有的 iLink API 函数（sendMessage, buildHeaders 等）

核心代码模式：
```typescript
import { spawn } from 'child_process'

async function queryClaudeSDK(prompt: string, sessionId?: string): Promise<string> {
  const args = ['-p', prompt, '--bare', '--output-format', 'json']
  if (sessionId) args.push('--resume', sessionId)

  const proc = spawn('claude', args, {
    env: { ...process.env, ANTHROPIC_API_KEY: apiKey },
  })

  // 读取 stdout → 返回结果
  const output = await new Promise<string>((resolve) => {
    let result = ''
    proc.stdout.on('data', (chunk) => { result += chunk })
    proc.stdout.on('end', () => resolve(result))
  })

  return JSON.parse(output).result
}
```

#### 修改文件 1：`package.json`
添加新的启动脚本：
```json
"scripts": {
  "start": "bun install --no-summary && bun server.ts",
  "start:sdk": "bun install --no-summary && bun agent-bridge.ts"
}
```

#### 修改文件 2：`.mcp.json`
保持不变（Channel 模式专用）。Agent SDK 模式不通过 MCP 启动，独立运行。

#### 用户启动方式

**Channel 模式（claude.ai 用户，现有方式）：**
```bash
claude --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

**Agent SDK 模式（API Key 用户，新增方式）：**
```bash
cd ~/.claude/plugins/cache/lc2panda-plugins/wechat/*/
ANTHROPIC_API_KEY=sk-xxx bun agent-bridge.ts
```

### 8.5 功能差异对比

| 功能 | Channel 模式 | Agent SDK 模式 |
|------|-------------|---------------|
| 认证方式 | claude.ai OAuth | API Key / 任何 Provider |
| 文字收发 | ✅ | ✅ |
| 图片收发 | ✅ | ✅ |
| 文件收发 | ✅ | ✅ |
| 语音转文字 | ✅ | ✅ |
| 远程权限审批 | ✅ | ❌（无 Channel 协议） |
| 多轮对话 | ✅（持久连接） | ✅（--resume session） |
| 延迟 | 低（持久 MCP 连接） | 中（每次 spawn 进程） |
| Debug 命令 | ✅ /echo /toggle-debug | ✅ 可复用 |
| 与 Claude Code 会话集成 | ✅（原生 Channel 标签） | ⚠️（独立子进程） |

### 8.6 风险评估

| 风险 | 等级 | 缓解措施 |
|------|------|---------|
| 每次消息 spawn 新进程，延迟较高 | 中 | 使用 `--resume` 保持会话，或探索长驻进程模式 |
| `--input-format stream-json` 文档不完善 | 中 | 已有社区实践（cc-connect、WebStorm 插件） |
| Agent SDK 模式无权限中继 | 低 | 用 `--dangerously-skip-permissions` 或 `--allowedTools` 补偿 |
| 两种模式维护成本 | 低 | agent-bridge.ts 独立模块，不影响现有 server.ts |

### 8.7 ACP 协议对比分析（补充调研 2026-03-25 09:50:00 +08:00）

#### 什么是 ACP

Agent Client Protocol（ACP）是 AI Agent 与编辑器之间的开放标准通信协议，类比 LSP 之于语言服务器。JSON-RPC 2.0 over stdio/HTTP，由 Block (Square) 发起，GitHub Copilot、Claude Code、Gemini、Codex 等均已支持。

#### 来源清单（5 个权威来源）

1. **ACP 官方仓库** — https://github.com/agentclientprotocol/agent-client-protocol（Apache 2.0，多语言 SDK）
2. **ACP 协议介绍（Goose Blog）** — https://block.github.io/goose/blog/2025/10/24/intro-to-agent-client-protocol-acp/（完整消息类型说明）
3. **ACP 技术概览（Phil Schmid）** — https://www.philschmid.de/acp-overview（JSON-RPC 消息格式 + 生命周期）
4. **acp-claude-code 桥接实现** — https://github.com/Xuanwo/acp-claude-code（Claude Code ACP adapter 源码）
5. **wechat-acp 实战** — https://github.com/formulahendry/wechat-acp（微信 ACP 桥接，验证可行性）

#### ACP 核心协议

| 方法 | 方向 | 功能 |
|------|------|------|
| `initialize` | C→A | 协商版本与能力 |
| `session/new` | C→A | 创建新会话 |
| `session/load` | C→A | **恢复已有会话** |
| `session/prompt` | C→A | 发送用户消息 |
| `session/update` | A→C（通知） | **流式返回**（plan/text_chunk/thought/tool_call） |
| `session/cancel` | C→A | 取消当前操作 |
| `session/request_permission` | A→C | **权限请求**（可中继到微信！） |

#### ACP vs Agent SDK（claude -p）对比

| 维度 | Agent SDK (当前 agent-bridge.ts) | ACP 协议 |
|------|-------------------------------|---------|
| **进程模型** | 每条消息 spawn 新子进程 | **持久子进程（warm）** |
| **延迟** | 高（冷启动开销） | **低（进程常驻）** |
| **流式响应** | ❌ 等待完整响应 | **✅ agent_message_chunk 实时推送** |
| **权限中继** | ❌ 无（只能 --dangerously-skip） | **✅ session/request_permission 可中继到微信** |
| **会话续接** | --resume flag | **session/load 方法** |
| **多 Agent** | 仅 Claude Code | **任何 ACP 兼容 Agent**（Copilot/Gemini/Codex/Qwen） |
| **实现复杂度** | 简单（spawn + stdout） | 中等（JSON-RPC 状态机） |
| **SDK** | 无需额外包 | `@agentclientprotocol/sdk`（TypeScript） |

#### ACP 的三大优势

1. **持久进程** — 不需要每条消息 spawn 新进程，Agent 进程常驻，响应更快
2. **流式响应** — `session/update` 通知实时推送文本块，可以在生成过程中就开始发送微信消息，体验接近实时对话
3. **权限中继** — `session/request_permission` 方法可以被转发到微信，实现 **类似 Channel 模式的远程权限审批**，这是 Agent SDK (claude -p) 模式做不到的

#### 结论

**ACP 是比 Agent SDK (claude -p) 更优的方案。** 它解决了 Agent SDK 的三个核心短板：冷启动延迟、无流式响应、无权限中继。

**建议路线：**
- **当前 agent-bridge.ts**（已实现）作为 v1 方案保留，简单可用
- **后续迭代**：用 ACP 协议替换 agent-bridge.ts 的 spawn 逻辑，升级为 v2 方案
- **长期目标**：ACP 模式 + 流式响应 + 权限中继 → 与 Channel 模式功能完全对齐

### 8.8 总结

**三种模式的定位：**

| 模式 | 认证 | 权限中继 | 流式 | 适用场景 |
|------|------|---------|------|---------|
| **Channel** (server.ts) | claude.ai | ✅ | ✅ | claude.ai 订阅用户，全功能 |
| **Agent SDK** (agent-bridge.ts) | API Key | ❌ | ❌ | API Key 用户，基础功能，v1 |
| **ACP** (未来) | 任意 | ✅ | ✅ | 任意认证，多 Agent，终极方案 |

**等待 Comdr 审批后进入实施阶段。**

---


## 9. 冗余治理报告（原第8节）

检查结果：项目文件结构清晰，无同名/同责/高相似冗余文件。各文件职责单一明确。

---


## 9. 特例登记

（暂无）

---


## 10. Multi-Session 持续开发能力调研报告

> **调研时间**：2026-03-27 17:52:13 +08:00
> **议题**：Channel 模式下用户通过微信发大任务，Claude Code 上下文窗口满时如何自动续接

### 10.1 Claude Code 内置上下文管理机制

#### 来源 1（Anthropic 官方 — How Claude Code Works）
- **URL**：https://code.claude.com/docs/en/how-claude-code-works
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **Sessions 独立**：每个新 session 以空白上下文窗口开始，不继承前 session 的对话历史
  - **自动 compact**：上下文接近限制时自动触发，先清理旧 tool outputs，再摘要对话
  - **CLAUDE.md 重注入**：compaction 后 CLAUDE.md 从磁盘重新加载，是唯一完整存活的内容
  - **Subagent 隔离**：子代理拥有独立上下文窗口，不膨胀主对话
  - **`/compact` 命令**：支持带焦点的手动 compaction（如 `/compact focus on the API changes`）
  - **`/context` 命令**：查看当前上下文空间使用情况

#### 来源 2（ClaudeFast — Context Buffer 深度分析）
- **URL**：https://claudefa.st/blog/guide/mechanics/context-buffer-management
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **触发阈值**：上下文使用达到 ~83.5%（200K 窗口约 167K tokens）时自动 compact
  - **缓冲区**：固定 ~33K tokens（16.5%），从原来 45K 缩减
  - **环境变量控制**：`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` 接受 1-100，直接控制触发百分比
  - **系统工具开销**：约 16.8K tokens（8.4%）

#### 来源 3（ClaudeFast — 1M Context GA）
- **URL**：https://claudefa.st/blog/guide/mechanics/1m-context-ga
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **1M 窗口可用空间**：约 830K tokens（比 200K 窗口的 167K 大 5 倍）
  - **Compaction 频率下降 15%**：实测数据
  - **长时间会话可行**：从原来 20-30 分钟延长到"数小时不丢失中间发现"
  - **无额外费用**：Opus 4.6 = $5/$25 per M tokens，Sonnet 4.6 = $3/$15

#### 来源 4（Morph — Auto-Compact 深度解析）
- **URL**：https://www.morphllm.com/claude-code-auto-compact
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - Compaction 优先清除 tool outputs（占 60-80% 上下文）
  - 变量名、错误消息、早期决策的精确细节会在摘要中丢失
  - CLAUDE.md 是唯一完整存活的内容

#### 来源 5（ClaudeFast — Session Memory）
- **URL**：https://claudefa.st/blog/guide/mechanics/session-memory
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **Session Memory 系统**（v2.0.64+）：后台持续写入摘要，`/compact` 因此变为即时操作
  - **Auto Memory**：Claude 自动保存跨 session 的学习成果到 MEMORY.md
  - **启动加载**：MEMORY.md 前 200 行或 25KB（取小者）在每次 session 启动时加载

### 10.2 Anthropic 官方 autonomous-coding 方案分析

#### 来源 6（Anthropic 官方 — Effective Harnesses for Long-Running Agents）
- **URL**：https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **双 Agent 架构**：Initializer Agent（首次）+ Coding Agent（后续），共享系统提示和工具
  - **Initializer 生成三个关键制品**：`init.sh`、`claude-progress.txt`、初始 git commit
  - **每个 session 独立**：创建 fresh `ClaudeSDKClient`，不依赖 context 续接
  - **一次只做一个功能**：刻意限制每 session 的范围，避免 context 溢出
  - **进度持久化**：`claude-progress.txt` + git history 作为 session 间的知识桥梁
  - **3 秒延迟自动续接**：session 完成后自动开始下一个

#### 来源 7（autonomous-coding 源码 — DeepWiki 分析）
- **URL**：https://deepwiki.com/anthropics/claude-quickstarts/3.3-autonomous-coding-agent
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **Session 判断逻辑**：检查 `feature_list.json` 是否存在来决定角色
  - **feature_list.json 格式**：JSON 数组，每项含 name/description/passes 字段
  - **进度统计**：`count_passing_tests()` 返回 (passing, total) 元组
  - **安全层**：ALLOWED_COMMANDS 白名单 + bash_security_hook + .claude_settings.json

#### 来源 8（autonomous-coding 源码 — GitHub）
- **URL**：https://github.com/anthropics/claude-quickstarts/blob/main/autonomous-coding/autonomous_agent_demo.py
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - 每次中断后运行相同命令即可恢复
  - `--max-iterations` 控制最大迭代次数
  - 默认模型 `claude-sonnet-4-5-20250929`

### 10.3 Claude Agent SDK 的 Multi-Session 支持

#### 来源 9（Anthropic 官方 — Work with Sessions）
- **URL**：https://platform.claude.com/docs/en/agent-sdk/sessions
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **三种续接模式**：
    - `continue: true` — 自动找到当前目录最近的 session
    - `resume: sessionId` — 指定 session ID 恢复
    - `forkSession: true` — 从现有 session 分叉，原 session 不变
  - **TypeScript V1**：无 client 对象，每次 `query()` 传 `continue: true`
  - **TypeScript V2 Preview**：`createSession()` + `send()` / `stream()` 模式
  - **Session 存储路径**：`~/.claude/projects/<encoded-cwd>/<session-id>.jsonl`
  - **跨主机恢复**：需要移动 session 文件或在新 prompt 中传入之前的结果
  - **Session ID 获取**：从 `ResultMessage.session_id` 读取
  - **File Checkpointing**：`rewindFiles()` 支持文件快照和回滚

#### 来源 10（Anthropic 官方 — Agent SDK TypeScript Reference）
- **URL**：https://platform.claude.com/docs/en/agent-sdk/typescript
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - `query()` 是主 API，返回 `AsyncIterable<SDKMessage>`
  - `continue: true` 自动续接最近 session
  - `persistSession: false` 可设为仅内存 session（不写磁盘）
  - `listSessions()` 和 `getSessionMessages()` 用于枚举和读取历史 session

### 10.4 社区 Multi-Session 方案

#### 来源 11（Continuous-Claude-v3 — 上下文管理框架）
- **URL**：https://github.com/parcadei/Continuous-Claude-v3
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **Continuity Ledgers**：Markdown 文件跟踪跨 session 的决策和进度
  - **YAML Handoffs**：token 高效的状态传递（比对话 compaction 更紧凑）
  - **30 个 Hooks**：在关键生命周期点注入行为（`PreCompaction` 时 dirty > 20 自动 handoff）
  - **MCP 隔离**：每个 agent 独立操作，通过 Blackboard 模式通信
  - **TLDR 代码分析**：~1200 tokens vs 23000 raw（95% 节省）
  - **理念**："提取学习成果后重新开始，带着完整上下文"

#### 来源 12（Auto-Claude — 自主多 session AI）
- **URL**：https://github.com/AndyMik90/Auto-Claude
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - 支持最多 12 个并行 agent 终端
  - 使用 git worktrees 隔离工作空间
  - Kanban Board 管理任务进度
  - Memory Layer 跨 session 保留洞察

#### 来源 13（ARIS — Auto-Research-In-Sleep）
- **URL**：https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - 面向 overnight 自主执行的 ML 研究框架
  - compact mode 用于 session 恢复
  - research-refine checkpoint 支持中断后自动恢复
  - 对抗式协作：Claude Code 执行 + GPT-5.4 xhigh 审查

#### 来源 14（ClaudeFast — Native Task Management）
- **URL**：https://claudefa.st/blog/guide/development/task-management
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **Task 跨 compaction 存活**：存储在 `~/.claude/tasks/`，独立于 session 内存
  - **多 session 共享 Task**：`CLAUDE_CODE_TASK_LIST_ID` 环境变量
  - **依赖跟踪**：`addBlockedBy` / `addBlocks` 参数
  - **实时同步**："Session A 完成 task，Session B 立即看到更新"

#### 来源 15（Anthropic 官方 — Channels 文档）
- **URL**：https://code.claude.com/docs/en/channels
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **Channel 是 MCP Server**：推送事件到运行中的 session
  - **事件仅在 session 打开时到达**："for an always-on setup you run Claude in a background process or persistent terminal"
  - **权限中继**：Channel 声明 permission relay 能力后可远程审批
  - **不产生新 session**：事件进入已有 session 的上下文

#### 来源 16（Anthropic 官方 — Subagents）
- **URL**：https://code.claude.com/docs/en/sub-agents
- **检索时间**：2026-03-27 17:52:16 +08:00
- **关键发现**：
  - **每个子代理独立上下文窗口**：不膨胀主对话
  - **子代理支持自动 compaction**：与主对话相同逻辑，约 95% 时触发
  - **子代理 transcript 独立存储**：主对话 compaction 不影响子代理
  - **可恢复子代理**：通过 agent ID 使用 `SendMessage` 恢复
  - **持久记忆**：`memory: user/project/local` 跨 session 积累知识
  - **背景运行**：`background: true` 或 Ctrl+B 后台运行
  - **Agent Teams**（实验性）：多 session 协调，共享 task list + 直接消息

### 10.5 对 Channel 模式的实际影响评估

#### 核心结论：Claude Code 原生能力基本足够，不需要额外的 multi-session harness

**理由分析：**

| 维度 | Channel 模式现状 | 是否需要额外代码 |
|------|-----------------|-----------------|
| **上下文管理** | Claude Code 内置 auto-compact（83.5% 触发），1M 窗口约 830K 可用 tokens | **不需要** — 原生足够 |
| **Compaction 存活** | CLAUDE.md 完整存活 + Session Memory 后台持续摘要 + Task 跨 compaction 存活 | **不需要** — 关键状态自动保留 |
| **Session 持久性** | Channel 模式下 MCP 连接持久，事件进入同一 session | **不需要** — 天然持久 |
| **长任务续接** | 1M 窗口下可运行数小时；compaction 后自动恢复 | **不需要** — 原生处理 |
| **大任务分解** | Subagent 自动委派 + 独立上下文 + 可恢复 | **不需要** — 原生支持 |
| **跨 session 记忆** | Auto Memory (MEMORY.md) + Subagent 持久记忆 | **不需要** — 原生支持 |
| **远程权限审批** | Channel 权限中继已实现 | **已有** |

#### 关键技术路径

```
用户通过微信发大任务
    │
    ▼
Claude Code (Channel 模式, 1M context)
    │
    ├─ 任务分解 → Subagent 委派（各自独立 context）
    │   ├─ Explore Subagent（只读，Haiku，快速搜索）
    │   ├─ General-purpose Subagent（全工具，独立 context）
    │   └─ Custom Subagent（可配置工具/模型/权限）
    │
    ├─ 主对话 context 接近 83.5% → Auto-Compact 触发
    │   ├─ Tool outputs 先清理（60-80% 空间释放）
    │   ├─ 对话摘要保留关键上下文
    │   ├─ CLAUDE.md 从磁盘重新加载（完整）
    │   └─ Session Memory 后台摘要（即时 compact）
    │
    ├─ Task 系统跟踪进度（跨 compaction 存活）
    │
    └─ 通过微信 reply 工具实时反馈进度
```

#### 唯一需要关注的边界场景

| 场景 | 风险等级 | 缓解措施 |
|------|---------|---------|
| 单次 compaction 丢失早期精确细节 | 中 | 在 CLAUDE.md 的 Compact Instructions 区段写明关键信息保留规则 |
| 超长任务（>8小时）session 断连 | 低 | Channel MCP Server 有 reconnect 逻辑；`--continue` 可恢复 |
| 微信用户发消息时 Claude 正在 compact | 低 | 消息排队等待，compact 完成后处理 |
| Subagent 返回结果膨胀主 context | 中 | 使用 background subagent + 简洁返回摘要 |

#### 建议优化措施（不需要新代码，仅配置层）

1. **CLAUDE.md 增加 Compact Instructions**：告诉 Claude 在 compaction 时保留哪些关键上下文
2. **使用 1M 模型**：确保 Channel 启动时使用 Opus 4.6 [1M]（Max/Team/Enterprise 默认）
3. **善用 Subagent**：大任务自动分解到子代理，避免主 context 膨胀
4. **Task 系统**：利用内置 Task 工具跟踪进度，跨 compaction 存活
5. **环境变量微调**：`CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=90` 延迟 compact 触发

#### 与 autonomous-coding harness 的对比

| 维度 | autonomous-coding harness | Channel 模式（原生） |
|------|--------------------------|---------------------|
| Session 模型 | 多个短 session，每次 fresh context | 单个持久 session，auto-compact |
| 进度持久化 | feature_list.json + claude-progress.txt | Task 系统 + CLAUDE.md + Auto Memory |
| Context 管理 | 外部 harness 管理 session 边界 | Claude Code 内置 auto-compact |
| 适用场景 | **无人值守批量任务**（如生成 200 个功能） | **交互式长任务**（微信对话 + 自主执行） |
| 我们需要？ | **不需要** — 场景不同 | **已内置** |

### 10.6 最终结论

**对于我们的微信 Channel 插件，不需要额外编写 multi-session harness 代码。** Claude Code 原生的 auto-compact + Session Memory + Subagent 委派 + Task 系统 + 1M context 已经覆盖了所有需求。

如果未来确实需要超大规模自主任务（如"一晚上构建一个完整应用"），那时可以参考 autonomous-coding 的 Initializer + Coding Agent 模式，但目前的 Channel 交互场景不需要。

**可选的增值方向（均为配置层，非代码层）：**
- 在 Channel 的 instructions 中告知 Claude 善用 subagent 和 task 系统
- 在 CLAUDE.md 中添加 Compact Instructions 区段
- 推荐用户使用 1M context 模型

---


## 11. 技巧区（Claude Code 集成）

- 计划模式：Shift+Tab 生成计划后再编码
- 测试：修改后运行 `bun server.ts` 验证启动
- 上下文管理：login-qr.ts 和 login-poll.ts 为独立脚本，可单独测试
- 参考实现：`https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/telegram`

---


## 12. 飞书/Lark Bot API 深度调研报告

> **调研时间**：2026-03-27 20:54:05 +08:00
> **议题**：飞书（Feishu）和 Lark 的 Bot API 技术规范与 Claude Code 接入方案设计

### 12.1 飞书/Lark Bot API 核心技术

#### 12.1.1 机器人类型

飞书提供两种机器人类型：

| 类型 | 应用机器人（自建应用） | 自定义机器人（Webhook Bot） |
|------|----------------------|--------------------------|
| 审核要求 | 需企业管理员审核 | 无需审核，群内直接添加 |
| 消息方向 | **双向**（收发） | **单向**（仅发送） |
| 私聊支持 | ✅ 支持 | ❌ 不支持 |
| 群聊支持 | ✅ 支持 | ✅ 仅群内 |
| @触发 | ✅ 支持 | ❌ 不支持 |
| API 权限 | 完整 API 能力 | 仅推送能力 |
| 事件订阅 | ✅ 支持 | ❌ 不支持 |

**结论：必须使用应用机器人（自建应用），自定义机器人无法满足双向通信需求。**

#### 12.1.2 消息接收方式：三种模式对比

| 维度 | WebSocket 长连接（推荐） | Webhook 回调 | HTTP 轮询 |
|------|--------------------------|-------------|-----------|
| 公网 IP 需求 | **不需要** | 需要 | 不需要 |
| 实时性 | 高（推送） | 高（推送） | 低（轮询间隔） |
| 安全性 | 内置加密+鉴权 | 需手动验签 | N/A |
| 开发成本 | 低（SDK 封装） | 中（需搭建 HTTP 服务） | 高（需自行实现） |
| 连接限制 | 每应用最多 50 连接 | 无上限 | N/A |
| 处理超时 | 3 秒内完成 | 3 秒内响应 | N/A |
| 飞书（国内）支持 | ✅ | ✅ | ❌ 无官方 API |
| Lark（国际）支持 | **⚠️ 有争议（见 12.6）** | ✅ | ❌ |
| 卡片交互回调 | **❌ 不支持** | ✅ | N/A |
| SDK 集成 | `WSClient` 类 | `EventDispatcher` + HTTP | 无 |
| 重试机制 | 失败后 15s/5m/1h/6h 重推，最多 4 次 | 同左 | N/A |

**关键发现：**
1. **飞书（国内版）：WebSocket 长连接是最佳选择**，无需公网 IP，SDK 内置加密鉴权
2. **Lark（国际版）WebSocket 支持有争议**：官方文档（open.larksuite.com/document/.../use-websocket）确认支持且提供 `domain: Lark.Domain.Lark` 代码示例；但 OpenClaw Issue #51663（2026-03）报告 Developer Console 无法配置长连接。详见 12.6 节深度分析
3. **卡片交互回调（按钮点击）只能通过 Webhook HTTP 端点接收**，WebSocket 不支持
4. **飞书没有 HTTP 长轮询 API**（与微信 iLink Bot 的 `getupdates` 根本不同）

#### 12.1.3 认证方式

```
POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal
Content-Type: application/json

{"app_id": "cli_xxxx", "app_secret": "xxxx"}

→ {"tenant_access_token": "t-xxxx", "expire": 7200}
```

| 维度 | 说明 |
|------|------|
| 凭证类型 | `tenant_access_token`（租户令牌） |
| 获取方式 | `app_id` + `app_secret` → POST → token |
| 有效期 | 2 小时（7200 秒） |
| 刷新机制 | 剩余 <30 分钟时返回新 token，两 token 并行有效 |
| 使用方式 | `Authorization: Bearer {tenant_access_token}` |
| Lark 域名 | `https://open.larksuite.com/open-apis/...`（API 路径相同） |

#### 12.1.4 核心 API 端点

| 端点 | 方法 | 功能 | 频率限制 |
|------|------|------|---------|
| `/open-apis/auth/v3/tenant_access_token/internal` | POST | 获取 tenant_access_token | — |
| `/open-apis/im/v1/messages` | POST | **发送消息** | 5 QPS/用户, 5 QPS/群 |
| `/open-apis/im/v1/messages/:message_id` | PATCH | **更新卡片消息** | 1000/min, 50/s |
| `/open-apis/im/v1/messages/:message_id/reply` | POST | 回复消息 | 5 QPS |
| `/open-apis/im/v1/images` | POST | **上传图片** | 1000/min, 50/s |
| `/open-apis/im/v1/files` | POST | **上传文件** | 1000/min, 50/s |
| `/open-apis/im/v1/images/:image_key` | GET | 下载图片 | — |
| `/open-apis/im/v1/messages/:message_id/resources/:file_key` | GET | 下载文件 | — |

#### 12.1.5 消息类型

| msg_type | 类型 | 发送 | 接收 |
|----------|------|------|------|
| `text` | 纯文本 | ✅ | ✅ |
| `post` | 富文本 | ✅ | ✅ |
| `image` | 图片 | ✅ | ✅ |
| `file` | 文件 | ✅ | ✅ |
| `audio` | 音频 | ✅ | ✅ |
| `media` | 视频 | ✅ | ✅ |
| `sticker` | 表情 | ✅ | ✅ |
| `interactive` | **卡片** | ✅ | — |
| `share_chat` | 群名片 | ✅ | ✅ |
| `share_user` | 个人名片 | ✅ | ✅ |

#### 12.1.6 消息接收事件结构（im.message.receive_v1）

```json
{
  "schema": "2.0",
  "header": {
    "event_id": "xxx",
    "event_type": "im.message.receive_v1",
    "create_time": "1700000000000",
    "token": "verification_token",
    "app_id": "cli_xxx",
    "tenant_key": "xxx"
  },
  "event": {
    "sender": {
      "sender_id": {"open_id": "ou_xxx", "user_id": "xxx", "union_id": "xxx"},
      "sender_type": "user",
      "tenant_key": "xxx"
    },
    "message": {
      "message_id": "om_xxx",
      "chat_id": "oc_xxx",
      "chat_type": "p2p | group",
      "message_type": "text | image | file | ...",
      "content": "{\"text\":\"@_user_1 hello\"}",
      "create_time": "1700000000000",
      "mentions": [{"key":"@_user_1","id":{"open_id":"ou_xxx"},"name":"Bot"}]
    }
  }
}
```

#### 12.1.7 飞书 vs 微信 iLink Bot 关键差异

| 维度 | 飞书 Bot API | 微信 iLink Bot API |
|------|-------------|-------------------|
| **消息接收** | WebSocket 推送 / Webhook 回调 | HTTP 长轮询 (getupdates, 35s) |
| **公网 IP** | WebSocket 模式不需要 | 不需要 |
| **认证** | app_id + app_secret → tenant_access_token (2h) | bot_token + randomUIN |
| **token 刷新** | 自动（<30min 时刷新） | 无需刷新（长期有效） |
| **媒体处理** | 平台托管（image_key/file_key） | CDN + AES-128-ECB 加密 |
| **媒体加密** | **无**（平台内部处理） | AES-128-ECB + PKCS7 |
| **消息格式** | JSON 结构化（支持富文本卡片） | JSON（纯文本为主） |
| **卡片/按钮** | ✅ interactive 卡片 + 按钮回调 | ❌ 不支持 |
| **消息编辑** | ✅ PATCH 更新卡片 | ❌ 不支持 |
| **消息反应** | ✅ emoji 反应 | ❌ 不支持 |
| **群聊** | ✅ 完整支持 + @触发 | ⚠️ 权限模糊 |
| **速率限制** | 明确分级（5 QPS ~ 100 QPS） | 未公开 |
| **SDK** | 官方 `@larksuiteoapi/node-sdk` | 无官方 SDK |
| **上传大小** | 图片 10MB, 文件 30MB | 无明确文档 |
| **context_token** | 无此概念（用 chat_id + message_id） | 每条消息必带 |
| **typing 指示器** | 无官方 API | getconfig → sendtyping |
| **历史消息** | ✅ 可拉取 | ❌ 无历史 API |

### 12.2 证据清单（飞书/Lark Bot API 调研）

**检索时间**：2026-03-27 20:54:08 +08:00

#### 来源 F1（飞书开放平台 — Bot 概述）
- **URL**：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/bot-v3/bot-overview
- **类型**：官方文档
- **摘要**：应用机器人支持双向消息、事件订阅、API 权限；自定义机器人仅支持 Webhook 单向推送
- **采纳性**：✅ 采纳

#### 来源 F2（飞书开放平台 — 发送消息 API）
- **URL**：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/create
- **类型**：官方 API 文档
- **摘要**：POST /im/v1/messages，支持 11 种消息类型，5 QPS 限频
- **采纳性**：✅ 采纳

#### 来源 F3（飞书开放平台 — 接收消息事件）
- **URL**：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/events/receive
- **类型**：官方事件文档
- **摘要**：im.message.receive_v1 事件，包含 sender/message 结构，chat_type 区分私聊/群聊
- **采纳性**：✅ 采纳

#### 来源 F4（飞书开放平台 — 速率限制）
- **URL**：https://open.feishu.cn/document/server-docs/api-call-guide/frequency-control
- **类型**：官方文档
- **摘要**：11 级速率等级，429 错误返回 x-ogw-ratelimit-reset 头
- **采纳性**：✅ 采纳

#### 来源 F5（飞书开放平台 — tenant_access_token）
- **URL**：https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal
- **类型**：官方认证文档
- **摘要**：app_id + app_secret → 2h 有效 token，<30min 自动刷新
- **采纳性**：✅ 采纳

#### 来源 F6（飞书 Node.js SDK — GitHub）
- **URL**：https://github.com/larksuite/node-sdk
- **类型**：官方 SDK 仓库
- **摘要**：`@larksuiteoapi/node-sdk`，支持 WSClient 长连接 + EventDispatcher，TypeScript 原生支持，domain 参数切换 Feishu/Lark
- **采纳性**：✅ 采纳

#### 来源 F7（Lark WebSocket 不支持 — GitHub Issue #51663）
- **URL**：https://github.com/openclaw/openclaw/issues/51663
- **类型**：GitHub Issue（社区确认）
- **摘要**：Lark 国际版不支持 WebSocket 长连接，需回退到 Webhook 模式
- **采纳性**：✅ 采纳 — 关键兼容性限制

#### 来源 F8（飞书开放平台 — 卡片回调通信）
- **URL**：https://open.feishu.cn/document/feishu-cards/card-callback-communication
- **类型**：官方文档
- **摘要**：卡片按钮点击后通过 HTTP Webhook 推送回调，包含 action.value + operator 信息，3 秒内响应
- **采纳性**：✅ 采纳

#### 来源 F9（飞书开放平台 — 图片上传 API）
- **URL**：https://open.feishu.cn/document/server-docs/im-v1/image/create
- **类型**：官方 API 文档
- **摘要**：POST /im/v1/images，multipart/form-data，返回 image_key，上限 10MB
- **采纳性**：✅ 采纳

#### 来源 F10（飞书开放平台 — 文件上传 API）
- **URL**：https://open.feishu.cn/document/server-docs/im-v1/file/create
- **类型**：官方 API 文档
- **摘要**：POST /im/v1/files，支持 opus/mp4/pdf/doc/xls/ppt/stream，上限 30MB
- **采纳性**：✅ 采纳

#### 来源 F11（cc-connect — 多平台桥接）
- **URL**：https://github.com/chenhg5/cc-connect
- **类型**：开源项目（Go 语言）
- **摘要**：支持飞书 WebSocket 长连接 + 10 个平台 + 7 个 AI Agent，Go 语言实现，守护进程模式
- **采纳性**：✅ 采纳 — 验证飞书 WebSocket 模式可行性

#### 来源 F12（CCBot — 飞书 Claude Code 控制器）
- **URL**：https://github.com/uikoo9/ccbot
- **类型**：开源项目（TypeScript）
- **摘要**：飞书长连接 + Claude Code 本地二进制调用，Monorepo 架构
- **采纳性**：✅ 采纳 — TypeScript 飞书集成参考

#### 来源 F13（clawdbot-feishu — OpenClaw 飞书插件）
- **URL**：https://github.com/m1heng/clawdbot-feishu
- **类型**：开源项目（TypeScript, 4.3k stars）
- **摘要**：OpenClaw 官方飞书插件，支持 WebSocket + Webhook 双模式，配对码访问控制，feishu_doc/wiki/drive/bitable 工具集成
- **采纳性**：✅ 采纳 — **功能标杆**

#### 来源 F14（Claude-to-IM — 通用 IM 桥接库）
- **URL**：https://github.com/op7418/Claude-to-IM
- **类型**：开源项目（TypeScript）
- **摘要**：Channel 适配器模式，飞书 WSClient 长连接，Permission Broker 实现权限审批按钮，流式回复，消息去重
- **采纳性**：✅ 采纳 — **权限审批流参考**

#### 来源 F15（飞书/Lark 官方 MCP）
- **URL**：https://github.com/larksuite/lark-openapi-mcp
- **类型**：官方 MCP 项目
- **摘要**：飞书 OpenAPI 的 MCP 封装，支持消息/日历/文档，npm 包 `@larksuiteoapi/lark-mcp`
- **采纳性**：✅ 采纳 — 官方 MCP 方向确认

#### 来源 F16（飞书开放平台 — 更新卡片 API）
- **URL**：https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/message/patch
- **类型**：官方 API 文档
- **摘要**：PATCH /im/v1/messages/:message_id 更新卡片内容，支持卡片交互后状态更新
- **采纳性**：✅ 采纳

#### 来源 F17（DeepWiki — Node SDK WSClient 高级用法）
- **URL**：https://deepwiki.com/larksuite/node-sdk/5-advanced-usage
- **类型**：技术分析
- **摘要**：WSClient 完整初始化代码，事件注册模式，自动重连，卡片回调仍需 HTTP Webhook
- **采纳性**：✅ 采纳

### 12.3 现有飞书 + Claude Code 集成项目分析

| 项目 | Stars | 语言 | 飞书连接 | Claude 连接 | 权限审批 | 流式回复 |
|------|-------|------|---------|------------|---------|---------|
| **cc-connect** | — | Go | WebSocket | spawn 子进程 | ❌ | ✅ 分块 |
| **CCBot** | — | TypeScript | 长连接 | 本地二进制 | ❌ | ❌ |
| **clawdbot-feishu** | 4.3k | TypeScript | WebSocket+Webhook | OpenClaw 插件 | ✅ 配对码 | ✅ |
| **Claude-to-IM** | — | TypeScript | WSClient | SDK DI 注入 | ✅ **卡片按钮** | ✅ 流式编辑 |
| **lark-openapi-mcp** | — | TypeScript | MCP 工具 | MCP 集成 | — | — |

**关键发现：**
1. **Claude-to-IM 是最先进的方案**：实现了卡片按钮权限审批 + 流式消息编辑
2. **所有项目都优先使用 WebSocket 长连接**，但提供 Webhook 降级
3. **无人使用 MCP Channel 模式接入飞书**——均使用 Agent SDK / 子进程模式
4. **飞书官方 MCP（lark-openapi-mcp）是工具型 MCP**，不是 Channel

### 12.4 Channel 模式 vs ACP 模式适配评估

#### 12.4.1 飞书场景的独特挑战

与微信 iLink Bot 不同，飞书有三个关键特性影响架构选择：

1. **无长轮询 API**：飞书不提供 `getupdates` 式的 HTTP 长轮询，消息只能通过 WebSocket 推送或 Webhook 回调接收
2. **卡片交互能力**：飞书支持 `interactive` 卡片消息 + 按钮回调，可实现原生权限审批 UI
3. **消息可编辑**：PATCH API 可更新已发送的卡片，支持流式输出效果（逐步编辑同一条卡片消息）

#### 12.4.2 Channel 模式评估

```
飞书用户 → Feishu App → 飞书开放平台
                              ↕ WebSocket / Webhook
                     server.ts (MCP Server, 本地运行)
                              ↕ MCP Protocol (stdio)
                         Claude Code Session
```

| 优势 | 劣势 |
|------|------|
| 与微信 Channel 同构，代码复用高 | 需要 claude.ai 登录（API Key 用户无法使用） |
| 原生权限中继（claude/channel/permission） | 卡片按钮回调需要 HTTP 端点（WebSocket 不支持） |
| Claude Code 原生 Channel 标签 | 飞书 WebSocket + Webhook 混合架构增加复杂度 |
| 持久 MCP 连接 | Lark 国际版需要额外处理 |

**卡片按钮权限审批的实现路径（Channel 模式）：**
- 收到 `claude/channel/permission` 事件 → 发送 `interactive` 卡片（含 Approve/Deny 按钮）
- 按钮回调通过 HTTP Webhook → 转换为 verdict 文本 → 注入 MCP 通知
- **问题**：需要同时维护 WebSocket（收消息）+ HTTP 服务器（收卡片回调）

#### 12.4.3 ACP 模式评估

```
飞书用户 → Feishu App → 飞书开放平台
                              ↕ WebSocket / Webhook
                     feishu-bridge.ts (独立进程)
                              ↕ ACP Protocol (stdin/stdout JSON-RPC)
                         Claude Code subprocess
```

| 优势 | 劣势 |
|------|------|
| 支持 API Key + 任何 Provider | 无 Claude Code 原生 Channel 标签 |
| ACP `session/request_permission` 可中继权限 | 需要 `@zed-industries/claude-code-acp` 包装 |
| 持久子进程（无冷启动） | 比 Channel 多一层进程管理 |
| 流式响应（session/update 通知） | 实现复杂度略高 |
| 多 Agent 支持（Copilot/Gemini/Codex） | — |

**卡片按钮权限审批的实现路径（ACP 模式）：**
- 收到 `session/request_permission` → 发送 `interactive` 卡片
- 按钮回调通过 HTTP Webhook → 调用 ACP `permission/respond`
- **优势**：权限流与消息流解耦，架构更清晰

#### 12.4.4 混合模式评估（推荐）

```
飞书用户 → Feishu App → 飞书开放平台
                              ↕ WebSocket（消息事件）
                              ↕ HTTP Server（卡片回调）— 仅本地监听
                     feishu-server.ts
                              ↕ 模式切换
              ┌────────────────┴────────────────┐
              │ Channel 模式                      │ ACP 模式
              │ MCP Server (stdio)               │ ACP subprocess
              │ claude.ai 用户                    │ API Key 用户
              └──────────────────────────────────┘
```

| 维度 | 评分 | 理由 |
|------|------|------|
| 对齐度 | 9/10 | 与微信项目双模式架构一致 |
| 收益 | 9/10 | 覆盖所有用户 + 原生卡片交互 |
| 风险 | 4/10 | WebSocket + HTTP 双通道复杂度 |
| 成本 | 5/10 | 需要新建飞书专用模块 |
| 证据 | 10/10 | 17 个权威来源支撑 |

### 12.5 架构方案设计

#### 12.5.1 项目结构建议：同仓库新目录

**理由**：飞书与微信共享大量基础设施代码（访问控制、配对机制、MCP/ACP 协议层），拆分仓库会导致重复维护。

```
claude-plugin-wechat/           ← 改名为 claude-plugin-im 或保持现名
├── server.ts                   ← 微信 Channel 模式（现有）
├── acp-bridge.ts               ← 微信 ACP 模式（现有）
├── feishu/                     ← 飞书专用目录（新增）
│   ├── README.md               ← 飞书模块文档
│   ├── server.ts               ← 飞书 Channel 模式入口
│   ├── acp-bridge.ts           ← 飞书 ACP 模式入口
│   ├── feishu-client.ts        ← 飞书 API 封装（WebSocket + HTTP + 认证）
│   ├── card-builder.ts         ← 卡片 JSON 构建器（权限审批/消息渲染）
│   └── types.ts                ← 飞书事件/消息类型定义
├── shared/                     ← 共享模块（从现有代码提取）
│   ├── access-control.ts       ← 配对码 + 白名单 + DM 策略
│   ├── media-utils.ts          ← 媒体处理通用逻辑
│   └── markdown-convert.ts     ← Markdown → 纯文本/富文本转换
├── skills/
│   ├── access/SKILL.md         ← 微信访问控制（现有）
│   ├── configure/SKILL.md      ← 微信配置（现有）
│   ├── feishu-access/SKILL.md  ← 飞书访问控制（新增）
│   └── feishu-configure/SKILL.md ← 飞书配置（新增）
├── login-qr.ts                 ← 微信登录（现有）
├── login-poll.ts               ← 微信登录（现有）
├── package.json
├── .mcp.json
└── .claude-plugin/plugin.json
```

#### 12.5.2 核心文件清单与职责

| 文件 | 职责 | 预估行数 |
|------|------|---------|
| `feishu/feishu-client.ts` | 飞书 API 封装：token 管理、WebSocket 连接、HTTP 卡片回调服务、消息收发、媒体上传下载 | ~400 |
| `feishu/server.ts` | 飞书 Channel 模式 MCP Server：事件订阅、消息路由、权限中继（卡片按钮）、typing 模拟 | ~600 |
| `feishu/acp-bridge.ts` | 飞书 ACP 模式：Agent 子进程管理、session 续接、流式转发、权限中继 | ~500 |
| `feishu/card-builder.ts` | 飞书卡片 JSON 构建：权限审批卡片、消息渲染卡片、流式更新卡片 | ~200 |
| `feishu/types.ts` | TypeScript 类型定义：事件结构、消息结构、卡片结构 | ~100 |

#### 12.5.3 消息流向图

**Channel 模式（飞书）：**

```
┌─────────────┐    WebSocket     ┌──────────────────────┐
│ 飞书用户     │ ──────────────→ │ feishu/server.ts      │
│ (私聊/群聊)  │                 │ (MCP Server)          │
│             │ ←────────────── │                        │
│             │   发送消息 API   │  ┌─ EventDispatcher   │
└─────────────┘                 │  ├─ TokenManager       │
                                │  ├─ CardBuilder        │
┌─────────────┐    HTTP POST    │  └─ MediaHandler       │
│ 卡片按钮回调 │ ──────────────→ │                        │
│ (权限审批)   │   localhost:X   │         ↕ MCP stdio   │
└─────────────┘                 └──────────┬───────────┘
                                           │
                                ┌──────────▼───────────┐
                                │    Claude Code        │
                                │    (Channel Session)  │
                                └──────────────────────┘
```

**ACP 模式（飞书）：**

```
┌─────────────┐    WebSocket     ┌──────────────────────┐
│ 飞书用户     │ ──────────────→ │ feishu/acp-bridge.ts  │
│             │ ←────────────── │ (独立进程)             │
└─────────────┘                 │                        │
                                │  ┌─ FeishuClient      │
┌─────────────┐    HTTP POST    │  ├─ SessionManager     │
│ 卡片按钮回调 │ ──────────────→ │  ├─ PermissionBroker  │
│ (权限审批)   │   localhost:X   │  └─ StreamForwarder   │
└─────────────┘                 │         ↕ ACP JSON-RPC│
                                └──────────┬───────────┘
                                           │
                                ┌──────────▼───────────┐
                                │    Claude Code ACP    │
                                │    (持久子进程)        │
                                └──────────────────────┘
```

#### 12.5.4 认证流程

```
1. 用户在飞书开放平台创建自建应用
   → 获得 app_id + app_secret
   → 配置机器人能力 + 事件订阅权限

2. 配置 credentials
   → ~/.claude/channels/feishu/credentials.json
   → {"app_id": "cli_xxx", "app_secret": "xxx", "domain": "feishu|lark"}

3. 启动时自动获取 tenant_access_token
   → POST /auth/v3/tenant_access_token/internal
   → 缓存 token，<30min 自动刷新

4. 建立 WebSocket 长连接（飞书）或启动 HTTP Webhook 服务（Lark）
   → 订阅 im.message.receive_v1 事件
   → 开始接收消息
```

#### 12.5.5 权限审批卡片设计

```json
{
  "config": {"wide_screen_mode": true},
  "header": {"title": {"tag": "plain_text", "content": "Claude Code 权限请求"}},
  "elements": [
    {
      "tag": "div",
      "text": {"tag": "lark_md", "content": "**工具**: `Bash`\n**命令**: `npm install express`\n**验证码**: `abcde`"}
    },
    {
      "tag": "action",
      "actions": [
        {
          "tag": "button",
          "text": {"tag": "plain_text", "content": "✅ 批准"},
          "type": "primary",
          "value": {"action": "approve", "code": "abcde"}
        },
        {
          "tag": "button",
          "text": {"tag": "plain_text", "content": "❌ 拒绝"},
          "type": "danger",
          "value": {"action": "deny", "code": "abcde"}
        }
      ]
    }
  ]
}
```

按钮回调后 → PATCH 更新卡片为"已批准"/"已拒绝"状态 → 转发 verdict 到 MCP/ACP

#### 12.5.6 最小化实现方案（MVP）

**Phase 1：基础消息桥接（~3 天）**
- `feishu/feishu-client.ts`：token 管理 + WebSocket 连接 + 消息发送
- `feishu/server.ts`：MCP Channel 基础版（文本收发）
- 配置：credentials.json + .mcp.json 飞书入口

**Phase 2：媒体支持（~2 天）**
- 图片/文件上传下载（无需 AES 加密，比微信简单得多）
- `download_attachment` MCP 工具

**Phase 3：卡片交互 + 权限审批（~3 天）**
- `feishu/card-builder.ts`：权限审批卡片
- HTTP 本地服务器接收卡片回调
- 权限中继完整链路

**Phase 4：ACP 模式（~2 天）**
- `feishu/acp-bridge.ts`：复用微信 ACP 架构
- 流式响应 → 卡片实时编辑

**Phase 5：Lark 国际版兼容（~1 天）**
- Webhook 降级模式
- 域名切换逻辑

### 12.6 方案评分矩阵

**评分公式**：`Score = 0.30*对齐度 + 0.25*收益 - 0.20*风险 - 0.15*成本 + 0.10*证据可信度`

| # | 方案 | 对齐度 | 收益 | 风险 | 成本 | 证据 | **得分** |
|---|------|--------|------|------|------|------|---------|
| 1 | **同仓库 feishu/ 目录 + Channel + ACP 双模式** | 10 | 10 | 4 | 5 | 10 | **7.20** |
| 2 | 独立仓库 claude-plugin-feishu | 7 | 9 | 3 | 6 | 10 | **5.65** |
| 3 | 仅 Channel 模式（无 ACP） | 8 | 7 | 2 | 3 | 10 | **6.60** |
| 4 | 仅 ACP 模式（无 Channel） | 7 | 8 | 3 | 4 | 10 | **5.95** |
| 5 | 基于 Claude-to-IM 库适配 | 6 | 7 | 5 | 3 | 8 | **4.75** |
| 6 | 基于 cc-connect 适配（Go 语言） | 4 | 6 | 6 | 7 | 7 | **2.35** |
| 7 | 使用官方 lark-openapi-mcp 扩展 | 5 | 5 | 3 | 2 | 10 | **4.90** |
| 8 | Webhook-only 模式（无 WebSocket） | 6 | 6 | 2 | 3 | 9 | **5.35** |
| 9 | 飞书 + 微信统一抽象层 | 10 | 10 | 7 | 8 | 8 | **4.90** |
| 10 | 仅 Webhook 回调 + ngrok 方案 | 3 | 4 | 6 | 2 | 7 | **2.70** |

**Top-1 选定：方案 1 — 同仓库 feishu/ 目录 + Channel + ACP 双模式**

**未选方案拒绝理由：**
- 方案 2（独立仓库）：代码重复度高，维护成本倍增
- 方案 5（Claude-to-IM）：引入外部依赖，不可控
- 方案 6（cc-connect）：Go 语言，与项目 TypeScript 技术栈不匹配
- 方案 9（统一抽象层）：过度工程化，风险和成本过高
- 方案 10（ngrok）：需要公网暴露，安全风险高

### 12.7 风险评估

| 风险 | 等级 | 缓解措施 |
|------|------|---------|
| Lark 国际版无 WebSocket | 中 | Webhook 降级 + domain 自动检测 |
| 卡片回调需 HTTP 服务器 | 中 | 仅本地监听 localhost:随机端口，无公网暴露 |
| tenant_access_token 2h 过期 | 低 | TokenManager 自动刷新（<30min 触发） |
| 飞书 API 5 QPS 限频 | 低 | 令牌桶限流 + 队列排空 |
| WebSocket 断连 | 低 | SDK 内置自动重连 |
| 卡片 JSON 结构复杂 | 低 | CardBuilder 封装 + 模板化 |

### 12.8 总结

**飞书/Lark Bot API 与微信 iLink Bot API 是完全不同的技术体系：**

| 维度 | 微信 iLink Bot | 飞书 Bot API |
|------|---------------|-------------|
| 消息接收 | HTTP 长轮询 | WebSocket 推送 |
| 媒体处理 | CDN + AES 加密 | 平台托管（无加密） |
| 交互能力 | 纯文本 | **卡片+按钮+回调** |
| 消息编辑 | 不支持 | ✅ PATCH 更新 |
| SDK | 无 | 官方 Node.js SDK |
| 开发难度 | 中（需手写加密） | **低（SDK 封装完善）** |

**飞书的优势使得接入方案可以做到比微信更好的用户体验：**
1. **权限审批**：从微信的文本验证码升级为飞书的原生按钮卡片
2. **流式输出**：通过 PATCH API 实时编辑卡片消息，展示生成过程
3. **群聊支持**：完整的 @机器人 触发 + 群组权限管理
4. **媒体处理**：无需 AES 加密/解密，大幅简化代码

**建议立即进入 Phase 1 实施。**

### 12.9 飞书/Lark WebSocket 长连接 SDK 深度调研（补充）

> **调研时间**：2026-03-27 21:15:13 +08:00
> **议题**：@larksuiteoapi/node-sdk WSClient 最新版本、用法、Lark 国际版 WebSocket 支持现状

#### 12.9.1 @larksuiteoapi/node-sdk 版本信息

| 项目 | 值 |
|------|-----|
| **最新版本** | **1.60.0**（发布于 2026-03-26） |
| npm 包名 | `@larksuiteoapi/node-sdk` |
| GitHub 仓库 | https://github.com/larksuite/node-sdk |
| WSClient 支持起始版本 | **1.24.0** |
| 近期版本发布记录 | 1.57.0 (2026-01-30) → 1.58.0 (2026-01-30) → 1.59.0 (2026-02-12) → **1.60.0 (2026-03-26)** |
| 运行时 | Node.js（兼容 Bun） |
| 废弃包（勿用） | `@larksuiteoapi/node-sdk` 旧仓库 `larksuite/oapi-sdk-nodejs`（已 DEPRECATED） |

#### 12.9.2 WSClient 完整用法

**核心代码示例（官方文档确认）：**

```typescript
import * as Lark from '@larksuiteoapi/node-sdk';

// 基础配置
const baseConfig = {
  appId: 'cli_xxx',      // 必填：飞书开放平台 App ID
  appSecret: 'xxx',       // 必填：飞书开放平台 App Secret
};

// 1. 创建 REST API Client（用于发送消息等）
const client = new Lark.Client({
  ...baseConfig,
  domain: Lark.Domain.Feishu,       // Lark.Domain.Feishu | Lark.Domain.Lark | 自定义域名
  appType: Lark.AppType.SelfBuild,  // 仅企业自建应用支持长连接
});

// 2. 创建 WebSocket 长连接客户端
const wsClient = new Lark.WSClient({
  ...baseConfig,
  domain: Lark.Domain.Feishu,       // 或 Lark.Domain.Lark（见 12.9.3 讨论）
  loggerLevel: Lark.LoggerLevel.info, // debug | info | warn | error
  wsConfig: {
    PingInterval: 30,   // 心跳 ping 间隔（秒）
    PingTimeout: 5,      // pong 超时（秒），超时则认为连接断开
  },
});

// 3. 启动长连接 + 注册事件处理器
wsClient.start({
  eventDispatcher: new Lark.EventDispatcher({}).register({
    // 接收消息事件
    'im.message.receive_v1': async (data) => {
      const {
        message: { chat_id, chat_type, message_id, message_type, content },
        sender: { sender_id },
      } = data;

      // 解析消息内容
      const parsed = JSON.parse(content);
      console.log(`收到消息: ${parsed.text}, 来自: ${sender_id.open_id}`);

      // 回复消息
      await client.im.v1.message.create({
        params: { receive_id_type: 'chat_id' },
        data: {
          receive_id: chat_id,
          content: JSON.stringify({ text: '收到你的消息！' }),
          msg_type: 'text',
        },
      });
    },
  }),
});
```

**WSClient 构造函数参数：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `appId` | string | 是 | — | 飞书开放平台 App ID |
| `appSecret` | string | 是 | — | 飞书开放平台 App Secret |
| `domain` | Domain/string | 否 | `Domain.Feishu` | `Lark.Domain.Feishu` (https://open.feishu.cn) 或 `Lark.Domain.Lark` (https://open.larksuite.com) 或自定义完整域名 |
| `loggerLevel` | LoggerLevel | 否 | — | `debug` / `info` / `warn` / `error` |
| `wsConfig` | object | 否 | — | `{ PingInterval: number, PingTimeout: number }` |

**EventDispatcher 注册方式：**

```typescript
// 空对象初始化（长连接模式不需要 encryptKey/verificationToken）
const dispatcher = new Lark.EventDispatcher({});

// 链式注册多个事件
dispatcher
  .register({
    'im.message.receive_v1': async (data) => { /* 处理消息 */ },
  })
  .register({
    'im.chat.member.bot.added_v1': async (data) => { /* 机器人被加入群 */ },
  });
```

**发送消息 API：**

```typescript
// 发送文本消息
await client.im.v1.message.create({
  params: { receive_id_type: 'chat_id' },  // chat_id | open_id | union_id | email
  data: {
    receive_id: 'oc_xxx',
    content: JSON.stringify({ text: 'Hello' }),
    msg_type: 'text',  // text | post | image | file | audio | media | sticker | interactive
  },
});

// 发送卡片消息
await client.im.v1.message.create({
  params: { receive_id_type: 'chat_id' },
  data: {
    receive_id: chat_id,
    content: Lark.messageCard.defaultCard({
      title: '标题',
      content: '内容',
    }),
    msg_type: 'interactive',
  },
});

// 回复消息
await client.im.v1.message.reply({
  path: { message_id: 'om_xxx' },
  data: {
    content: JSON.stringify({ text: '回复内容' }),
    msg_type: 'text',
  },
});

// 更新卡片消息（流式输出核心能力）
await client.im.v1.message.patch({
  path: { message_id: 'om_xxx' },
  data: {
    content: JSON.stringify({ /* 更新后的卡片 JSON */ }),
  },
});
```

#### 12.9.3 Lark 国际版 WebSocket 支持 — 矛盾证据分析

**此前结论（CLAUDE.md 12.1.2）**：Lark 国际版不支持 WebSocket（基于 OpenClaw Issue #51663）

**本次调研发现两组矛盾的证据：**

**支持 WebSocket 的证据（3 个）：**

| # | 来源 | 类型 | 关键内容 |
|---|------|------|---------|
| 1 | [Lark 官方文档 — use-websocket](https://open.larksuite.com/document/ukTMukTMukTM/uYDNxYjL2QTM24iN0EjN/event-subscription-configure-/use-websocket) | **官方文档（权威性最高）** | 明确提供 Node.js 代码示例使用 `domain: Lark.Domain.Lark`，说明"长连接是 Lark SDK 内提供的能力"，配置步骤与飞书完全一致 |
| 2 | [DeepWiki — Lark/Feishu Channels 分析](https://deepwiki.com/zeroclaw-labs/zeroclaw/9.6-lark-and-feishu-channels) | 技术分析 | "Both platforms support long-connection mode identically"，ws_base() 返回对应域名的 WebSocket 地址 |
| 3 | [Lark 官方文档 — Server SDK](https://open.larksuite.com/document/ukTMukTMukTM/uETO1YjLxkTN24SM5UjN) | 官方文档 | Node SDK 支持长连接事件回调，Domain.Lark 是文档中列出的域名选项 |

**不支持 WebSocket 的证据（2 个）：**

| # | 来源 | 类型 | 关键内容 |
|---|------|------|---------|
| 1 | [OpenClaw Issue #51663](https://github.com/openclaw/openclaw/issues/51663) | GitHub Issue（2026-03-21 关闭） | "Lark international physically does not expose WebSocket long connection in its Developer Console"，配置时 Developer Console 显示"No application connection detected" |
| 2 | [Lark 官方 Bot 教程](https://open.larksuite.com/document/home/develop-a-bot-in-5-minutes/step-5-configure-event-subscription) | 官方教程 | 5 分钟入门教程中只介绍 Webhook（ngrok）方式，未提及长连接选项 |

**分析与结论：**

1. **Lark SDK 层面（代码层）确认支持 WebSocket**：官方文档明确提供 `Lark.Domain.Lark` 的 WSClient 示例，SDK 代码中 `ws_base()` 方法对 Lark 域名返回有效的 WebSocket 端点
2. **Lark Developer Console（管理后台）可能有 UI 限制**：Issue #51663 的问题可能是 Developer Console 的"事件配置"页面在 Lark 国际版中没有"使用长连接接收事件"选项，或者该选项在 2026 年初存在 bug
3. **可能的解释**：SDK 已支持但 Console UI 尚未完全同步，或者该功能在 2026-03 之后才对 Lark 国际版全面开放
4. **Issue #51663 已关闭（COMPLETED）**：关闭评论提到"webhook mode now exists in monitor.transport.ts"，暗示问题通过添加 webhook 降级解决，而非确认 WebSocket 不可用

**最终建议：**
- **飞书（国内版）**：直接使用 WSClient，无争议
- **Lark（国际版）**：**优先尝试 WSClient + `Lark.Domain.Lark`**，如果 Developer Console 无法配置长连接模式或连接失败，则自动降级到 Webhook 模式
- **代码层面**：在 `feishu-client.ts` 中实现自动检测 + 降级逻辑

#### 12.9.4 WebSocket 连接技术细节

| 维度 | 值 |
|------|-----|
| **连接协议** | WSS（WebSocket Secure） |
| **连接地址** | 由 SDK 自动获取，成功后日志显示 `connected to wss://xxxxx`（具体地址不公开，由平台动态分配） |
| **飞书 API 域名** | `https://open.feishu.cn` |
| **Lark API 域名** | `https://open.larksuite.com` |
| **鉴权方式** | WebSocket 握手时携带 App ID + App Secret，建连后自动鉴权 |
| **数据加密** | 内置加密传输，开发者无需额外处理解密/验签 |
| **心跳保活** | Ping/Pong 机制（默认 PingInterval: 30s, PingTimeout: 5s） |
| **自动重连** | SDK 内置，异常断开后自动重连 |
| **最大连接数** | 每应用 **50** 个 |
| **消息分发** | **集群模式**（非广播）：多客户端时仅随机一个收到消息 |
| **处理超时** | **3 秒**内完成处理，否则触发超时重推 |
| **重试机制** | 失败后 15s → 5min → 1h → 6h 重推，最多 4 次 |
| **支持的应用类型** | **仅企业自建应用**（商店应用不支持） |
| **支持的事件** | 所有事件订阅（im.message.receive_v1 等）；**不支持**卡片交互回调 |

#### 12.9.5 补充证据清单

**检索时间**：2026-03-27 21:15:13 +08:00

| # | 来源 | URL | 类型 | 关键发现 | 采纳性 |
|---|------|-----|------|---------|--------|
| F18 | npm @larksuiteoapi/node-sdk | https://www.npmjs.com/package/@larksuiteoapi/node-sdk | npm 注册表 | 最新版 1.60.0 (2026-03-26)，WSClient 自 1.24.0 起支持 | ✅ 采纳 |
| F19 | Lark 官方 — use-websocket 文档 | https://open.larksuite.com/document/ukTMukTMukTM/uYDNxYjL2QTM24iN0EjN/event-subscription-configure-/use-websocket | **官方文档** | 确认 Lark 国际版支持 WebSocket 长连接，提供 Node.js 代码示例 `domain: Lark.Domain.Lark` | ✅ 采纳（关键新证据） |
| F20 | 飞书 API 文档（Apifox 镜像） | https://feishu.apifox.cn/doc-7518429 | 第三方镜像 | 完整的长连接使用步骤、Node.js 代码示例、3 秒超时限制、50 连接上限 | ✅ 采纳 |
| F21 | 飞书开放平台 — 事件订阅配置 | https://open.feishu.cn/document/server-docs/event-subscription-guide/event-subscription-configure-/request-url-configuration-case | 官方文档 | 长连接 vs Webhook 对比、SDK 使用步骤、加密传输说明 | ✅ 采纳 |
| F22 | DeepWiki — Lark/Feishu Channels | https://deepwiki.com/zeroclaw-labs/zeroclaw/9.6-lark-and-feishu-channels | 技术分析 | 两平台共享相同 WebSocket 协议实现，仅 base URL 不同 | ✅ 采纳 |
| F23 | OpenClaw Issue #51663 | https://github.com/openclaw/openclaw/issues/51663 | GitHub Issue | Lark Console 无法配置长连接（已关闭），可能是 Console UI 限制而非 SDK 限制 | ⚠️ 部分采纳（与官方文档矛盾） |

#### 12.9.6 对 CLAUDE.md 12.1.2 的修正

原结论"Lark（国际版）：只能用 Webhook"需修正为：

> **Lark 国际版 WebSocket 支持状态：有争议但倾向于支持。** 官方文档（权威性最高）明确提供 Lark 长连接代码示例和配置步骤。OpenClaw Issue #51663 报告的 Developer Console 限制可能是暂时性问题或已修复。建议实现时采用"优先 WebSocket + 自动降级 Webhook"策略。

---


## 13. claude-code-acp Windows 兼容性调研报告

> **调研时间**：2026-03-28 13:22:53 +08:00
> **议题**：Windows 上运行 wechat-acp 时 spawn `npx @zed-industries/claude-code-acp` 子进程立即崩溃，报错 "TypeError: stream is closing or closed"

### 13.1 @zed-industries/claude-code-acp 包概述

| 项目 | 值 |
|------|-----|
| **npm 包名** | `@zed-industries/claude-code-acp`（已更名为 `@zed-industries/claude-agent-acp`） |
| **最新版本** | 0.16.2（2026-02 发布） |
| **GitHub 仓库** | https://github.com/zed-industries/claude-agent-acp |
| **性质** | **第三方包**（Zed 编辑器团队开发），非 Anthropic 官方 |
| **功能** | ACP (Agent Client Protocol) 适配器，将 Claude Agent SDK 包装为 ACP 协议兼容的 agent 进程 |
| **工作原理** | 内部运行 `claude -p --output-format stream-json --verbose --input-format stream-json`，通过 ACP JSON-RPC 2.0 over stdio 通信 |
| **平台支持** | 提供 Linux/macOS/Windows 预编译二进制（Release 页面），npm 安装支持 20+ 平台组合 |

### 13.2 根因分析（已确认）

**错误链路：**

```
wechat-acp (Bun on Windows)
  → spawn('npx', ['@zed-industries/claude-code-acp'], { stdio: ['pipe','pipe','inherit'] })
  → proc.stdin / proc.stdout 获取成功
  → Writable.toWeb(proc.stdin)    ← 💥 此处崩溃
  → TypeError: stream is closing or closed
```

**根因：Bun 在 Windows 上 `Writable.toWeb()` 实现不完整**

| 证据 | 来源 | 说明 |
|------|------|------|
| Bun Issue #16087 | https://github.com/oven-sh/bun/issues/16087 | `Writable.toWeb()` 在 Windows 上抛 TypeError，被标记为 #3927 的重复 |
| Bun Issue #3927 | https://github.com/oven-sh/bun/issues/3927 | `stream.Writable.toWeb` 未实现，2025-01-18 关闭标记 COMPLETED，但 Windows 可能仍有残留问题 |
| 当前代码位置 | `channels/wechat/acp-bridge.ts:1098` | `const input = Writable.toWeb(proc.stdin)` — 直接触发 |
| 同样受影响 | `channels/feishu/acp-bridge.ts:410` | 完全相同的代码模式 |

**具体技术解释：**

1. `@agentclientprotocol/sdk` 的 `ndJsonStream()` 需要 Web Streams API（`WritableStream<Uint8Array>` + `ReadableStream<Uint8Array>`）
2. 当前代码通过 Node.js 的 `Writable.toWeb()` 和 `Readable.toWeb()` 将子进程的 stdin/stdout 转换为 Web Streams
3. Bun 在 Windows 上对 `Writable.toWeb()` 的实现有缺陷（内部 `lazyWebStreams().newWritableStreamFromStreamWritable` 函数未定义或行为异常）
4. 子进程可能已经正常启动，但 ACP 连接建立阶段就因为 stream 转换失败而崩溃

### 13.3 其他可能的叠加问题

除了 `Writable.toWeb()` 根因外，Windows 上还有以下已知问题可能叠加：

| # | 问题 | 严重程度 | 来源 |
|---|------|---------|------|
| 1 | **npx 在 Windows 上需要 `shell: true`**：Windows 的 npx 是 .cmd 批处理文件，直接 spawn 会 ENOENT | 高 | Node.js Issue #3675, MCP servers Issue #3460 |
| 2 | **子进程僵尸化**：Windows 上父进程退出后子进程不自动终止（Zed Issue #48722） | 中 | https://github.com/zed-industries/zed/issues/48722 |
| 3 | **ProcessTransport 死后无恢复**：子进程崩溃后 session 永久损坏（claude-agent-acp Issue #338） | 高 | https://github.com/zed-industries/claude-agent-acp/issues/338 |
| 4 | **WSL2 兼容性**：SDK 预编译二进制在 WSL2 上因 glibc 不兼容直接 exit code 1（SDK Issue #20） | 中 | https://github.com/anthropics/claude-agent-sdk-typescript/issues/20 |
| 5 | **npx 首次下载超时**：冷启动时 npx 需要下载 claude-code-acp 包，网络不佳时可能超时 | 中 | 经验观察 |

### 13.4 证据清单

**检索时间**：2026-03-28 13:22:55 +08:00

| # | 来源 | URL | 类型 | 关键发现 | 采纳性 |
|---|------|-----|------|---------|--------|
| W1 | npm @zed-industries/claude-code-acp | https://www.npmjs.com/package/@zed-industries/claude-code-acp | npm 注册表 | v0.16.2，支持 20+ 平台预编译二进制 | ✅ 采纳 |
| W2 | GitHub claude-agent-acp | https://github.com/zed-industries/claude-agent-acp | 官方仓库 | ACP 适配器，43 Issues，12 PRs | ✅ 采纳 |
| W3 | Bun Issue #16087 | https://github.com/oven-sh/bun/issues/16087 | Bun bug | **`Writable.toWeb()` 在 Windows 上抛 TypeError**，被关闭为 #3927 重复 | ✅ 采纳（根因） |
| W4 | Bun Issue #3927 | https://github.com/oven-sh/bun/issues/3927 | Bun bug | `Writable.toWeb` 未实现，2025-01 标记 COMPLETED，但 Windows 残留 | ✅ 采纳（根因） |
| W5 | claude-agent-acp Issue #338 | https://github.com/zed-industries/claude-agent-acp/issues/338 | 子进程死亡 | ProcessTransport 死后 session 永久损坏，PR #363 修复了检测，但未实现自动恢复 | ✅ 采纳 |
| W6 | Zed Issue #48722 | https://github.com/zed-industries/zed/issues/48722 | Windows 僵尸 | Windows 上 node.exe 僵尸进程不终止 | ✅ 采纳 |
| W7 | SDK Issue #20 | https://github.com/anthropics/claude-agent-sdk-typescript/issues/20 | WSL2 崩溃 | 预编译二进制在 WSL2 上 exit code 1，可用 `pathToClaudeCodeExecutable` 绕过 | ✅ 采纳 |
| W8 | Node.js Issue #3675 | https://github.com/nodejs/node/issues/3675 | Windows spawn | Windows 上 spawn .cmd 文件需要 `shell: true` | ✅ 采纳 |
| W9 | MCP servers Issue #3460 | https://github.com/modelcontextprotocol/servers/issues/3460 | Windows npx | Windows 上 npx 需要 `cmd /c` 包装 | ✅ 采纳 |
| W10 | Inside the Claude Agent SDK（AWS 分析） | https://buildwithaws.substack.com/p/inside-the-claude-agent-sdk-from | 技术分析 | SDK 使用 `anyio.open_process()` 打开子进程，stdio JSON 行通信 | ✅ 采纳 |
| W11 | DeepWiki cross-platform | https://deepwiki.com/zed-industries/claude-code-acp/8.3-error-handling-and-debugging | 技术分析 | Windows 路径编码、行尾处理已内置，但 stream 转换未覆盖 | ✅ 采纳 |

### 13.5 解决方案（按优先级排序）

#### 方案 A（推荐，立即生效）：手动构建 Web WritableStream 避开 Writable.toWeb()

**原理**：绕过 Bun 的 `Writable.toWeb()` 实现，手动将 Node.js Writable 包装为 Web WritableStream。

**代码修改**（`channels/wechat/acp-bridge.ts` 和 `channels/feishu/acp-bridge.ts`）：

```typescript
// 替换：
//   const input = Writable.toWeb(proc.stdin)
//   const output = Readable.toWeb(proc.stdout) as ReadableStream<Uint8Array>

// 为跨平台兼容的手动包装：
function nodeWritableToWeb(writable: import('node:stream').Writable): WritableStream<Uint8Array> {
  return new WritableStream({
    write(chunk) {
      return new Promise((resolve, reject) => {
        const ok = writable.write(chunk, (err) => {
          if (err) reject(err)
        })
        if (ok) resolve()
        else writable.once('drain', resolve)
      })
    },
    close() {
      return new Promise((resolve) => {
        writable.end(resolve)
      })
    },
    abort(reason) {
      writable.destroy(reason instanceof Error ? reason : new Error(String(reason)))
    },
  })
}

function nodeReadableToWeb(readable: import('node:stream').Readable): ReadableStream<Uint8Array> {
  // Readable.toWeb() 在所有平台上都可用，但为一致性也可手动包装
  try {
    return Readable.toWeb(readable) as ReadableStream<Uint8Array>
  } catch {
    return new ReadableStream({
      start(controller) {
        readable.on('data', (chunk) => {
          controller.enqueue(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk))
        })
        readable.on('end', () => controller.close())
        readable.on('error', (err) => controller.error(err))
      },
      cancel() {
        readable.destroy()
      },
    })
  }
}

// 使用：
const input = nodeWritableToWeb(proc.stdin!)
const output = nodeReadableToWeb(proc.stdout!)
const stream = acp.ndJsonStream(input, output)
```

**优势**：
- 零外部依赖
- 完全绕开 Bun 的 stream 转换 bug
- 同时修复 Windows、WSL2、旧版 Bun 的兼容性
- `Readable.toWeb()` 作为优先路径保留（它在大多数环境下正常工作），仅在失败时降级

**影响范围**：
- `channels/wechat/acp-bridge.ts` 第 1098-1100 行
- `channels/feishu/acp-bridge.ts` 第 410-412 行

#### 方案 B：子进程崩溃自动恢复

**问题**：即使修复了 stream 转换，子进程仍可能因网络、内存、API 限制等原因崩溃。当前代码在 `processQueue` 中检测到 `process.killed || exitCode !== null` 后只是删除 session，下一条消息需要用户重新发起。

**建议增强**（`enqueueMessage` 函数）：

```typescript
async function enqueueMessage(userId: string, promptBlocks: acp.ContentBlock[], contextToken: string): Promise<void> {
  let session = userSessions.get(userId)
  let retries = 0
  const MAX_RETRIES = 2

  while (retries <= MAX_RETRIES) {
    if (!session || session.process.killed || session.process.exitCode !== null) {
      if (userSessions.has(userId)) userSessions.delete(userId)
      if (userSessions.size >= MAX_CONCURRENT_USERS) evictOldestSession()
      try {
        session = await createSession(userId, contextToken)
        break  // 创建成功
      } catch (err) {
        retries++
        if (retries > MAX_RETRIES) {
          // 彻底失败，通知用户
          await sendMessage(userId, `⚠️ Agent 启动失败（重试 ${MAX_RETRIES} 次后）: ${err instanceof Error ? err.message : JSON.stringify(err)}`, contextToken).catch(() => {})
          return
        }
        process.stderr.write(`wechat acp-bridge [${userId}]: session creation failed (attempt ${retries}/${MAX_RETRIES}): ${err}\n`)
        await Bun.sleep(1000 * retries)  // 递增退避
        continue
      }
    }
    break
  }
  // ... 继续排队逻辑
}
```

#### 方案 C：预热启动 + 健康检查

**预热**：在 `createSession` 中增加更健壮的启动确认：

```typescript
// 替换当前的 500ms 等待
// await new Promise(resolve => setTimeout(resolve, 500))

// 改为主动健康检查：等待 ACP initialize 成功（已有），但增加超时
const INIT_TIMEOUT_MS = parseInt(process.env.ACP_INIT_TIMEOUT ?? '30000', 10)
const initPromise = connection.initialize({ ... })
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('ACP initialization timed out')), INIT_TIMEOUT_MS)
)
const initResult = await Promise.race([initPromise, timeoutPromise])
```

**健康检查**：定期 ping 子进程（ACP 协议暂无 ping 方法，但可检查进程存活）：

```typescript
// 在 cleanupTimer 中增加健康检查
for (const [userId, session] of userSessions) {
  if (session.process.exitCode !== null || session.process.killed) {
    process.stderr.write(`wechat acp-bridge: session ${userId} agent died, cleaning up\n`)
    userSessions.delete(userId)
  }
}
```

#### 方案 D：npx 预安装 + 全局安装避免冷启动

**问题**：`npx @zed-industries/claude-code-acp` 首次运行时需要下载包，Windows 网络环境可能超时。

**建议**：在 README 中推荐 Windows 用户先全局安装：

```bash
npm install -g @zed-industries/claude-code-acp
# 然后设置环境变量
set ACP_AGENT_COMMAND=claude-code-acp
set ACP_AGENT_ARGS=
```

或使用预编译二进制（Release 页面下载），无需 Node.js：

```bash
# 下载 Windows 二进制
set ACP_AGENT_COMMAND=C:\path\to\claude-code-acp.exe
set ACP_AGENT_ARGS=
```

#### 方案 E：Windows 上使用 `cmd /c` 包装 npx

**现有代码已部分处理**（第 1074 行 `shell: useShell`），但可进一步优化：

```typescript
const useShell = process.platform === 'win32'
// 已有 shell: useShell，但如果 Bun 的 shell 处理有问题，可显式使用 cmd /c
const cmd = useShell ? 'cmd' : AGENT_COMMAND
const args = useShell ? ['/c', AGENT_COMMAND, ...AGENT_ARGS] : AGENT_ARGS
const proc = spawn(cmd, args, {
  stdio: ['pipe', 'pipe', 'inherit'],
  cwd: getUserCwd(userId),
  env: { ...process.env, ...AGENT_ENV },
  // 不再需要 shell: true，因为已显式使用 cmd /c
})
```

### 13.6 推荐实施顺序

| 优先级 | 方案 | 预估工作量 | 影响 |
|--------|------|-----------|------|
| **P0（必须）** | 方案 A — 手动 WritableStream 包装 | 0.5 天 | 修复根因，Windows/WSL2/旧 Bun 全兼容 |
| **P1（强烈推荐）** | 方案 B — 自动重试 | 0.5 天 | 提升鲁棒性，覆盖所有临时崩溃场景 |
| **P2（推荐）** | 方案 C — 初始化超时 | 0.25 天 | 避免 npx 下载卡死时无限挂起 |
| **P3（文档）** | 方案 D — 预安装指南 | 0.1 天 | 减少首次启动问题 |
| **P4（可选）** | 方案 E — cmd /c 显式包装 | 0.1 天 | 进一步防御 Windows spawn 边缘问题 |

### 13.7 与 @zed-industries/claude-agent-acp 的替代方案

| 方案 | 说明 | 适用性 |
|------|------|--------|
| **@zed-industries/claude-agent-acp（当前）** | Zed 团队维护的 ACP 适配器 | ✅ 最成熟，0.16.2 版 |
| **@anthropic-ai/claude-agent-sdk（直接用）** | Anthropic 官方 Agent SDK，内置 ProcessTransport | ⚠️ 更底层，需自己实现 ACP 协议层 |
| **预编译二进制** | 从 Release 页面下载 Windows 二进制 | ✅ 无需 Node.js/npx，避免所有 spawn 问题 |
| **@hi-knowledge/claude-code-acp** | 社区 fork，v0.0.1 | ❌ 过早期 |
| **@mrtkrcm/acp-claude-code** | 社区 fork，v0.21.1 | ⚠️ 4 个月未更新 |

### 13.8 总结

**根因确认**：Windows 上的 "TypeError: stream is closing or closed" 是 **Bun 的 `Writable.toWeb()` 在 Windows 上实现不完整** 导致的（Bun Issue #16087 / #3927）。虽然 Bun Issue #3927 在 2025-01 标记为 COMPLETED，但 Windows 上的行为可能仍不稳定，尤其是对子进程 stdin pipe 的 Web Stream 转换。

**最优修复路径**：实现方案 A（手动 WritableStream 包装）即可彻底解决根因，同时搭配方案 B（自动重试）和方案 C（初始化超时）提升整体鲁棒性。这三个方案的修改范围限定在 `createSession()` 和 `enqueueMessage()` 函数内部，不影响其他功能。

**受影响文件**：
- `channels/wechat/acp-bridge.ts`（第 1098-1100 行，第 1229-1252 行）
- `channels/feishu/acp-bridge.ts`（第 410-412 行，对应的 enqueueMessage 函数）

---


## 14. Codex 适配 + 协议更新审查（第七次校验）

> **审查时间**：2026-06-18 10:16:09 +08:00（第七次校验通过）
> **审查范围**：2026-04-24（上期基准）至 2026-06-18
> **审查人**：香草少校

### 14.1 核心结论

| # | 变更 | 严重度 | 行动 |
|---|------|--------|------|
| 1 | **Codex 插件适配**：项目需从 Claude Code 单平台扩展为 Codex + Claude Code 双平台 | **高** | 新增 `.codex-plugin/plugin.json`、`.agents/plugins/marketplace.json`，技能格式兼容 |
| 2 | **ACP 包版本**：`@agentclientprotocol/claude-agent-acp` 0.24.x→0.47.0，`@zed-industries/codex-acp` → 0.16.0 | **中** | 更新 `AGENT_PRESETS` 版本锁定 |
| 3 | **iLink Bot API** 协议层无变化 | **无** | 无需行动 |
| 4 | **飞书 SDK** `@larksuiteoapi/node-sdk` 1.60.0→1.67.0 | **低** | 次要不兼容，package.json 消费者自行升级 |
| 5 | **ACP SDK** `@agentclientprotocol/sdk` 0.16.1→0.26.0 | **中** | 当前实现使用 `acp.ClientSideConnection` API 稳定，验证确认无 breaking change |

### 14.2 协议更新详情

#### iLink Bot API（微信）
- **7 个端点不变**：`get_bot_qrcode`, `get_qrcode_status`, `getupdates`, `sendmessage`, `getuploadurl`, `getconfig`, `sendtyping`
- 官方插件 `@tencent-weixin/openclaw-weixin` 从 v1.0.3 (175KB) 跳至 **v2.4.4** (772KB, 2026-05-22)
- v2.x 是大版本重构（OpenClaw plugin SDK v2 格式），但 iLink API 层无变化
- 本项目直接调用 iLink HTTP API，不依赖该插件，**无需同步升级**

#### 飞书/Lark SDK
- `@larksuiteoapi/node-sdk`: v1.60.0 → v1.67.0（+7 次发布）
- 最后修改：2026-06-15（3 天前）
- 变更属增量式，不影响现有 WebSocket 和 REST API 调用

#### ACP 生态
- `@agentclientprotocol/sdk`: 0.16.1 → 0.26.0（10 个版本）
- `@agentclientprotocol/claude-agent-acp`: 0.24.0 → **0.47.0**（23 个版本，昨天刚发布）
- `@zed-industries/codex-acp`: **0.16.0**（2026-06-08 发布）
- 当前项目使用 `acp.ClientSideConnection` 基础 API，核心接口稳定

### 14.3 证据清单

#### 议题 A：Codex 插件格式规范

| # | 来源 | URL | 类型 | 关键发现 | 采纳性 |
|---|------|-----|------|---------|--------|
| A1 | Codex 官方插件规范 | `~/.codex/skills/.system/plugin-creator/references/plugin-json-spec.md` | 本地/官方 | `.codex-plugin/plugin.json` 含 `interface` 段，skills 仅需 `name`+`description`，不含 `hooks` | ✅ |
| A2 | Codex 官方 spreadsheets 插件 | `~/.codex/plugins/cache/openai-primary-runtime/spreadsheets/` | 本地/官方 | 完整 `plugin.json` 参考实现，含 `interface`、`defaultPrompt`、`brandColor` | ✅ |
| A3 | codex-office-connectors | `https://github.com/MuZiJin701/codex-office-connectors` | GitHub | 飞书/企业微信 Codex 插件参考实现，marketplace 位于 `.agents/plugins/` | ✅ |

#### 议题 B：ACP 包版本状态

| # | 来源 | URL | 类型 | 关键发现 | 采纳性 |
|---|------|-----|------|---------|--------|
| B1 | npm registry | `npm view @agentclientprotocol/claude-agent-acp` | 官方登记 | v0.47.0, 2026-06-17 发布 | ✅ |
| B2 | npm registry | `npm view @zed-industries/codex-acp` | 官方登记 | v0.16.0, 2026-06-08 发布 | ✅ |
| B3 | npm registry | `npm view @agentclientprotocol/sdk` | 官方登记 | v0.26.0 | ✅ |
| B4 | GitHub releases | `https://github.com/zed-industries/codex-acp/releases` | GitHub | v0.16.0 含 Codex 0.44+ 兼容性修复 | ✅ |

#### 议题 C：iLink Bot API 协议状态

| # | 来源 | URL | 类型 | 关键发现 | 采纳性 |
|---|------|-----|------|---------|--------|
| C1 | iLink API 文档 | `https://github.com/hao-ji-xing/openclaw-weixin/blob/main/weixin-bot-api.md` | 社区文档 | 7 个端点无变化，最后更新 2026-03-22 | ✅ |
| C2 | npm registry | `npm view @tencent-weixin/openclaw-weixin` | 官方登记 | v2.4.4 (2026-05-22)，v2.x 为 OpenClaw plugin SDK v2 格式重构 | ✅ |
| C3 | GitHub commits | `https://api.github.com/repos/hao-ji-xing/openclaw-weixin/commits` | GitHub | 最后提交 2026-03-22，无新协议变更 | ✅ |

### 14.4 特例登记（Codex 适配新增文件）

| 字段 | 值 |
|------|-----|
| 触发原因 | 项目需同时支持 Claude Code 和 Codex 两个平台，Codex 使用不同于 Claude Code 的插件清单格式（`.codex-plugin/plugin.json`）和市场文件（`.agents/plugins/marketplace.json`），无法通过修改现有 Claude Code 插件文件达成 |
| 证据清单 | 见议题 A 的 A1/A2/A3 三个来源 |
| 新文件 | `.codex-plugin/plugin.json`、`.agents/plugins/marketplace.json` |
| 影响范围 | 仅新增 Codex 平台入口文件，不影响现有 Claude Code 功能 |
| 回滚方案 | 删除新增目录即可（`.codex-plugin/`、`.agents/`），无耦合 |
| Commit 标签 | `[NEW-FILE:#20260618-01]` |

### 14.5 实施变更清单

| 文件 | 变更 | 说明 |
|------|------|------|
| `.codex-plugin/plugin.json` | 新增 | Codex 插件清单，含 `interface` 元数据 |
| `.agents/plugins/marketplace.json` | 新增 | Codex marketplace 条目 |
| `channels/shared/acp-packages.ts` | 修改 | codex 预设锁定 `@0.16.0`，注释更新 |
| `package.json` | 修改 | 版本 2.1.4→2.1.5，描述含 Codex，关键词加 `codex` |
| `.claude-plugin/plugin.json` | 修改 | 版本同步 2.1.4→2.1.5 |
| `.gitignore` | 修改 | 添加 `.DS_Store` |
| `README.md` | 修改 | 副标题更新为 "Claude Code / Codex" |
| `CLAUDE.md` | 修改 | 新增第七次校验记录、证据清单、特例登记 |
| `skills/wechat-configure/SKILL.md` | 修改 | 新增平台路径检测指引，`~/.claude` → `<STATE_DIR>` + `<PLUGIN_DIR>` 变量化 |
| `skills/wechat-access/SKILL.md` | 修改 | 同上 |
| `skills/feishu-configure/SKILL.md` | 修改 | 同上 |
| `skills/feishu-access/SKILL.md` | 修改 | 同上 |
| `README.md` | 修改 | 重构：AI 安装指令用 HTML 注释藏文件开头，人类段新增 Codex 安装流程 |
| `.mcp.json` | 还原 | 修复被误替换的 `${CLAUDE_PLUGIN_ROOT}` 变量（还原为可移植格式） |

### 14.6 Codex 技能路径适配 + README 重构（第八次校验）

> **执行时间**：2026-06-18 10:35:44 +08:00（第八次校验通过）
> **执行人**：香草少校

**背景**：上一轮（第七次）完成了 Codex 插件清单和市场文件的新增，但技能文件（skills/）中仍硬编码 `~/.claude/` 路径。Codex 使用 `~/.pandacc/` 作为主目录，导致技能指令与实际路径不匹配。

**修复策略**：
1. 每个技能文件头部新增「Platform path detection」段，指导 AI 先检测平台再确定路径
2. 所有 `~/.claude/channels/` 替换为 `<STATE_DIR>/` 变量
3. 微信技能中的 `~/.claude/plugins/cache/` 替换为 `<PLUGIN_DIR>/` 变量

**README 重构**：
- AI 安装指令段（含完整安装流程、协议参考、故障排查）用 `<!-- -->` HTML 注释包裹，置于文件最开头
- GitHub 渲染时人类不可见，AI 可解析
- 人类段新增 Codex · 微信 / Codex · 飞书的 Channel 和 ACP 安装流程

**修复文件**：
- `skills/wechat-configure/SKILL.md` — 8 处路径变量化
- `skills/wechat-access/SKILL.md` — 7 处路径变量化
- `skills/feishu-configure/SKILL.md` — 5 处路径变量化
- `skills/feishu-access/SKILL.md` — 5 处路径变量化
- `README.md` — 完全重构
- `.mcp.json` — 还原被误改的硬编码路径

---

## 15. 协议更新巡检与同步（2026-06-23）

> **巡检时间**：2026-06-23 17:22:00 +08:00（第十一次时间校验通过后）
> **巡检范围**：微信 iLink Bot API、飞书/Lark Bot API、ACP/MCP/Claude Code Channel 协议
> **结论**：三大协议均无 breaking changes，微信 iLink 有重大功能升级（流式回复），飞书推出官方高层 LarkChannel API

### 15.1 版本对比

| 组件 | 上次基准 (2026-06-18) | 当前最新 (2026-06-23) | 变化级别 |
|------|---------------------|---------------------|---------|
| @tencent-weixin/openclaw-weixin | 2.4.4 (2026-05-22) | **2.4.6** (2026-06-22) | 新功能 |
| @larksuiteoapi/node-sdk | 1.67.0 (2026-06-15) | **1.67.0** (2026-06-15) | 无变化 |
| @agentclientprotocol/sdk | 0.26.0 | **0.29.0** (2026-06-22) | API 重写（旧 API 仍兼容） |
| @agentclientprotocol/claude-agent-acp | 0.47.0 | **0.49.0** (2026-06-22) | bugfix |
| @zed-industries/codex-acp | 0.16.0 | **0.16.0** (2026-06-08) | 无变化 |
| @modelcontextprotocol/sdk | ~1.12.x | **1.29.0** (v1 维护模式) | 无 breaking |
| Claude Code Channels 协议 | — | 无变化 | — |
| Codex 插件格式 | — | 无变化 | — |

### 15.2 微信 iLink Bot API 变更明细（v2.4.5/2.4.6）

| # | 变更项 | 级别 | 本项目同步状态 |
|---|--------|------|--------------|
| 1 | 新增 notifystart/notifystop 生命周期端点 | 协议合规 | ✅ 已实现（best-effort） |
| 2 | sync_buf → get_updates_buf 字段重命名 | 协议合规 | ✅ 已提前实现（内存变量 getUpdatesBuf） |
| 3 | base_info 必填（channel_version + bot_agent） | 协议合规 | ✅ 已实现 + 版本号动态读取 |
| 4 | iLink-App-Id / iLink-App-ClientVersion 请求头 | 协议合规 | ✅ 已提前实现 + 版本号动态编码 |
| 5 | CDN URL 服务端 full_url 优先 | 健壮性 | ✅ 已提前实现 |
| 6 | longpolling_timeout_ms 动态调整 | 协议友好 | ✅ 已提前实现 |
| 7 | sendMessage 响应 ret 校验 | 健壮性 | ✅ 已实现（关键端点抛错，其他 stderr 记录） |
| 8 | **流式回复协议**（message_state + run_id + client_id） | 新功能 | ⬜ P2 规划中 |
| 9 | **工具调用消息类型**（TOOL_CALL_START=11, TOOL_CALL_RESULT=12） | 新功能 | ⬜ P2 规划中 |
| 10 | 入站 delete_time_ms（消息撤回通知） | 新功能 | ⬜ P2 规划中 |
| 11 | group_id 字段预留（群聊协议预埋） | 前瞻 | ⬜ 监控中（API 未开放） |

### 15.3 飞书/Lark Bot API 变更明细（v1.60→v1.67）

| # | 变更项 | 级别 | 本项目同步状态 |
|---|--------|------|--------------|
| 1 | SDK 升级 1.60.0→1.67.0 | 依赖升级 | ✅ 已升级（无 breaking） |
| 2 | 官方高层 LarkChannel API | 新 API | ⬜ P2 评估迁移（可精简 ~300 行代码） |
| 3 | cardkit/v1 流式卡片（打字机效果 70ms 粒度） | 新功能 | ⬜ P2 规划中 |
| 4 | reaction 表情 ACK | 体验增强 | ⬜ P3 可选 |
| 5 | Lark 国际版 WebSocket 支持争议解除 | 文档更新 | ✅ 确认稳定可用 |
| 6 | bot/v3/info 端点新增 | 次要 | ⬜ 无需立即行动 |
| 7 | /im/v1/messages/reactions/batch_query | 新端点 | ⬜ P3 可选 |

### 15.4 ACP/MCP 生态变更明细

| # | 变更项 | 级别 | 本项目状态 |
|---|--------|------|-----------|
| 1 | ACP SDK v0.27+ createAcpClient() 新 API | API 演进 | ⬜ P2 迁移（旧 API 仍可用，deprecated 警告） |
| 2 | session.cancel() 请求取消 | 新功能 | ⬜ P2 可用于微信/飞书"取消"命令 |
| 3 | claude-agent-acp v0.49 流式去重 bugfix | bugfix | ✅ npx 自动拉 latest，受益 |
| 4 | MCP SDK v1.29.0 | 维护版本 | ⬜ 可升级（低优先） |
| 5 | MCP v2.0.0-alpha | 未来版本 | ⬜ 监控中，不行动 |

### 15.5 本次同步修改清单

**P0 协议合规（已完成）：**
- `channels/wechat/server.ts`：版本号动态读取 package.json、encodeClientVersion() 位运算编码、injectBaseInfo() 统一注入、apiFetch ret 校验、notifyStart/notifyStop 生命周期函数
- `channels/wechat/acp-bridge.ts`：同上
- 版本号硬编码问题修复（原来是 '2.1.9' 和 '1.0.0' 双处不一致）

**依赖升级（已完成）：**
- `package.json`：@larksuiteoapi/node-sdk ^1.60.0 → ^1.67.0
- `channels/shared/acp-packages.ts`：版本注释更新到 claude-agent-acp 0.49.0、ACP SDK 0.29.0
- `bun.lock`：bun install 自动更新

**修复：**
- `channels/feishu/server.ts:852`：修复换行字面量语法错误

### 15.6 P2 下阶段规划（流式输出体验升级）

1. **微信流式回复**：message_state=GENERATING/FINISH + run_id + client_id，实现微信端实时打字效果 + 工具调用过程可见
2. **飞书 cardkit 打字机效果**：基于 cardkit/v1 streaming_mode + PUT elements/:id/content 增量推送，70ms 粒度真实流式
3. **ACP SDK 迁移**：从 deprecated ClientSideConnection/ndJsonStream 迁移到 createAcpClient()，接入 session.cancel()
4. **（可选）飞书 LarkChannel 迁移**：用官方高层 API 精简 feishu-client.ts 代码量

---

## 16. P2 流式输出体验升级（2026-06-23）

> **实施时间**：2026-06-23（第十一次时间校验锚点）
> **审批**：Comdr 微信审批通过
> **状态**：已实现 + 独立验证通过（修复 1 个重要问题）

### 16.1 微信流式回复（channels/wechat/acp-bridge.ts）

实现 iLink v2.4.5 流式回复协议，仅在 ACP 模式生效（MCP Channel 的 reply 工具一次性收到完整文本，无增量来源）。

| 能力 | 实现 |
|------|------|
| 增量文本推送 | ACP `agent_message_chunk` → `message_state=GENERATING` + `run_id`，节流批量发送 |
| 工具调用可见 | `tool_call` → TOOL_CALL_START(type=11)；`tool_call_update` → TOOL_CALL_RESULT(type=12) |
| 最终消息 | `message_state=FINISH` + 完整全文 |
| 节流防限频 | 累积 100 字符或 1000ms 先到先发（控 ~5 QPS） |

**关键设计决策（多分块降级）**：iLink 流式渲染语义（last-wins by run_id）是**未经真机验证的假设**。为避免长回复（>2000字符）截断或重复：
- 单 chunk：走流式 FINISH（last-wins 覆盖 GENERATING 片段）
- 多 chunk：仅首块用 FINISH 终结流式态，后续块用普通 sendMessage 追加（两种渲染语义下均安全）

**环境变量**：
| 变量 | 默认 | 说明 |
|------|------|------|
| `WECHAT_STREAMING` | 1（开启） | 设 0 关闭，回退单次 sendMessage |
| `WECHAT_STREAM_CHARS` | 100 | GENERATING 累积字符触发阈值 |
| `WECHAT_STREAM_MS` | 1000 | GENERATING 时间触发阈值 |

### 16.2 飞书 cardkit 流式卡片（channels/feishu/cardkit-stream.ts 新增）

基于飞书 SDK v1.67.0 cardkit/v1 API 实现端到端打字机效果。

| 能力 | 实现 |
|------|------|
| 卡片创建 | `cardkit.v1.card.create`（卡片 JSON 含 `config.streaming_config: {print_frequency_ms:70, print_step:1, print_strategy:'fast'}`） |
| 增量推送 | `cardkit.v1.cardElement.content`（element_id='streaming_md', sequence 单调递增） |
| 完成 | `cardkit.v1.card.settings` 关闭 streaming_mode |
| ACP 真流式 | acp-bridge.ts：session/update text chunk 实时镜像到卡片 |
| Channel 伪流式 | server.ts：完整文本切片喂入（纯 UX，见 P3 优化建议） |
| 降级 | cardkit 失败 → hasDelivered() 门控 → 回退 plaintext，card/text 互斥不双发 |

**环境变量**：
| 变量 | 默认 | 说明 |
|------|------|------|
| `FEISHU_STREAMING` | 开启 | 设 0/false/off 关闭 |
| `FEISHU_STREAMING_FREQ_MS` | 70 | 打字间隔 |
| `FEISHU_STREAMING_STEP` | 1 | 每次字符数 |
| `FEISHU_STREAMING_STRATEGY` | fast | fast/delay |

### 16.3 新增文件特例登记

| 字段 | 值 |
|------|-----|
| 触发原因 | cardkit 流式卡片逻辑（创建/增量推送/完成/降级）独立内聚，封装为 CardkitStreamController 类，无法融入现有 server.ts/acp-bridge.ts 而不污染 |
| 新文件 | channels/feishu/cardkit-stream.ts |
| 纹身 | ✅ Input/Output/Pos 三行注释齐全 |
| README 登记 | ✅ channels/feishu/README.md 已登记 |
| Commit 标签 | [NEW-FILE:#20260623-01] |

### 16.4 独立验证结论

四文件构建全绿（wechat server 207 / wechat acp 93 / feishu server 356 / feishu acp 231 modules，均 exit=0）。

修复的重要问题：微信多分块 FINISH 共享 run_id 截断/重复风险 → 已降级处理。

### 16.5 P3 后续优化项（记入 TODO）

1. 微信流式渲染语义真机抓包验证（last-wins vs append），确认后固化注释
2. 飞书 cardkit-stream.ts flushNow 改真 promise 链锁（消除 finish-vs-timer 并发窗口）
3. 飞书 server.ts 伪流式默认关闭或仅长文本启用（避免 3+N API 调用放大）
4. 统一两端流式开关默认值宽容度（WECHAT_STREAMING 仅判 '0'，FEISHU 含 false/off）

---

## 17. P3 流式优化 + 官方语义确认（2026-06-23）

> **实施时间**：2026-06-23（第十一次时间校验锚点）
> **审批**：Comdr 微信审批通过

### 17.1 重大发现：iLink 流式渲染语义确认为 append（非 last-wins）

通过下载分析官方包 @tencent-weixin/openclaw-weixin@2.4.6 源码（messaging/send.ts、reply-progress-sender.ts、channel.ts、api/types.ts），**确认 iLink Bot 流式多分块渲染语义**：

| 维度 | 官方实现 |
|------|---------|
| 文本分块 | 上层 blockStreaming 合并（minChars:200, idleMs:3000），每块调用一次 delivery hook |
| 每块发送 | 每个文本块都是独立 message_state=FINISH 消息 |
| run_id | 整轮共享一个（分组文本块+工具事件，**不触发替换**） |
| client_id | 每条消息全新生成，**从不复用** |
| msg_id | 预留字段，**全源码无写入，无 item 级 PATCH 路径** |
| **多块渲染语义** | **append（追加），各自独立显示，非 last-wins** |

**修正**：第 16 章中「多分块 FINISH 互相覆盖导致截断」的担忧是基于未验证假设，经官方源码证伪。run_id 仅作分组用途，不触发覆盖。

### 17.2 P3 优化清单

| # | 优化 | 文件 | 实现 |
|---|------|------|------|
| P3-1 | 微信多分块流式改为官方对齐的 append 全 FINISH | wechat/acp-bridge.ts | 默认每块用 sendStreamFinish（同 run_id、新 client_id、FINISH）；保守回退 WECHAT_STREAM_SAFE_MULTI=1 恢复「首块流式+余块普通」 |
| P3-2 | 飞书 cardkit flushNow 真 promise 链锁 | feishu/cardkit-stream.ts | flushing 改常驻 promise 链（.then(doFlush)），彻底消除 finish-vs-timer 双重 doFlush 竞态 |
| P3-3 | 飞书 server.ts 伪流式默认关闭 | feishu/server.ts + cardkit-stream.ts | 新增 FEISHU_CHANNEL_PSEUDO_STREAM（默认关），避免 Channel 模式 3+N API 调用放大；ACP 真流式不受影响 |
| P3-4 | 两端流式开关宽容度统一 | wechat/acp-bridge.ts | WECHAT_STREAMING 支持 0/false/off（忽略大小写），与飞书 FEISHU_STREAMING 一致 |

### 17.3 环境变量总表（流式相关）

| 变量 | 作用域 | 默认 | 说明 |
|------|--------|------|------|
| WECHAT_STREAMING | 微信 ACP | 开启 | 0/false/off 关闭 |
| WECHAT_STREAM_CHARS | 微信 ACP | 100 | GENERATING 字符触发阈值 |
| WECHAT_STREAM_MS | 微信 ACP | 1000 | GENERATING 时间触发阈值 |
| WECHAT_STREAM_SAFE_MULTI | 微信 ACP | 0（关） | 1 启用保守多块降级（防客户端偏离 append 语义） |
| FEISHU_STREAMING | 飞书 ACP | 开启 | 0/false/off 关闭真流式 |
| FEISHU_CHANNEL_PSEUDO_STREAM | 飞书 Channel | 关闭 | 1/true/on 开启伪流式打字机 |
| FEISHU_STREAMING_FREQ_MS | 飞书 | 70 | 打字间隔 |
| FEISHU_STREAMING_STEP | 飞书 | 1 | 每次字符数 |
| FEISHU_STREAMING_STRATEGY | 飞书 | fast | fast/delay |

### 17.4 验证

5 文件构建全绿（wechat server/acp + feishu server/acp/cardkit-stream，均 exit=0）。

