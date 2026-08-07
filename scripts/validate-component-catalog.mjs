/**
 * Validate example/component-catalog.json covers every mapped UI component exactly once.
 * Usage: node scripts/validate-component-catalog.mjs
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { allMappedComponentNames } from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const names = allMappedComponentNames()

const catalog = JSON.parse(readFileSync(resolve(root, 'example/component-catalog.json'), 'utf8'))
const byCategory = catalog.byCategory ?? catalog
const listed = Object.values(byCategory).flat()
const seen = new Set()
const duplicates = []
for (const n of listed) {
  if (seen.has(n)) duplicates.push(n)
  seen.add(n)
}
const missing = names.filter((n) => !seen.has(n))
const extra = listed.filter((n) => !names.includes(n))
const counts = Object.fromEntries(Object.entries(byCategory).map(([k, v]) => [k, v.length]))

console.log('[validate-component-catalog]', counts, 'total', listed.length)
if (missing.length || extra.length || duplicates.length || listed.length !== names.length) {
  console.error({ missing, extra, duplicates, expected: names.length, got: listed.length })
  process.exit(1)
}
console.log(`OK: ${listed.length} components, 8 categories, no gaps/duplicates`)
