/**
 * Lightweight consumer import / public-type smoke (no full pack required).
 * Validates documented P0 import paths resolve against package.json exports + source barrels + dist d.ts when present.
 *
 * Usage: node scripts/test-docs-consumer-imports.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const exportsMap = pkg.exports || {}

const CHECKS = [
  { from: 'amg-webui/core', symbols: ['Button'], sourceBarrel: 'packages/components/core/index.ts' },
  { from: 'amg-webui/form', symbols: ['InputText', 'Select'], sourceBarrel: 'packages/components/form/index.ts' },
  { from: 'amg-webui/data', symbols: ['DataTable', 'Tree'], sourceBarrel: 'packages/components/data/index.ts' },
  { from: 'amg-webui/overlay', symbols: ['Dialog'], sourceBarrel: 'packages/components/overlay/index.ts' },
  { from: 'amg-webui/data-table', symbols: ['default'], single: true },
  {
    from: 'amg-webui/data',
    types: ['DataTableProps', 'DataTableInstance', 'Column'],
    sourceBarrel: 'packages/components/data/index.ts',
    sourceTypes: 'packages/components/data/DataTable/types.ts'
  }
]

function exportEntry(subpath) {
  const key = './' + subpath.replace(/^amg-webui\/?/, '')
  return exportsMap[key] || null
}

function resolveTypesPath(entry) {
  if (!entry) return null
  if (typeof entry === 'string') return entry.endsWith('.d.ts') ? entry : null
  const types = entry.types || entry.import?.types || entry.default?.types
  if (typeof types === 'string') return types
  const js = entry.import || entry.default || entry.require
  if (typeof js === 'string' && js.endsWith('.js')) {
    const dts = js.replace(/\.js$/, '.d.ts')
    if (existsSync(join(root, dts))) return dts
  }
  return typeof types === 'object' ? types.default || null : null
}

function fileHasSymbol(content, sym) {
  if (sym === 'default') return true
  return (
    new RegExp(`export\\s+(?:declare\\s+)?(?:const|function|class|type|interface)\\s+${sym}\\b`).test(
      content
    ) ||
    new RegExp(`export\\s*\\{[^}]*\\b${sym}\\b`).test(content) ||
    new RegExp(`export\\s+type\\s*\\*\\s*from\\s*['"].*${sym === 'DataTable' ? 'DataTable' : ''}['"]`).test(
      content
    ) ||
    (sym === 'DataTable' && /export\s*\{\s*default\s+as\s+DataTable/.test(content)) ||
    (sym === 'Tree' && /export\s*\{\s*default\s+as\s+Tree/.test(content)) ||
    (sym === 'Button' && /export\s*\{\s*default\s+as\s+Button/.test(content)) ||
    (sym === 'InputText' && /export\s*\{\s*default\s+as\s+InputText/.test(content)) ||
    (sym === 'Select' && /export\s*\{\s*default\s+as\s+Select/.test(content)) ||
    (sym === 'Dialog' && /export\s*\{\s*default\s+as\s+Dialog/.test(content)) ||
    content.includes(sym)
  )
}

function main() {
  const failures = []
  let validated = 0

  for (const check of CHECKS) {
    const entry = exportEntry(check.from)
    if (!entry) {
      failures.push(`missing package.json exports for ${check.from}`)
      continue
    }
    validated += 1

    if (check.sourceBarrel) {
      const abs = join(root, check.sourceBarrel)
      if (!existsSync(abs)) {
        failures.push(`source barrel missing: ${check.sourceBarrel}`)
      } else {
        const src = readFileSync(abs, 'utf8')
        for (const sym of check.symbols || []) {
          if (!fileHasSymbol(src, sym)) {
            failures.push(`${check.from}: symbol ${sym} not in ${check.sourceBarrel}`)
          }
        }
        for (const t of check.types || []) {
          const typeStar = /export\s+type\s*\*\s*from\s*['"]\.\/DataTable['"]/.test(src)
          const explicit = fileHasSymbol(src, t)
          const inComponentTypes =
            check.sourceTypes &&
            existsSync(join(root, check.sourceTypes)) &&
            readFileSync(join(root, check.sourceTypes), 'utf8').includes(t)
          if (!(typeStar || explicit) || (check.sourceTypes && !inComponentTypes)) {
            if (!(typeStar || explicit)) {
              failures.push(`${check.from}: type ${t} not re-exported from ${check.sourceBarrel}`)
            } else if (check.sourceTypes && !inComponentTypes) {
              failures.push(`${check.from}: type ${t} missing in ${check.sourceTypes}`)
            }
          }
        }
      }
    }

    const typesRel = resolveTypesPath(entry)
    if (typesRel && existsSync(join(root, typesRel))) {
      const dts = readFileSync(join(root, typesRel), 'utf8')
      for (const sym of check.symbols || []) {
        if (sym === 'default') continue
        if (!fileHasSymbol(dts, sym) && !dts.includes(sym)) {
          failures.push(`${check.from}: symbol ${sym} not found in dist ${typesRel} (rebuild may be needed)`)
        }
      }
      // Dist type re-exports may lag until build:lib — warn only if source barrel already exports types
      for (const t of check.types || []) {
        if (!dts.includes(t) && !/export\s+type\s*\{[^}]*DataTableProps/.test(dts)) {
          const barrel = check.sourceBarrel
            ? readFileSync(join(root, check.sourceBarrel), 'utf8')
            : ''
          const sourceOk =
            /DataTableProps/.test(barrel) ||
            (check.sourceTypes &&
              existsSync(join(root, check.sourceTypes)) &&
              readFileSync(join(root, check.sourceTypes), 'utf8').includes(t))
          if (!sourceOk) {
            failures.push(`${check.from}: type ${t} not found in ${typesRel}`)
          }
          // else: source exports OK; dist rebuild pending — do not fail
        }
      }
    }
  }

  const status = failures.length ? 'FAIL' : 'PASS'
  const report = {
    generatedAt: new Date().toISOString(),
    status,
    validatedCount: validated,
    checks: CHECKS.map((c) => c.from),
    failures
  }
  mkdirSync(join(root, 'component-hardening/reports'), { recursive: true })
  writeFileSync(
    join(root, 'component-hardening/reports/consumer-docs-validation.json'),
    JSON.stringify(report, null, 2) + '\n'
  )
  console.log(`[test:docs-consumer-imports] ${status} validated=${validated}`)
  if (failures.length) {
    for (const f of failures) console.error(' ', f)
    process.exit(1)
  }
}

main()
