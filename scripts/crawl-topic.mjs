// GitHub topic:dsh-plugin 爬取器 —— 可持续的内容管道。
//   node scripts/crawl-topic.mjs [数量=30]
// 产出到 drafts/（草稿区）：已在 entries/ 收录的跳过；人工过目后移入
// entries/plugins/ —— 自动爬取永不直接入库（策展纪律：编造零容忍、
// 联邦数据 unreviewed 起步、下载量星数不进信任面）。
// 依赖 gh CLI 已登录。
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const N = Number(process.argv[2] ?? 30)

const known = new Set()
for (const dir of ['plugins', 'composes'])
  for (const f of readdirSync(join(ROOT, 'entries', dir)))
    if (/\.ya?ml$/.test(f)) {
      const d = parse(readFileSync(join(ROOT, 'entries', dir, f), 'utf8'))
      known.add(d.name.toLowerCase())
      if (d.source?.repo) known.add(d.source.repo.toLowerCase().replace(/\/$/, ''))
    }

const q = JSON.stringify({ query: `{ search(query:"topic:dsh-plugin sort:stars", type:REPOSITORY, first:${N}) { nodes { ... on Repository { nameWithOwner name description stargazerCount url owner { login } repositoryTopics(first:10){nodes{topic{name}}} } } } }` })
const out = JSON.parse(execFileSync('gh', ['api', 'graphql', '--input', '-'], { input: q, encoding: 'utf8' }))
const repos = out.data.search.nodes

mkdirSync(join(ROOT, 'drafts'), { recursive: true })
let drafted = 0, skipped = 0
for (const r of repos) {
  if (known.has(r.name.toLowerCase()) || known.has(r.url.toLowerCase())) { skipped++; continue }
  // 宿主仓库自身与非插件大部头（描述里明显是独立产品）也先进草稿，由人工判断 kind
  const draft = {
    kind: 'plugin',
    name: r.name.toLowerCase(),
    description: (r.description ?? '').slice(0, 290) || 'TODO: 补描述',
    install: `github:${r.nameWithOwner}`,
    source: { repo: r.url, npm: null, discussion: null },
    publisher: { github: r.owner.login },
    trust: 'unreviewed',
    provenance: { addedBy: 'jiangxingfan1-coder', addedAt: new Date().toISOString().slice(0, 10), federatedFrom: 'github-topic-crawl', scanned: false },
    notes: `爬取自 topic:dsh-plugin（★${r.stargazerCount}，星数仅记录不进信任面）；人工核对 kind/install/描述后移入 entries/`,
  }
  writeFileSync(join(ROOT, 'drafts', `${draft.name}.yml`), stringify(draft))
  drafted++
}
console.log(`crawled top ${repos.length}: ${drafted} drafts, ${skipped} already indexed → drafts/`)
