/**
 * Ensure v0.1 subset ↔ catalog ↔ maturity stay aligned, and that
 * Gallery "承诺" (v0.1 badge) is subset-only by contract.
 *
 * Usage: node scripts/validate-v01-subset.mjs
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function loadJson(rel) {
  const p = resolve(root, rel)
  if (!existsSync(p)) {
    console.error(`[validate:v01] missing ${rel}`)
    process.exit(1)
  }
  return JSON.parse(readFileSync(p, 'utf8'))
}

/** Parse string literals from V01_BATCH_* arrays in v0.1-subset.ts */
function parseSubsetNames() {
  const src = readFileSync(resolve(root, 'example/v0.1-subset.ts'), 'utf8')
  const names = new Set()
  const re = /export const V01_BATCH_\w+\s*=\s*\[([\s\S]*?)\]\s*as const/g
  let m
  while ((m = re.exec(src))) {
    for (const hit of m[1].matchAll(/'([A-Za-z][A-Za-z0-9]*)'/g)) {
      names.add(hit[1])
    }
  }
  if (!names.size) {
    console.error('[validate:v01] failed to parse V01_BATCH_* from v0.1-subset.ts')
    process.exit(1)
  }
  return [...names].sort()
}

const subset = parseSubsetNames()
const catalog = loadJson('example/component-catalog.json')
const maturity = loadJson('example/component-maturity.json')

// component-catalog.json: { byCategory: { general: [...], industry: [...] } }
const flatCatalog = (() => {
  if (catalog.byCategory && typeof catalog.byCategory === 'object') {
    return new Set(Object.values(catalog.byCategory).flat())
  }
  const out = new Set()
  for (const [k, v] of Object.entries(catalog)) {
    if (k === 'categories') continue
    if (Array.isArray(v)) for (const n of v) out.add(n)
  }
  return out
})()

const maturityNames = new Set(Object.keys(maturity.components || {}))
const missingCatalog = subset.filter((n) => !flatCatalog.has(n))
const missingMaturity = subset.filter((n) => !maturityNames.has(n))
const missingDir = subset.filter((n) => {
  const base = join(root, 'packages/components/base', n)
  const industry = join(root, 'packages/components/industry', n)
  return !existsSync(base) && !existsSync(industry)
})

const errors = []
if (missingCatalog.length) {
  errors.push(`subset missing from catalog: ${missingCatalog.join(', ')}`)
}
if (missingMaturity.length) {
  errors.push(`subset missing from maturity: ${missingMaturity.join(', ')}`)
}
if (missingDir.length) {
  errors.push(`subset missing component dirs: ${missingDir.join(', ')}`)
}

// Contract: Gallery / DocPage only show v0.1 badge via isV01Component
const gallerySrc = readFileSync(
  resolve(root, 'example/components/ComponentGallery.vue'),
  'utf8'
)
const docSrc = readFileSync(
  resolve(root, 'example/pages/base/ComponentDocPage.vue'),
  'utf8'
)
if (!gallerySrc.includes('isV01Component(name)')) {
  errors.push('ComponentGallery must gate v0.1 badge with isV01Component(name)')
}
if (!docSrc.includes('isV01Component(componentName)')) {
  errors.push('ComponentDocPage must gate v0.1 badge with isV01Component')
}

if (errors.length) {
  console.error('[validate:v01] FAILED:')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(
  `[validate:v01] OK: subset=${subset.length} catalog∩maturity aligned; Gallery badge subset-only`
)
