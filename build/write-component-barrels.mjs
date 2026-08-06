/**
 * Thin re-export barrels for legacy `amg-webui/components/base|business` subpaths.
 * Points at on-demand ESM so consumers do not need monorepo source.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import {
  root,
  listBaseComponentNames,
  BIZ_DOMAINS
} from './shared.mjs'

function ensureDir(filePath) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

const baseNames = listBaseComponentNames()
const baseLines = [
  '/** AUTO-GENERATED — do not edit. From build/write-component-barrels.mjs */',
  ...baseNames.map(
    (name) => `export { default as ${name} } from './base/${name}/index.js'`
  ),
  ''
]
const baseOut = resolve(root, 'dist/es/components/base-barrel.js')
ensureDir(baseOut)
writeFileSync(baseOut, baseLines.join('\n'), 'utf8')

const bizLines = [
  '/** AUTO-GENERATED — do not edit. From build/write-component-barrels.mjs */',
  ...BIZ_DOMAINS.map(
    (domain) =>
      `export * from './business/${domain}/index.js'`
  ),
  ''
]
const bizOut = resolve(root, 'dist/es/components/business-barrel.js')
ensureDir(bizOut)
writeFileSync(bizOut, bizLines.join('\n'), 'utf8')

console.log(
  `[barrels] base=${baseNames.length} biz=${BIZ_DOMAINS.length} → dist/es/components/*-barrel.js`
)
