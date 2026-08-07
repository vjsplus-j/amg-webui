/**
 * Build public documentation coverage report (DOCS-PUBLIC-API).
 *
 * Usage: node scripts/build-public-doc-coverage.mjs
 */
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toKebab } from '../build/shared.mjs'
import { FOUNDATION_PACKAGES } from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const hardening = join(root, 'component-hardening')

const PHASE_PACKAGES = {
  P0: ['core', 'form', 'data', 'overlay'],
  P1: ['charts', 'editor'],
  P2: ['business'],
  P3: ['media', 'gb28181', 'onvif'],
  P4: ['lowcode', 'experimental']
}

function loadJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'))
}

function phaseForPackage(pkg) {
  for (const [phase, pkgs] of Object.entries(PHASE_PACKAGES)) {
    if (pkgs.includes(pkg)) return phase
  }
  return 'P4'
}

function exportOk(row) {
  if (!row?.checks) return false
  const { barrel, packageExport } = row.checks
  return barrel === 'PASS' && packageExport !== 'FAIL'
}

function main() {
  const inventory = loadJson(join(hardening, 'inventory/component-inventory.json'))
  const publicComps = inventory.components.filter((c) => c.public)
  const pubReportPath = join(hardening, 'reports/component-api-publication-report.json')
  const pubReport = existsSync(pubReportPath) ? loadJson(pubReportPath) : { components: [] }
  const byName = Object.fromEntries(
    (pubReport.components || []).map((r) => [r.component || r.name, r])
  )

  const consumerPath = join(hardening, 'reports/consumer-docs-validation.json')
  const consumerReport = existsSync(consumerPath) ? loadJson(consumerPath) : null

  let metadataComplete = 0
  let apiExtractComplete = 0
  let docsPresent = 0
  let examplePresent = 0
  let publicExportValidated = 0

  const demosDir = join(root, 'example/demos')
  const demoNames = existsSync(demosDir)
    ? new Set(readdirSync(demosDir).filter((d) => existsSync(join(demosDir, d, 'index.vue'))))
    : new Set()

  const phaseStats = Object.fromEntries(
    Object.keys(PHASE_PACKAGES).map((p) => [
      p,
      { total: 0, metadataComplete: 0, docsPresent: 0, exportOk: 0 }
    ])
  )

  for (const c of publicComps) {
    const name = c.name
    const pkg = c.package
    const phase = phaseForPackage(pkg)
    phaseStats[phase].total += 1

    const hasMeta = existsSync(join(root, 'component-metadata', `${name}.json`))
    if (hasMeta) {
      metadataComplete += 1
      const m = loadJson(join(root, 'component-metadata', `${name}.json`))
      if (m.summary && m.features?.length) phaseStats[phase].metadataComplete += 1
    }

    const api = join(root, 'generated/component-api', `${name}.json`)
    if (existsSync(api)) {
      const data = loadJson(api)
      if (!/bulk stub/i.test(data.note || '')) apiExtractComplete += 1
    }

    const hasDoc = existsSync(join(root, 'docs/components', `${toKebab(name)}.md`))
    if (hasDoc) {
      docsPresent += 1
      phaseStats[phase].docsPresent += 1
    }

    if (demoNames.has(name)) examplePresent += 1

    const row = byName[name]
    if (exportOk(row)) {
      publicExportValidated += 1
      phaseStats[phase].exportOk += 1
    }
  }

  const active = existsSync(join(hardening, 'active-batch.json'))
    ? loadJson(join(hardening, 'active-batch.json'))
    : {}
  const completed = new Set(active.completedPhases || [])

  function phaseStatus(phase, stats) {
    if (completed.has(phase)) return 'CLOSED'
    if (stats.total === 0) return 'N/A'
    if (
      stats.metadataComplete === stats.total &&
      stats.docsPresent === stats.total &&
      stats.exportOk === stats.total
    ) {
      return phase === 'P0' || completed.has('P0') ? 'READY' : 'BACKLOG'
    }
    return completed.has('P0') && phase !== 'P0' ? 'IN_PROGRESS' : 'BACKLOG'
  }

  const phases = Object.fromEntries(
    Object.entries(phaseStats).map(([phase, stats]) => [phase, phaseStatus(phase, stats)])
  )

  // Prefer explicit active-batch completed markers
  for (const p of completed) {
    if (phases[p] !== undefined) phases[p] = 'CLOSED'
  }

  const report = {
    generatedAt: new Date().toISOString(),
    total: publicComps.length,
    metadataComplete,
    apiExtractComplete,
    docsPresent,
    examplePresent,
    publicExportValidated,
    consumerValidated: consumerReport?.validatedCount ?? null,
    consumerStatus: consumerReport?.status ?? null,
    phaseStats,
    p0: {
      total: phaseStats.P0.total,
      metadataComplete: phaseStats.P0.metadataComplete,
      docsPresent: phaseStats.P0.docsPresent,
      publicExportValidated: phaseStats.P0.exportOk,
      status: phases.P0
    },
    phases
  }

  mkdirSync(join(hardening, 'reports'), { recursive: true })
  writeFileSync(
    join(hardening, 'reports/public-doc-coverage.json'),
    JSON.stringify(report, null, 2) + '\n'
  )
  console.log('[public-doc-coverage]', JSON.stringify(report, null, 2))
}

main()
