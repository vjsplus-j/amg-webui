/**
 * Scan packages for user-facing string candidates and report / scaffold missing locale keys.
 * Usage: npm run extract:i18n
 *
 * Phase-1: validate all locale packs share the same key set as zh-CN.
 * Later: AST extract from Vue/TS into LocaleKeys templates.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const localeRoot = resolve(root, 'packages/locale')
const BASE = 'zh-CN'

function listLocales() {
  return readdirSync(localeRoot)
    .filter((name) => {
      const p = join(localeRoot, name)
      return statSync(p).isDirectory() && /^\w{2}(-\w{2})?$/.test(name)
    })
    .sort()
}

function flattenMessages(locale) {
  const dir = join(localeRoot, locale)
  const keys = new Set()
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.ts') || file === 'index.ts') continue
    const src = readFileSync(join(dir, file), 'utf8')
    for (const m of src.matchAll(/['"]([\w.]+)['"]\s*:/g)) {
      keys.add(m[1])
    }
  }
  return keys
}

const locales = listLocales()
if (!locales.includes(BASE)) {
  console.error(`Missing baseline locale ${BASE}`)
  process.exit(1)
}

const baseKeys = flattenMessages(BASE)
let failed = false

console.log(`[extract:i18n] baseline ${BASE}: ${baseKeys.size} keys`)
console.log(`[extract:i18n] locales: ${locales.join(', ')}`)

for (const loc of locales) {
  if (loc === BASE) continue
  const keys = flattenMessages(loc)
  const missing = [...baseKeys].filter((k) => !keys.has(k))
  const extra = [...keys].filter((k) => !baseKeys.has(k))
  if (missing.length || extra.length) {
    failed = true
    console.error(`\n[${loc}] missing (${missing.length}):`, missing.slice(0, 20))
    if (extra.length) console.error(`[${loc}] extra (${extra.length}):`, extra.slice(0, 20))
  } else {
    console.log(`[extract:i18n] ${loc} OK`)
  }
}

if (failed) {
  console.error('\n[extract:i18n] FAIL — sync all locale packs (see packages/locale/I18N.md)')
  process.exit(1)
}

console.log('[extract:i18n] all locales aligned with zh-CN')
