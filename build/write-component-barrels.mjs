/**
 * Thin re-export barrels for published component package subpaths.
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import {
  root,
  BIZ_DOMAINS
} from './shared.mjs'
import {
  FOUNDATION_PACKAGES,
  INDUSTRY_PACKAGES,
  listComponentsForPackage
} from '../scripts/component-package-map.mjs'

function ensureDir(filePath) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function writePackageBarrel(pkg, outRel, importPrefix) {
  const names = listComponentsForPackage(pkg)
  const lines = [
    '/** AUTO-GENERATED — do not edit. From build/write-component-barrels.mjs */',
    ...names.map(
      (name) => `export { default as ${name} } from '${importPrefix}/${name}/index.js'`
    ),
    ''
  ]
  const out = resolve(root, outRel)
  ensureDir(out)
  writeFileSync(out, lines.join('\n'), 'utf8')
  return names.length
}

const counts = {}

for (const pkg of [...FOUNDATION_PACKAGES, 'charts', 'editor', ...INDUSTRY_PACKAGES]) {
  counts[pkg] = writePackageBarrel(
    pkg,
    `dist/es/components/${pkg}-barrel.js`,
    `./${pkg}`
  )
}

counts.lowcode = writePackageBarrel(
  'lowcode',
  'dist/es/lowcode/ui-barrel.js',
  './ui'
)

// Legacy base → core only
const coreNames = listComponentsForPackage('core')
const baseOut = resolve(root, 'dist/es/components/base-barrel.js')
ensureDir(baseOut)
writeFileSync(
  baseOut,
  [
    '/** @deprecated core-only re-export — AUTO-GENERATED */',
    ...coreNames.map(
      (name) => `export { default as ${name} } from './core/${name}/index.js'`
    ),
    ''
  ].join('\n'),
  'utf8'
)

const bizLines = [
  '/** AUTO-GENERATED — do not edit. From build/write-component-barrels.mjs */',
  ...BIZ_DOMAINS.map((domain) => `export * from './business/${domain}/index.js'`),
  ''
]
const bizOut = resolve(root, 'dist/es/components/business-barrel.js')
ensureDir(bizOut)
writeFileSync(bizOut, bizLines.join('\n'), 'utf8')

console.log(
  `[barrels] ${Object.entries(counts)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ')} biz=${BIZ_DOMAINS.length} base(legacy-core)=${coreNames.length}`
)
