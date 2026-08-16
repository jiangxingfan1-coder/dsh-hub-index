// 生成 Pages 静态站数据：entries/**/*.yml → docs/entries.json
// 改动条目后：npm run build（CI 校验 + 本步生成都过了再提 PR）
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const all = []
for (const dir of ['plugins', 'composes']) {
  const base = join(ROOT, 'entries', dir)
  for (const f of readdirSync(base).filter((x) => /\.ya?ml$/.test(x))) {
    const doc = parse(readFileSync(join(base, f), 'utf8'))
    all.push({ ...doc, kind: dir === 'composes' ? 'compose' : doc.kind, _file: `entries/${dir}/${f}` })
  }
}
all.sort((a, b) => a.name.localeCompare(b.name))
mkdirSync(join(ROOT, 'docs'), { recursive: true })
writeFileSync(join(ROOT, 'docs', 'entries.json'), JSON.stringify({ generated: new Date().toISOString(), entries: all }, null, 1))
console.log(`docs/entries.json: ${all.length} entries`)
