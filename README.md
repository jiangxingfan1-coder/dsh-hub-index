# dsh-hub-index —— DeepSeek Harness 生态的发现与信任索引

一个 git 仓库承载的插件/技能/组合注册中心：**不存代码、不重造分发**（分发底座是 npm 与 GitHub，`dsh plugin add` 两者皆通），只做三件事——发现（联邦索引）、信任（分层徽章）、组合注册（compose 规范）。

在线索引：https://jiangxingfan1-coder.github.io/dsh-hub-index/

## 为什么是「第三层」而不是「第三个货架」

社区已有 Blue-Whale-Harness（1824 款收录目录）与 dsh-plugin-hub（商店插件）两个货架。本索引与它们**联邦而非竞争**：聚合其数据（一律 `unreviewed` 起步，不继承对方的信任判断），补上所有人都缺的身份绑定与信任分层。

## 三种条目

| 目录 | 单元 | Schema |
|---|---|---|
| `entries/plugins/` | 插件 / 技能（npm、GitHub 引用） | `schema/entry.schema.json` |
| `entries/composes/` | **compose：patch + preset + 简报 + 插件清单的能力组合** | `schema/compose.schema.json` |

compose 是 dsh 独有的一等分享单元——时空组合性哲学的生态表达：真正的能力不是单个插件，而是一棵调好的组合树 overlay。第一个展品：[super-fast](entries/composes/super-fast.yml)（19 轮受控实验产物）。

## 信任分层（ClawHavoc 教训内置）

`official`（@deepseek-ai 域）→ `verified`（发布者实名 + 仓库-npm 对应 + 构建溯源核验）→ `community`（有实名无审计）→ `unreviewed`（默认档）。

铁律：

1. **下载量、星数、排名永不参与信任评级**——ClawHub 排名操纵漏洞已证明这些信号可刷（PoC 6 天刷到分类第一）。
2. **信任绑发布者、全目录联动**——一包实锤恶意，同发布者全部条目降级隔离（registry saturation 攻防）。
3. **扫描通过 ≠ 安全**——`provenance.scanned` 只是过程记录；ClawHub 接入 VirusTotal 后仍有逃逸，Snyk 审计 36.8% 已发布 skills 含缺陷。
4. **compose 审计重心是 patch**——`!!js` 表达式即任意代码；简报文本按 prompt injection 面对待。
5. 提醒使用者：装一个 dsh 插件 = npm postinstall + Host realm 零审批 = **交出整台机器**。unreviewed 条目请读源码后再装。

## 联邦对象（现有目录，数据可对接）

- [Blue-Whale-Harness](https://github.com/leenkcool/Blue-Whale-Harness)（#1728，1824 款收录）
- [dsh-plugin-hub](https://github.com/deepseek-ai/deepseek-harness/discussions/2256)（商店插件，GitHub+npm 同步）
- [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)（★3.4k 精选列表）
- GitHub `topic:dsh-plugin`（4400+ 仓库）——`scripts/crawl-topic.mjs` 定期爬入 `drafts/`，人工过目后入库

## 提交条目

1. Fork → `entries/<plugins|composes>/<name>.yml`（照 schema，字段不明就填 `null` + `notes` 标 todo，**不编造**）
2. PR —— CI 自动校验 schema 与信任纪律（新条目不得自评 official/verified）
3. 维护者核验来源后合并；晋级 `verified` 需仓库-npm 对应与发布者实名核验

## Roadmap

- [ ] GitHub Pages 静态站（索引浏览）
- [ ] npm 定期爬取（阻塞于官方 package.json `dsh` 字段规范——已列入上游 RFC ask #1）
- [ ] Blue-Whale / dsh-plugin-hub 联邦对接
- [ ] dsh-hub 客户端插件（web UI 面板，接入指南见 topology discussion #1565）
- [ ] 身份层对接（dsh-id 发布身份 = GitHub OAuth）
