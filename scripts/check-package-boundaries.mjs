/**
 * Boundary gate: foundation packages must not import industry packages.
 * Usage: node scripts/check-package-boundaries.mjs
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FOUNDATION_BOUNDARY_PACKAGES,
  INDUSTRY_PACKAGES,
  componentDirRel,
  listComponentsForPackage
} from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const FORBIDDEN = [
  ...INDUSTRY_PACKAGES.map((p) => `@amg-webui/${p}`),
  ...INDUSTRY_PACKAGES.map((p) => `amg-webui/${p}`),
  '@amg-webui/components/gb28181',
  '@amg-webui/components/onvif',
  '@amg-webui/components/media'
]

const INDUSTRY_NAME_RE = /\b(Gbs[A-Z]\w*|Onvif[A-Z]\w*|PTZControl|SplitVideoWall|Vcr[A-Z]\w*)\b/

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist') continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walkFiles(full, out)
    else if (/\.(vue|ts|tsx|js|mjs)$/.test(name)) out.push(full)
  }
  return out
}

const violations = []

for (const pkg of FOUNDATION_BOUNDARY_PACKAGES) {
  for (const name of listComponentsForPackage(pkg)) {
    const dir = resolve(root, componentDirRel(name))
    for (const file of walkFiles(dir)) {
      const src = readFileSync(file, 'utf8')
      const rel = relative(root, file).replace(/\\/g, '/')
      for (const bad of FORBIDDEN) {
        if (src.includes(bad)) {
          violations.push(`${rel}: imports ${bad}`)
        }
      }
      // catch relative reach into industry dirs
      if (
        src.includes('../gb28181/') ||
        src.includes('../onvif/') ||
        src.includes('../media/') ||
        src.includes('components/gb28181') ||
        src.includes('components/onvif') ||
        src.includes('components/media')
      ) {
        violations.push(`${rel}: path reaches industry package`)
      }
    }
  }
}

// core barrel must not export industry names
const coreIndex = resolve(root, 'packages/components/core/index.ts')
if (existsSync(coreIndex)) {
  const text = readFileSync(coreIndex, 'utf8')
  const hits = text.match(INDUSTRY_NAME_RE)
  if (hits) {
    violations.push(`packages/components/core/index.ts: exports industry symbols ${[...new Set(hits)].join(', ')}`)
  }
}

if (violations.length) {
  console.error('[check-package-boundaries] FAILED')
  for (const v of violations) console.error('  -', v)
  process.exit(1)
}

console.log('[check-package-boundaries] OK — foundation does not import industry')
