/**
 * Generate packages/locale/message-schema.ts from zh-CN message keys.
 * Source of truth for typed i18n (LocaleKey / LocaleMessages).
 *
 * Usage: node scripts/generate-locale-types.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const localeRoot = resolve(root, 'packages/locale')
const BASE = 'zh-CN'
const outFile = join(localeRoot, 'message-schema.ts')

function flattenMessages(locale) {
  const dir = join(localeRoot, locale)
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    throw new Error(`Missing locale directory: ${locale}`)
  }
  const keys = new Set()
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.ts') || file === 'index.ts') continue
    const src = readFileSync(join(dir, file), 'utf8')
    for (const m of src.matchAll(/['"]([\w.-]+)['"]\s*:/g)) {
      keys.add(m[1])
    }
  }
  return keys
}

const keys = [...flattenMessages(BASE)].sort()
if (keys.length === 0) {
  console.error(`[generate-locale-types] no keys found in ${BASE}`)
  process.exit(1)
}

const body = [
  '/**',
  ` * Auto-generated from ${BASE} — do not edit by hand.`,
  ' * Run: node scripts/generate-locale-types.mjs',
  ' * (also invoked by npm run extract:i18n)',
  ' */',
  '',
  'export type LocaleKey =',
  ...keys.map((k) => `  | ${JSON.stringify(k)}`),
  '',
  '/** Every built-in / registered pack must provide all LocaleKey entries. */',
  'export type LocaleMessages = Record<LocaleKey, string>',
  ''
].join('\n')

writeFileSync(outFile, body, 'utf8')
console.log(`[generate-locale-types] wrote ${keys.length} keys → packages/locale/message-schema.ts`)
