/**
 * Build component dashboard + stable list (HAR-012 / REL-001 / REL-002).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function loadJson(rel) {
  const p = join(hardening, rel)
  if (!existsSync(p)) return null
  return JSON.parse(readFileSync(p, 'utf8'))
}

function main() {
  const inventory = loadJson('inventory/component-inventory.json')
  const maturity = loadJson('inventory/component-maturity-v4.json')
  const audit = loadJson('reports/component-api-audit.json')
  const gates = loadJson('gates/results/all.json')
  const familyMap = loadJson('inventory/component-family-map.json')

  const gateByName = new Map((gates?.results || []).map((r) => [r.name, r]))
  const auditByName = new Map((audit?.results || []).map((r) => [r.name, r]))

  const rows = inventory.components.map((c) => {
    const g = gateByName.get(c.name)
    const a = auditByName.get(c.name)
    const contract = loadJson(`contracts/${c.name}.json`)
    return {
      name: c.name,
      family: c.family,
      package: c.package,
      capability: c.capability,
      maturity: contract?.maturity || c.maturity,
      apiCompleteness: a?.completeness ?? null,
      gateStatus: g?.status ?? 'UNKNOWN',
      stable: Boolean(g?.stable || contract?.maturity === 'stable'),
      batch: c.batch
    }
  })

  const publicRows = rows.filter((r) => {
    const inv = inventory.components.find((c) => c.name === r.name)
    return inv?.public
  })

  const stableList = publicRows.filter((r) => r.stable).map((r) => r.name)
  const betaList = publicRows.filter((r) => !r.stable).map((r) => ({
    name: r.name,
    maturity: r.maturity === 'stable' ? 'beta' : r.maturity,
    gateStatus: r.gateStatus,
    reason: r.gateStatus === 'FAIL' ? 'gates_failed' : 'not_promoted'
  }))

  const stableRatio = publicRows.length
    ? Math.round((stableList.length / publicRows.length) * 1000) / 10
    : 0

  const apiCoverage = {
    propsTyped: publicRows.filter((r) => (r.apiCompleteness ?? 0) >= 50).length,
    total: publicRows.length,
    avgCompleteness: audit?.summary?.avgCompleteness ?? 0
  }

  const dashboard = {
    version: 1,
    generatedAt: new Date().toISOString(),
    inventory: {
      total: inventory.total,
      public: inventory.publicCount,
      target: inventory.target
    },
    maturity: maturity?.summary,
    gates: gates?.summary,
    api: apiCoverage,
    stableRatio,
    stableTarget: 90,
    stableTargetMet: stableRatio >= 90,
    honesty: {
      note: 'Stable requires evidence packs. stableTargetMet is a program goal, not a CI hard gate until evidence coverage exists.',
      evidenceRequired: true
    },
    familyApi: Object.fromEntries(
      (familyMap?.families || []).map((f) => {
        const fr = publicRows.filter((r) => r.family === f.id)
        const avg = fr.length
          ? Math.round(
              fr.reduce((s, r) => s + (r.apiCompleteness || 0), 0) / fr.length
            )
          : 0
        return [f.id, { count: fr.length, apiAvg: avg }]
      })
    ),
    components: rows
  }

  mkdirSync(join(hardening, 'dashboard'), { recursive: true })
  writeFileSync(
    join(hardening, 'dashboard/component-dashboard.json'),
    JSON.stringify(dashboard, null, 2) + '\n'
  )
  writeFileSync(
    join(hardening, 'dashboard/component-dashboard.md'),
    [
      '# Component Hardening Dashboard',
      '',
      `- Generated: ${dashboard.generatedAt}`,
      `- Inventory: ${dashboard.inventory.public} public / ${dashboard.inventory.total} total (target ${dashboard.inventory.target})`,
      `- Stable Ratio: ${stableRatio}% (target ≥ 90%) — ${dashboard.stableTargetMet ? 'MET' : 'NOT MET'}`,
      `- Gate pass: ${gates?.summary?.pass ?? 0} / ${gates?.summary?.total ?? 0}`,
      `- API avg completeness: ${apiCoverage.avgCompleteness}%`,
      '',
      '## Family API averages',
      ...Object.entries(dashboard.familyApi).map(
        ([k, v]) => `- ${k}: n=${v.count} apiAvg=${v.apiAvg}%`
      ),
      ''
    ].join('\n'),
    'utf8'
  )

  writeFileSync(
    join(hardening, 'reports/stable-components.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: stableList.length,
        ratio: stableRatio,
        components: stableList
      },
      null,
      2
    ) + '\n'
  )

  writeFileSync(
    join(hardening, 'reports/non-stable-components.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: betaList.length,
        components: betaList
      },
      null,
      2
    ) + '\n'
  )

  console.log(
    `[dashboard] stable=${stableList.length}/${publicRows.length} (${stableRatio}%) targetMet=${dashboard.stableTargetMet}`
  )
}

main()
