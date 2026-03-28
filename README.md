# claude-plugin-wechat

<details open>
<summary><h2>人类看这里</h2></summary>

多渠道 Claude Code 插件 — 通过微信、飞书/Lark 与 AI 对话

支持：文字、图片、文件、语音、视频、远程权限审批、飞书文档

<img src="docs/wechat-test-screenshot.jpg" alt="WeChat Channel Test" width="300" />

---

### 选择渠道

```
你用什么 IM？
  ├── 微信 ──→ 往下看「微信」
  └── 飞书/Lark ──→ 往下看「飞书」
```

```
你的 Claude Code 怎么登录的？
  ├── claude.ai 账号 ──→ Channel 模式（全功能，远程审批）
  └── API Key ──→ ACP 模式（多 Agent：Claude / Copilot / Gemini / Codex / 通义千问）
```

---

<details>
<summary><h3>👇 微信</h3></summary>

<details>
<summary><b>Channel 模式</b>（claude.ai 用户）</summary>

> 前置：[Claude Code](https://claude.ai/claude-code) **v2.1.80+**，claude.ai 登录
> 检查：`claude --version`，低于请 `claude update`

| 步骤 | 操作 | 在哪 |
|------|------|------|
| 1 安装 | `/plugin marketplace add lc2panda/claude-plugin-wechat` 然后 `/plugin install wechat@lc2panda-plugins` | Claude Code |
| 2 登录 | `/wechat:configure login` → 微信扫码 → 手机确认 | Claude Code |
| 3 启动 | `claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins` | 系统终端 |
| 4 使用 | 扫码的微信号自动授权，直接发消息 | 微信 |

</details>

<details>
<summary><b>ACP 模式</b>（API Key 用户）</summary>

> 前置：[Bun](https://bun.sh)（`curl -fsSL https://bun.sh/install | bash`）
> `wechat-acp` 会自动在后台启动 AI 引擎，无需手动打开 Claude Code

| 步骤 | 操作 | 在哪 |
|------|------|------|
| 1 安装 | `bun add -g github:lc2panda/claude-plugin-wechat` | 系统终端 |
| 2 启动 | `wechat-acp`（首次自动弹二维码登录） | 系统终端 |
| 3 使用 | 直接发消息，`/cwd` 切换项目目录 | 微信 |

</details>

</details>

---

<details>
<summary><h3>👇 飞书/Lark</h3></summary>

#### 第一步 · 创建应用

- **飞书（国内）：** 打开 [飞书开放平台](https://open.feishu.cn) → 创建自建应用
- **Lark（国际版）：** 打开 [Lark Developer](https://open.larksuite.com) → 创建自建应用

记下 `App ID` 和 `App Secret`

> Lark 用户在配置凭据时需切换域名：`/feishu:configure domain lark`

#### 第二步 · 导入权限

权限管理 → 批量导入/导出权限 → 粘贴以下 JSON → 确认申请：

```json
{"scopes":{"tenant":["im:message","im:message.p2p_msg:readonly","im:message.group_at_msg:readonly","im:message:send_as_bot","im:resource"]}}
```

#### 第三步 · 配置长连接 + 事件

1. 事件与回调 → 订阅方式 → 选择 **「使用长连接接收事件」**
2. 添加事件：`im.message.receive_v1`

#### 第四步 · 发布

版本管理 → 创建版本 → 发布

---

<details>
<summary><b>Channel 模式</b>（claude.ai 用户）</summary>

| 步骤 | 操作 | 在哪 |
|------|------|------|
| 5 安装 | `/plugin marketplace add lc2panda/claude-plugin-wechat` 然后 `/plugin install wechat@lc2panda-plugins` | Claude Code |
| 6 凭据 | `/feishu:configure login` → 输入 App ID + App Secret | Claude Code |
| 7 启动 | `claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins` | 系统终端 |
| 8 使用 | 私聊机器人或群聊 @机器人 | 飞书 |

> 此命令同时加载微信和飞书两个渠道（都在同一个插件中）

</details>

<details>
<summary><b>ACP 模式</b>（API Key 用户）</summary>

| 步骤 | 操作 | 在哪 |
|------|------|------|
| 5 安装 | `bun add -g github:lc2panda/claude-plugin-wechat` | 系统终端 |
| 6 凭据 | `/feishu:configure login` → 输入 App ID + App Secret | Claude Code |
| 7 启动 | `feishu-acp` | 系统终端 |
| 8 使用 | 私聊机器人或群聊 @机器人，`/cwd` 切换目录 | 飞书 |

</details>

</details>

---

<details>
<summary><h3>👇 更新插件</h3></summary>

| 模式 | 命令 |
|------|------|
| Channel | `/plugin marketplace update lc2panda-plugins` → `/plugin install wechat@lc2panda-plugins` → 重启 Claude Code |
| ACP（微信） | `bun add -g github:lc2panda/claude-plugin-wechat` → 重启 wechat-acp |
| ACP（飞书） | `bun add -g github:lc2panda/claude-plugin-wechat` → 重启 feishu-acp |

</details>

---

<details>
<summary><h3>IM 端命令</h3></summary>

| 命令 | 作用 | 适用 |
|------|------|------|
| `/cwd [路径]` | 查看或切换工作目录 | ACP 模式 |
| `/toggle-debug` | 切换调试模式 | 全部 |
| `/echo <文字>` | 回显并显示延迟 | 全部 |

</details>

### 相关项目

- **企业微信：** [dividduang/claude-plugin-wecom](https://github.com/dividduang/claude-plugin-wecom)

</details>

---

## AI 看这里

以下内容供 Claude Code 自动执行安装和配置。

### 第 0 步 · 环境检测

```bash
claude --version   # >= 2.1.80
bun --version      # 必须
```

低于 2.1.80：告诉用户 `claude update`
无 Bun：告诉用户 `curl -fsSL https://bun.sh/install | bash`

**询问用户：**
1. 需要接入哪个渠道？微信 / 飞书 / 都要？
2. Claude Code 登录方式？claude.ai（→ Channel）/ API Key（→ ACP）？

根据回答，执行对应路径。

---

### 微信 · Channel 模式

#### 步骤 1 — 安装插件

```
/plugin marketplace add lc2panda/claude-plugin-wechat
/plugin install wechat@lc2panda-plugins
```

找不到 marketplace 时先 `/plugin marketplace update lc2panda/claude-plugin-wechat`。安装后 `/reload-plugins`。

#### 步骤 2 — 微信登录 [需人类操作]

检查凭据：`cat ~/.claude/channels/wechat/credentials.json 2>/dev/null`

有凭据则跳过。否则告诉用户执行 `/wechat:configure login` — 终端显示二维码，微信扫码，手机确认。

#### 步骤 3 — 启动 [需人类操作]

告诉用户退出 Claude Code 并执行：

```
claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

#### 步骤 4 — 验证

扫码登录的微信号**自动在白名单中**，无需配对。告诉用户从微信发消息，消息到达后以 `<channel source="wechat" ...>` 格式出现，用 `reply` 工具回复。

其他用户需配对：发消息 → 收到 6 位配对码 → 机主执行 `/wechat:access pair <配对码>`。

---

### 微信 · ACP 模式

#### 步骤 1 — 全局安装 [需人类操作]

```bash
bun add -g github:lc2panda/claude-plugin-wechat
```

#### 步骤 2 — 启动 [需人类操作]

```bash
wechat-acp
```

无凭据时自动弹出二维码登录。重新登录：`wechat-acp --login`

其他启动方式：
```bash
wechat-acp --cwd /项目路径          # 指定工作目录
ACP_AGENT=gemini wechat-acp        # 切换 Agent
```

内置预设：`claude`（默认）、`copilot`、`gemini`、`qwen`、`codex`、`opencode`

#### 步骤 3 — 验证

同 Channel 模式。扫码者自动授权，其他用户需配对。

微信发 `/cwd /新路径` 可切换工作目录。

---

### 飞书/Lark · Channel 模式

#### 步骤 1 — 安装插件

```
/plugin marketplace add lc2panda/claude-plugin-wechat
/plugin install wechat@lc2panda-plugins
```

#### 步骤 2 — 配置凭据 [需人类操作]

检查凭据：`cat ~/.claude/channels/feishu/credentials.json 2>/dev/null`

有凭据则跳过。否则告诉用户执行 `/feishu:configure login`，输入 App ID 和 App Secret。

如果用户还没有飞书应用，引导：
1. 飞书开放平台（open.feishu.cn）或 Lark Developer（open.larksuite.com）创建自建应用。Lark 用户需执行 `/feishu:configure domain lark` 切换域名
2. 权限管理 → 批量导入 JSON：`{"scopes":{"tenant":["im:message","im:message.p2p_msg:readonly","im:message.group_at_msg:readonly","im:message:send_as_bot","im:resource"]}}`
3. 事件与回调 → 订阅方式 → 使用长连接接收事件 → 添加 `im.message.receive_v1`
4. 版本管理 → 创建版本 → 发布

#### 步骤 3 — 启动 [需人类操作]

告诉用户退出 Claude Code 并执行：

```
claude --dangerously-skip-permissions --dangerously-load-development-channels plugin:wechat@lc2panda-plugins
```

此命令同时加载微信和飞书两个渠道

#### 步骤 4 — 验证

飞书消息以 `<channel source="feishu" user_id="..." chat_id="..." ts="...">` 格式到达。用 `reply` 工具回复，必须传 `chat_id`。

首次用户需配对（同微信机制），配对后自动授权。

---

### 飞书/Lark · ACP 模式

#### 步骤 1 — 全局安装 [需人类操作]

```bash
bun add -g github:lc2panda/claude-plugin-wechat
```

#### 步骤 2 — 配置凭据

同 Channel 模式步骤 2。

#### 步骤 3 — 启动 [需人类操作]

```bash
feishu-acp
```

#### 步骤 4 — 验证

同 Channel 模式。飞书发 `/cwd /新路径` 切换工作目录。

---

## 参考（AI 用）

### 工具

| 工具 | 渠道 | 参数 |
|------|------|------|
| `reply` | 微信 | `user_id`, `text`, `context_token`（必填）; `files[]`（可选） |
| `reply` | 飞书 | `user_id`, `text`, `chat_id`（必填）; `files[]`（可选） |
| `download_attachment` | 全部 | `attachment_id` |

### 微信协议

- 能力声明：`claude/channel` + `claude/channel/permission`
- 入站：`notifications/claude/channel` → meta `{user_id, context_token, ts}`
- 出站：`reply` 工具，`context_token` 必填
- 权限中继：用户回复 `yes <code>` / `no <code>`
- Typing：每 5 秒 keepalive，回复后取消，5 分钟安全超时
- 媒体：AES-128-ECB CDN，13 种图片 + 11 种视频格式
- 语音：优先 ASR 文本，否则 SILK→WAV 转码
- 引用消息：`ref_msg` 提取

### 飞书协议

- 能力声明：`claude/channel` + `claude/channel/permission`
- 入站：`notifications/claude/channel` → meta `{user_id, chat_id, ts}`
- 出站：`reply` 工具，`chat_id` 必填
- 权限中继：卡片按钮（i18n_elements + button）+ 文字回退
- Typing：emoji reaction（Typing 表情），回复后移除
- 媒体：平台托管（无加密），REST API 上传下载
- 消息格式：纯文本自动用 text，含 markdown 自动用 post 富文本
- 群聊：WebSocket 模式下 @机器人 自动触发

### 技能

| 技能 | 渠道 | 用途 |
|------|------|------|
| `/wechat:configure` | 微信 | 登录、状态 |
| `/wechat:access` | 微信 | 配对、白名单、策略 |
| `/feishu:configure` | 飞书 | 登录、凭据、域名切换 |
| `/feishu:access` | 飞书 | 配对、白名单、策略 |

### 状态文件

| 路径 | 内容 |
|------|------|
| `~/.claude/channels/wechat/credentials.json` | 微信认证 |
| `~/.claude/channels/wechat/access.json` | 微信访问控制 |
| `~/.claude/channels/feishu/credentials.json` | 飞书认证 |
| `~/.claude/channels/feishu/access.json` | 飞书访问控制 |

### 故障排查

| 现象 | 解决 |
|------|------|
| `Channels are not currently available` | 用 ACP 模式，或 `claude logout` → `claude login` |
| `credentials required` | 微信：`/wechat:configure login` / 飞书：`/feishu:configure login` |
| 没收到消息 | 确认启动命令含 `--dangerously-load-development-channels` |
| `user not allowlisted` | `/wechat:access pair <code>` 或 `/feishu:access pair <code>` |
| 飞书卡片显示纯文本 | 检查应用是否开启消息卡片能力 |
| 飞书长连接失败 | 检查事件与回调是否选择"使用长连接接收事件" |

---

## 致谢

本项目基于 [m1heng/claude-plugin-weixin](https://github.com/m1heng/claude-plugin-weixin) 开发，感谢原作者的贡献。

---

License: MIT
