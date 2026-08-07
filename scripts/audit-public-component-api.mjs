/**
 * Audit public component API publication chain.
 * Report → component-hardening/reports/component-api-publication-report.json
 *
 * Usage:
 *   node scripts/audit-public-component-api.mjs
 *   node scripts/audit-public-component-api.mjs --p0-only
 *   node scripts/audit-public-component-api.mjs Button
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toKebab } from '../build/shared.mjs'
import {
  FOUNDATION_PACKAGES,
  componentToPackage,
  allMappedComponentNames
} from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const hardening = join(root, 'component-hardening')
const apiDir = join(root, 'generated/component-api')
const reportPath = join(hardening, 'reports/component-api-publication-report.json')

const p0Only = process.argv.includes('--p0-only')

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function readPackageBarrel(pkg) {
  const indexPath =
    pkg === 'lowcode'
      ? join(root, 'packages/lowcode/ui/index.ts')
      : join(root, 'packages/components', pkg, 'index.ts')
  if (!existsSync(indexPath)) return ''
  return readFileSync(indexPath, 'utf8')
}

function readTypesExports(name) {
  const rel = componentToPackage.get(name)
  const typesPath = join(
    root,
    rel === 'lowcode'
      ? `packages/lowcode/ui/${name}/types.ts`
      : `packages/components/${rel}/${name}/types.ts`
  )
  if (!existsSync(typesPath)) return []
  const src = readFileSync(typesPath, 'utf8')
  return [
    ...src.matchAll(/export\s+type\s+(\w+)/g),
    ...src.matchAll(/export\s+interface\s+(\w+)/g)
  ].map((m) => m[1])
}

function checkBarrel(pkg, name) {
  const barrel = readPackageBarrel(pkg)
  if (!barrel) return 'FAIL'
  const patterns = [
    new RegExp(`export\\s*\\{\\s*default\\s+as\\s+${name}\\s*\\}`),
    new RegExp(`export\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s+from\\s+['"]\\./${name}['"]`)
  ]
  return patterns.some((re) => re.test(barrel)) ? 'PASS' : 'FAIL'
}

function checkPackageExport(name) {
  const kebab = toKebab(name)
  const exportsMap = loadJson(join(root, 'package.json')).exports || {}
  return exportsMap[`./${kebab}`] ? 'PASS' : 'MISSING'
}

function componentSourcePath(name) {
  const pkg = componentToPackage.get(name)
  if (!pkg) return null
  if (pkg === 'lowcode') return join(root, `packages/lowcode/ui/${name}/index.vue`)
  return join(root, `packages/components/${pkg}/${name}/index.vue`)
}

function sourceSurfaceHints(name) {
  const vuePath = componentSourcePath(name)
  if (!vuePath || !existsSync(vuePath)) {
    return { hasSlots: false, hasExpose: false }
  }
  const src = readFileSync(vuePath, 'utf8')
  return {
    hasSlots: /<slot[\s>]|defineSlots\s*[<(]/.test(src),
    hasExpose: /defineExpose\s*\(/.test(src)
  }
}

function checkExtractSurface(name, contract, api) {
  if (!api) return { props: 'MISSING', events: 'MISSING', slots: 'MISSING', expose: 'MISSING', types: 'MISSING' }

  const req = contract?.api || {}
  const hints = sourceSurfaceHints(name)
  const result = {}

  result.props =
    req.props === 'not-applicable'
      ? 'N/A'
      : api.props?.length > 0
        ? 'PASS'
        : 'MISSING'
  result.events =
    req.emits === 'not-applicable'
      ? 'N/A'
      : api.events?.length > 0 || api.completeness?.emits
        ? 'PASS'
        : req.emits
          ? 'MISSING'
          : 'N/A'
  result.slots =
    req.slots === 'not-applicable'
      ? 'N/A'
      : api.slots?.length > 0 || api.completeness?.slots
        ? 'PASS'
        : hints.hasSlots || req.slots
          ? 'MISSING'
          : 'N/A'
  result.expose =
    req.expose === 'not-applicable'
      ? 'N/A'
      : api.expose?.length > 0 || api.completeness?.expose
        ? 'PASS'
        : hints.hasExpose || req.expose
          ? 'MISSING'
          : 'N/A'

  const typesInSource = readTypesExports(name)
  const typesInExtract = api.publicTypes || []
  if (typesInSource.length === 0) {
    result.types = 'N/A'
  } else {
    const missing = typesInSource.filter((t) => !typesInExtract.includes(t))
    result.types = missing.length === 0 ? 'PASS' : 'MISSING'
    if (missing.length) result.missingTypes = missing
  }

  return result
}

function auditOne(name) {
  const pkg = componentToPackage.get(name)
  const isP0 = FOUNDATION_PACKAGES.includes(pkg)

  let contract = null
  const contractPath = join(hardening, 'contracts', `${name}.json`)
  if (existsSync(contractPath)) contract = loadJson(contractPath)

  let api = null
  const apiPath = join(apiDir, `${name}.json`)
  if (existsSync(apiPath)) api = loadJson(apiPath)

  const barrelRaw = checkBarrel(pkg, name)
  const barrel =
    barrelRaw === 'FAIL' && !isP0 ? 'MISSING' : barrelRaw

  const packageExport = checkPackageExport(name)
  const extract = checkExtractSurface(name, contract, api)

  return {
    name,
    package: pkg,
    isP0,
    checks: {
      barrel,
      packageExport,
      ...extract
    },
    blockers: barrel === 'FAIL' && isP0 ? ['barrel'] : []
  }
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const inventory = loadJson(join(hardening, 'inventory/component-inventory.json'))
  let names = args.length
    ? args
    : inventory.components.filter((c) => c.public).map((c) => c.name)

  if (p0Only) {
    names = names.filter((n) => FOUNDATION_PACKAGES.includes(componentToPackage.get(n)))
  }

  names = [...new Set(names)].sort()

  const components = names.map(auditOne)
  const p0BarrelFails = components.filter((c) => c.isP0 && c.checks.barrel === 'FAIL')
  const summary = {
    total: components.length,
    p0: components.filter((c) => c.isP0).length,
    barrelFail: components.filter((c) => c.checks.barrel === 'FAIL').length,
    barrelMissing: components.filter((c) => c.checks.barrel === 'MISSING').length,
    packageExportMissing: components.filter((c) => c.checks.packageExport === 'MISSING').length,
    extractMissing: components.filter(
      (c) =>
        c.checks.props === 'MISSING' ||
        c.checks.events === 'MISSING' ||
        c.checks.slots === 'MISSING' ||
        c.checks.expose === 'MISSING' ||
        c.checks.types === 'MISSING'
    ).length,
    p0BarrelBlockers: p0BarrelFails.map((c) => c.name)
  }

  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    components
  }

  mkdirSync(dirname(reportPath), { recursive: true })
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n')

  console.log(`[audit:public-api] wrote ${reportPath}`)
  console.log(
    `  total=${summary.total} p0=${summary.p0} p0BarrelFail=${p0BarrelFails.length}`
  )
  if (p0BarrelFails.length) {
    console.log(`  P0 barrel FAIL: ${p0BarrelFails.map((c) => c.name).join(', ')}`)
  }

  if (p0BarrelFails.length > 0) {
    process.exit(1)
  }
}

main()
