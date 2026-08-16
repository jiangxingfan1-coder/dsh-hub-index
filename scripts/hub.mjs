#!/usr/bin/env node
// dsh-hub CLI（最小客户端）：search / show / install，读本地 clone 的 entries。
//   node scripts/hub.mjs search <关键词>
//   node scripts/hub.mjs show <name>
//   node scripts/hub.mjs install <name> [--yes]
// 信任纪律在客户端兑现：unreviewed 安装打印安全告知并要求 --yes；
// 永不显示下载量/星数（可操纵信号不进决策面）。
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { parse } from 'yaml'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TRUST_BADGE = { official: '🏛 official', verified: '✅ verified', community: '👤 community', unreviewed: '⚠️  unreviewed' }

function loadAll() {
  const out = []
  for (const dir of ['plugins', 'composes']) {
    const base = join(ROOT, 'entries', dir)
    for (const f of readdirSync(base).filter((x) => /\.ya?ml$/.test(x)))
      out.push({ ...parse(readFileSync(join(base, f), 'utf8')), _kind: dir === 'composes' ? 'compose' : undefined, _file: `entries/${dir}/${f}` })
  }
  return out
}

const [cmd, arg, ...rest] = process.argv.slice(2)
const entries = loadAll()

if (cmd === 'search') {
  const q = (arg ?? '').toLowerCase()
  const hits = entries.filter((e) => !q || `${e.name} ${e.description}`.toLowerCase().includes(q))
  if (!hits.length) { console.log('no matches'); process.exit(0) }
  for (const e of hits)
    console.log(`${(e._kind ?? e.kind).padEnd(8)} ${e.name.padEnd(28)} ${TRUST_BADGE[e.trust] ?? e.trust}\n         ${String(e.description).trim().split('\n')[0].slice(0, 100)}`)
} else if (cmd === 'show') {
  const e = entries.find((x) => x.name === arg)
  if (!e) { console.error(`not found: ${arg}`); process.exit(1) }
  console.log(JSON.stringify(e, null, 2))
} else if (cmd === 'install') {
  const e = entries.find((x) => x.name === arg && x.kind === 'plugin')
  if (!e) { console.error(`not found or not a plugin: ${arg}（compose 安装走 dsh-identity 数据面）`); process.exit(1) }
  if (e.trust === 'unreviewed' && !rest.includes('--yes')) {
    console.error(`⚠️  ${e.name} 是 unreviewed 条目。装一个 dsh 插件 = npm postinstall + Host realm 零审批 = 交出整台机器。`)
    console.error(`   源码：${e.source?.repo ?? e.source?.npm ?? '未知'} —— 读完源码再来。确认安装加 --yes`)
    process.exit(2)
  }
  const specifier = e.install
  console.log(`→ dsh plugin --profile web add ${specifier}`)
  const r = spawnSync('dsh', ['plugin', '--profile', 'web', 'add', specifier], { stdio: 'inherit' })
  process.exit(r.status ?? 1)
} else {
  console.log('usage: hub.mjs search <kw> | show <name> | install <name> [--yes]')
}
