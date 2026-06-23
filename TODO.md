## TODO — claude-channel-wechat (v2.1.8)

> 最后更新：2026-06-23 17:22:00 +08:00（第十一次锚点）

### 进行中

（无）

### 待处理

（无）

### 已完成

- [x] P3-1 微信多分块流式改官方对齐 append 全 FINISH（每块 sendStreamFinish 同 run_id），保守开关 WECHAT_STREAM_SAFE_MULTI 兜底（2026-06-23）
- [x] P3-2 飞书 cardkit-stream.ts flushNow 改真 promise 链锁（消除 finish-vs-timer 双重 doFlush 竞态）（2026-06-23）
- [x] P3-3 飞书 server.ts 伪流式默认关闭（FEISHU_CHANNEL_PSEUDO_STREAM 控制），避免 Channel 模式 3+N API 放大（2026-06-23）
- [x] P3-4 两端流式开关宽容度统一（WECHAT_STREAMING 支持 0/false/off）（2026-06-23）
- [x] 官方源码确认 iLink 流式渲染语义为 append（@tencent-weixin/openclaw-weixin@2.4.6，证伪第16章「多分块截断」担忧）（2026-06-23）
- [x] P2 流式输出体验升级 — 微信流式回复 + 飞书 cardkit 打字机（2026-06-23）
- [x] 第十次时间真实性校验 — 2026-06-18 13:08:17 +08:00 通过
- [x] 冗余文件治理审计 — 无冗余发现
- [x] 源文件纹身声明补全 — 6个.ts文件纹身誓言补全
- [x] 文件夹README治理 — 9个目录新建README（3行内）+ channels/存量合规
- [x] CLAUDE.md 第十次时间校验记录写入
- [x] CLAUDE.md 纹身与README治理报告写入
- [x] ACP可靠性方案实现验证 — 方案A/B/C/D/E 全部已实现
- [x] TypeScript编译检查 — N/A（Bun项目，.ts直接运行无编译步骤）

### 封锁项

（无）
