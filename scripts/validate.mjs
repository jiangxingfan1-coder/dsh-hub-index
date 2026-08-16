// hub-index 条目校验：entries/**/*.yml 逐一对 schema 验证。
// PR 的 CI 门禁；本地：npm i && node scripts/validate.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import Ajv from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

const entrySchema = JSON.parse(readFileSync(join(ROOT, 'schema/entry.schema.json'), 'utf8'))
const composeSchema = JSON.parse(readFileSync(join(ROOT, 'schema/compose.schema.json'), 'utf8'))
ajv.addSchema(entrySchema, 'entry.schema.json')
const validators = {
  plugins: ajv.compile({ ...entrySchema, $id: undefined }),
  composes: ajv.compile({ ...composeSchema, $id: undefined }),
}

let failed = 0, passed = 0
for (const dir of ['plugins', 'composes']) {
  const base = join(ROOT, 'entries', dir)
  for (const f of readdirSync(base).filter((x) => x.endsWith('.yml') || x.endsWith('.yaml'))) {
    const doc = parse(readFileSync(join(base, f), 'utf8'))
    const ok = validators[dir](doc)
    if (ok) { passed++; console.log(`  ok  entries/${dir}/${f}`) }
    else {
      failed++
      console.error(`FAIL  entries/${dir}/${f}`)
      for (const e of validators[dir].errors) console.error(`      ${e.instancePath || '/'} ${e.message}`)
    }
    // 信任纪律：新条目不得自评 official/verified（须经核验流程晋级）
    if (doc?.trust === 'official' && !String(doc.name).startsWith('@deepseek-ai/')) {
      failed++; console.error(`FAIL  entries/${dir}/${f}: trust=official 仅限 @deepseek-ai 域`)
    }
  }
}
console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
