<div align="center">

# dsh-hub-index

**DeepSeek Harness 生态的发现与信任索引**

*The discovery & trust layer for the dsh ecosystem — not another shelf.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![entries](https://img.shields.io/badge/entries-36-green)
![validation](https://img.shields.io/badge/CI-schema%20validated-brightgreen)
![crawler](https://img.shields.io/badge/crawler-weekly-orange)

### 🌐 [在线浏览 → jiangxingfan1-coder.github.io/dsh-hub-index](https://jiangxingfan1-coder.github.io/dsh-hub-index/)

</div>

---

一个 git 仓库承载的插件 / 技能 / 组合注册中心：**不存代码、不重造分发**（分发底座是 npm 与 GitHub，`dsh plugin add` 两者皆通），只做三件事——**发现**（联邦索引 + 每周自动爬取）、**信任**（分层徽章 + 发布者锚定）、**组合注册**（compose 规范）。

```
   GitHub topic:dsh-plugin (4400+)  ─┐
   官方 discussions 帖               ├─→  每周爬取 → drafts/ → 人工过目 → entries/
   npm registry 扫描                 ┘                                      │
   社区货架联邦（unreviewed 起步）  ──────────────────────────────────────────┤
                                                                            ▼
                                                  schema 校验 CI → Pages 在线索引
                                                            │
                                          ┌─────────────────┼──────────────────┐
                                          ▼                 ▼                  ▼
                                    网页浏览          Settings 商店页      Agent 工具
                                  （本站）        （dsh-hub-panel）   （hub_search/show）
```

## 📦 三种条目

| 目录 | 单元 | 说明 |
|---|---|---|
| `entries/plugins/` | **plugin** / **skill** | npm 包、GitHub 仓库或 SKILL.md 包的引用 |
| `entries/plugins/`（kind: app） | **app** | 生态周边独立应用：桌宠、启动器、便携构建等（不经 `dsh plugin add`） |
| `entries/composes/` | **compose** ⭐ | **patch + preset + 简报 + 插件清单的能力组合**——dsh 独有的一等分享单元 |

> **为什么 compose 是一等公民**：在一个以 patch 分层的 harness 里，真正的"能力"从来不是单个插件，而是一棵调好的组合树 overlay。首个展品：[super-fast](entries/composes/super-fast.yml)（两相位调度家族，19 轮受控实验）。规范见 [schema/compose.schema.json](schema/compose.schema.json)——含 `!!js` 使用、waterfall 监听、子代理派生等安全声明字段。

## 🛡 信任分层（ClawHavoc 教训内置）

`official`（@deepseek-ai 域）→ `verified`（发布者实名 + 仓库-npm 对应 + 构建溯源核验）→ `community`（实名无审计）→ `unreviewed`（默认档）

铁律，每一条都有事故背书（OpenClaw ClawHub 2026 上半年供应链灾难的镜像映射）：

1. **下载量、星数、排名永不参与信任评级**——ClawHub 排名操纵漏洞：任意攻击者可刷到分类第一（PoC 6 天 3900 次执行）。
2. **信任绑发布者、全目录联动**——一包实锤恶意，同发布者全部条目降级隔离（registry saturation 攻防：单发布者向自己整个目录注入相同载荷）。
3. **扫描通过 ≠ 安全**——`provenance.scanned` 只是过程记录。ClawHub 接入 VirusTotal 后仍有逃逸；Snyk 审计 36.8% 已发布 skills 含缺陷。
4. **compose 审计重心是 patch**——`!!js` 表达式即任意代码；简报文本按 prompt injection 面对待。
5. **提醒使用者**：装一个 dsh 插件 = npm postinstall + Host realm 零审批 = **交出整台机器**。unreviewed 条目请读源码后再装。

`securityNotes` 字段的由来：社区案例 dsh-claude-antidote 证明**一个插件可以静默拔除另一个插件的执行链而保留其 UI 假象**（"灯是亮的，线是拔的"）——审计必须看整棵组合树，条目据此标注能力覆盖、远程访问面、凭据需求、重打包供应链等事实。

## 🤝 联邦对象（现有目录，数据可对接）

- [Blue-Whale-Harness](https://github.com/leenkcool/Blue-Whale-Harness)（1824 款收录目录）
- [dsh-plugin-hub](https://github.com/deepseek-ai/deepseek-harness/discussions/2256)（商店插件，GitHub+npm 同步）
- [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)（★3.4k 精选列表）
- GitHub `topic:dsh-plugin`（4400+ 仓库）——`scripts/crawl-topic.mjs` 每周一自动爬入 `drafts/` 并开 PR

联邦原则：聚合数据、**不继承信任判断**——外来条目一律 `unreviewed` 起步。

## ✍️ 提交条目

1. Fork → `entries/<plugins|composes>/<name>.yml`（照 schema；字段不明填 `null` + `notes` 标 todo，**不编造**）
2. PR —— CI 自动校验 schema 与信任纪律（新条目不得自评 official/verified）
3. 维护者核验来源后合并；晋级 `verified` 需仓库-npm 对应与发布者实名核验

本地开发：`npm install && npm run validate && npm run build`（build 生成 `docs/entries.json` 供 Pages 与各客户端消费）。

## 🔌 消费这份索引

- **网页**：[在线索引](https://jiangxingfan1-coder.github.io/dsh-hub-index/)（搜索 / kind 与 trust 过滤 / 安全备注展示）
- **dsh 里**：[dsh-hub-panel](https://github.com/jiangxingfan1-coder/dsh-hub-panel)（Settings → Hub 商店页）
- **Agent**：[dsh-id](https://github.com/jiangxingfan1-coder/dsh-id) 内置 `hub_search` / `hub_show` 工具（安装须人批）
- **程序**：`GET https://jiangxingfan1-coder.github.io/dsh-hub-index/entries.json`

## 🗺 Roadmap

- [x] Pages 静态站（搜索/过滤/计数）
- [x] topic 爬取器 + 每周 CI（drafts 人工过目制）
- [x] compose 规范 v1 + 首个展品
- [ ] npm 全量爬取（等官方 `package.json` 识别规范落地——[RFC #2276](https://github.com/deepseek-ai/deepseek-harness/discussions/2276) Ask 1）
- [ ] Blue-Whale / dsh-plugin-hub 联邦实际对接
- [ ] 治理权移交官方的路径（索引结构已按可整体移交设计）

## License

MIT（索引数据与 schema；各条目指向的项目遵循其自身 License）
