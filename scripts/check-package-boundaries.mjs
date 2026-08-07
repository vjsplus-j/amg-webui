/**
 * Package dependency DAG + industry boundary gate.
 *
 * Rules (component packages under packages/components):
 *   core      → must not import form / data / overlay / industry
 *   form      → core only (among component pkgs)
 *   data      → core only
 *   overlay   → core only
 *   charts    → core only
 *   editor    → core + form
 *   business  → foundation (core|form|data|overlay) only — not charts/editor/industry
 *   industry  → foundation only
 *
 * Popconfirm stays in core (Button confirm prop) — intentional cycle avoidance; documented.
 *
 * Usage: node scripts/check-package-boundaries.mjs
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  FOUNDATION_BOUNDARY_PACKAGES,
  INDUSTRY_PACKAGES,
  componentDirRel,
  listComponentsForPackage,
  componentToPackage
} from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const COMPONENT_PKGS = [
  'core',
  'form',
  'data',
  'overlay',
  'charts',
  'editor',
  'business',
  'media',
  'gb28181',
  'onvif',
  'lowcode'
]

/** Allowed component-package imports (target pkg names). */
const ALLOWED_COMPONENT_DEPS = {
  core: new Set(),
  form: new Set(['core']),
  data: new Set(['core']),
  overlay: new Set(['core']),
  charts: new Set(['core']),
  editor: new Set(['core', 'form']),
  business: new Set(['core', 'form', 'data', 'overlay']),
  media: new Set(['core', 'form', 'data', 'overlay']),
  gb28181: new Set(['core', 'form', 'data', 'overlay']),
  onvif: new Set(['core', 'form', 'data', 'overlay']),
  lowcode: new Set(['core', 'form', 'data', 'overlay'])
}

const FORBIDDEN_INDUSTRY = [
  ...INDUSTRY_PACKAGES.map((p) => `@amg-webui/${p}`),
  ...INDUSTRY_PACKAGES.map((p) => `amg-webui/${p}`),
  '@amg-webui/components/gb28181',
  '@amg-webui/components/onvif',
  '@amg-webui/components/media'
]

const INDUSTRY_NAME_RE = /\b(Gbs[A-Z]\w*|Onvif[A-Z]\w*|PTZControl|SplitVideoWall|Vcr[A-Z]\w*)\b/

const IMPORT_RE =
  /(?:from|import)\s*['"](@amg-webui\/(?:components\/)?([a-z0-9-]+)|amg-webui\/(?:components\/)?([a-z0-9-]+))['"]/g

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

function resolveAliasPkg(spec) {
  // @amg-webui/core | amg-webui/form | @amg-webui/components/base → core
  const m = spec.match(/^(?:@amg-webui|amg-webui)\/(?:components\/)?([a-z0-9-]+)/)
  if (!m) return null
  let pkg = m[1]
  if (pkg === 'base') pkg = 'core'
  if (pkg === 'business' || pkg === 'biz') return 'business'
  return COMPONENT_PKGS.includes(pkg) ? pkg : null
}

function relativeReachPkg(src) {
  const industry = src.match(/components\/(gb28181|onvif|media)\b/)
  if (industry) return industry[1]
  const relHit = src.match(
    /\.\.\/(core|form|data|overlay|charts|editor|business|media|gb28181|onvif|lowcode)\b/
  )
  if (relHit) return relHit[1]
  return null
}

const violations = []

// 1) Industry blacklist for foundation (legacy gate)
for (const pkg of FOUNDATION_BOUNDARY_PACKAGES) {
  for (const name of listComponentsForPackage(pkg)) {
    const dir = resolve(root, componentDirRel(name))
    for (const file of walkFiles(dir)) {
      const src = readFileSync(file, 'utf8')
      const rel = relative(root, file).replace(/\\/g, '/')
      for (const bad of FORBIDDEN_INDUSTRY) {
        if (src.includes(bad)) {
          violations.push(`${rel}: imports ${bad}`)
        }
      }
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

const coreIndex = resolve(root, 'packages/components/core/index.ts')
if (existsSync(coreIndex)) {
  const text = readFileSync(coreIndex, 'utf8')
  const hits = text.match(INDUSTRY_NAME_RE)
  if (hits) {
    violations.push(
      `packages/components/core/index.ts: exports industry symbols ${[...new Set(hits)].join(', ')}`
    )
  }
}

// 2) Full dependency DAG across component packages
for (const [pascal, pkg] of componentToPackage.entries()) {
  const allowed = ALLOWED_COMPONENT_DEPS[pkg]
  if (!allowed) continue
  const dir = resolve(root, componentDirRel(pascal))
  for (const file of walkFiles(dir)) {
    const src = readFileSync(file, 'utf8')
    const rel = relative(root, file).replace(/\\/g, '/')

    IMPORT_RE.lastIndex = 0
    let m
    while ((m = IMPORT_RE.exec(src))) {
      const target = resolveAliasPkg(m[1])
      if (!target || target === pkg) continue
      if (!allowed.has(target)) {
        violations.push(`${rel}: ${pkg} must not import ${target} (DAG)`)
      }
    }

    // Relative cross-package reaches
    for (const line of src.split('\n')) {
      if (!line.includes('import') && !line.includes('from')) continue
      const reached = relativeReachPkg(line)
      if (!reached || reached === pkg) continue
      if (!COMPONENT_PKGS.includes(reached)) continue
      if (!allowed.has(reached)) {
        violations.push(`${rel}: ${pkg} relative reach into ${reached} (DAG)`)
      }
    }
  }
}

// Document intentional exception
const popconfirmNote =
  'Note: Popconfirm remains in core (Button confirm) to avoid core↔overlay cycles.'

if (violations.length) {
  console.error('[check-package-boundaries] FAILED')
  for (const v of [...new Set(violations)]) console.error(`  - ${v}`)
  console.error(`  (${popconfirmNote})`)
  process.exit(1)
}

console.log('[check-package-boundaries] OK — industry blacklist + component DAG')
console.log(`  ${popconfirmNote}`)
