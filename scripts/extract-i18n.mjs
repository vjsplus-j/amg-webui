/**
 * Scan packages for user-facing string candidates and report / scaffold missing locale keys.
 * Usage: npm run extract:i18n
 *
 * 1) Regenerate LocaleKey / LocaleMessages from zh-CN (typed i18n schema)
 * 2) Validate all locale packs share the same key set as zh-CN
 * 3) Alias packs (e.g. ar-SA re-export) are checked via index re-export target
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const localeRoot = resolve(root, 'packages/locale')
const BASE = 'zh-CN'

const gen = spawnSync(process.execPath, [join(root, 'scripts/generate-locale-types.mjs')], {
  cwd: root,
  stdio: 'inherit'
})
if (gen.status !== 0) process.exit(gen.status ?? 1)

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
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts')
  if (files.length === 0) {
    // Alias pack: `export { default } from '../en-US'` or `import enUS from '../en-US'`
    const indexSrc = readFileSync(join(dir, 'index.ts'), 'utf8')
    const m =
      indexSrc.match(/from\s+['"]\.\.\/([\w-]+)['"]/) ||
      indexSrc.match(/from\s+['"]\.\/([\w-]+)['"]/)
    if (m) return flattenMessages(m[1])
  }
  for (const file of files) {
    const src = readFileSync(join(dir, file), 'utf8')
    for (const m of src.matchAll(/['"]([\w.-]+)['"]\s*:/g)) {
      keys.add(m[1])
    }
  }
  return keys
}

function flattenLocaleKeysLeaves() {
  const src = readFileSync(join(localeRoot, 'keys.ts'), 'utf8')
  const keys = new Set()
  for (const m of src.matchAll(/:\s*['"]([\w.-]+)['"]/g)) {
    keys.add(m[1])
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

const leafKeys = flattenLocaleKeysLeaves()
const orphanLeaves = [...leafKeys].filter((k) => !baseKeys.has(k))
if (orphanLeaves.length) {
  failed = true
  console.error(
    `\n[LocaleKeys] leaves missing from ${BASE} (${orphanLeaves.length}):`,
    orphanLeaves.slice(0, 20)
  )
} else {
  console.log(`[extract:i18n] LocaleKeys leaves ⊆ ${BASE} OK (${leafKeys.size})`)
}

if (failed) {
  console.error('\n[extract:i18n] FAIL — sync all locale packs (see packages/locale/I18N.md)')
  process.exit(1)
}

console.log('[extract:i18n] all locales aligned with zh-CN + typed schema regenerated')
