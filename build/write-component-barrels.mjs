/**
 * Thin re-export barrels for legacy `amg-webui/components/{base,business,industry}` subpaths.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import {
  root,
  listBaseComponentNames,
  listIndustryComponentNames,
  BIZ_DOMAINS
} from './shared.mjs'

function ensureDir(filePath) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

const baseNames = listBaseComponentNames()
const baseOut = resolve(root, 'dist/es/components/base-barrel.js')
ensureDir(baseOut)
writeFileSync(
  baseOut,
  [
    '/** AUTO-GENERATED — build/write-component-barrels.mjs */',
    ...baseNames.map(
      (name) => `export { default as ${name} } from './base/${name}/index.js'`
    ),
    ''
  ].join('\n'),
  'utf8'
)

const industryNames = listIndustryComponentNames()
const industryOut = resolve(root, 'dist/es/components/industry-barrel.js')
ensureDir(industryOut)
writeFileSync(
  industryOut,
  [
    '/** AUTO-GENERATED — build/write-component-barrels.mjs */',
    ...industryNames.map(
      (name) =>
        `export { default as ${name} } from './industry/${name}/index.js'`
    ),
    ''
  ].join('\n'),
  'utf8'
)

const bizOut = resolve(root, 'dist/es/components/business-barrel.js')
ensureDir(bizOut)
writeFileSync(
  bizOut,
  [
    '/** AUTO-GENERATED — build/write-component-barrels.mjs */',
    ...BIZ_DOMAINS.map((domain) => `export * from './business/${domain}/index.js'`),
    ''
  ].join('\n'),
  'utf8'
)

console.log(
  `[barrels] base=${baseNames.length} industry=${industryNames.length} biz=${BIZ_DOMAINS.length} → dist/es/components/*-barrel.js`
)
