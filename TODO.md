## TODO — claude-channel-wechat (v2.1.7)

> 最后更新：2026-06-23 17:22:00 +08:00（第十一次锚点）

### 进行中

（无）

### 待处理（P3 流式优化）

- [ ] 微信流式渲染语义真机抓包验证（last-wins vs append），确认后固化注释
- [ ] 飞书 cardkit-stream.ts flushNow 改真 promise 链锁（消除 finish-vs-timer 并发窗口）
- [ ] 飞书 server.ts 伪流式默认关闭或仅长文本启用（避免 3+N API 调用放大）
- [ ] 统一两端流式开关默认值宽容度（WECHAT_STREAMING 仅判 '0'，FEISHU 含 false/off）

### 已完成

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
