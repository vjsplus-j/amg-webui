/**
 * Build component dashboard + stable list (HAR-012 / REL-001 / REL-002).
 *
 * SSOT chain (dashboard is display-only — never invents Stable):
 *   Inventory → Contract → Gate results → Evidence → Stable evaluation → Dashboard
 *
 * verifiedStable / components[].stable come ONLY from current gate results
 * (r.verifiedStable || r.stable). Contract maturity alone NEVER forces stable=true.
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
    const productMaturity = contract?.maturity || c.maturity || 'beta'
    const gateStatus = g?.status ?? 'UNKNOWN'
    // Stable ONLY from current verify result + contract still claims stable
    // Never from stale gate JSON alone after demote
    const verifiedStable = Boolean(
      g &&
        gateStatus === 'PASS' &&
        productMaturity === 'stable' &&
        (contract?.apiFreeze?.frozen === true || g.apiFreeze === true) &&
        (g.verifiedStable === true || g.stable === true)
    )
    return {
      name: c.name,
      family: c.family,
      package: c.package,
      capability: c.capability,
      productMaturity,
      maturity: productMaturity,
      apiCompleteness: a?.completeness ?? null,
      gateStatus,
      evidenceOk: Boolean(g?.evidenceOk),
      apiFreeze: Boolean(g?.apiFreeze ?? contract?.apiFreeze?.frozen),
      verifiedStable,
      stable: verifiedStable,
      batch: c.batch
    }
  })

  const publicRows = rows.filter((r) => {
    const inv = inventory.components.find((c) => c.name === r.name)
    return inv?.public
  })

  const stableList = publicRows.filter((r) => r.verifiedStable).map((r) => r.name)
  const betaList = publicRows
    .filter((r) => !r.verifiedStable)
    .map((r) => ({
      name: r.name,
      maturity: r.productMaturity === 'stable' ? 'claimed-stable-unverified' : r.productMaturity,
      productMaturity: r.productMaturity,
      gateStatus: r.gateStatus,
      reason:
        r.gateStatus === 'FAIL'
          ? 'gates_failed'
          : r.gateStatus === 'UNKNOWN'
            ? 'gates_unknown'
            : r.productMaturity === 'stable'
              ? 'contract_stable_but_not_verified'
              : 'not_promoted'
    }))

  const maturityCounts = {
    experimental: 0,
    beta: 0,
    rc: 0,
    stable: 0,
    deprecated: 0,
    other: 0,
    claimedStableUnverified: 0
  }
  for (const r of publicRows) {
    if (r.verifiedStable) {
      maturityCounts.stable += 1
    } else if (r.productMaturity === 'stable') {
      maturityCounts.claimedStableUnverified += 1
      // Unverified claim does not count as stable; bucket as rc for honesty
      maturityCounts.rc += 1
    } else if (r.productMaturity === 'rc' || r.productMaturity === 'rc-candidate') {
      maturityCounts.rc += 1
    } else if (r.productMaturity === 'beta') {
      maturityCounts.beta += 1
    } else if (r.productMaturity === 'experimental') {
      maturityCounts.experimental += 1
    } else if (r.productMaturity === 'deprecated') {
      maturityCounts.deprecated += 1
    } else {
      maturityCounts.other += 1
    }
  }

  const gatePass = publicRows.filter((r) => r.gateStatus === 'PASS').length
  const gateFail = publicRows.filter((r) => r.gateStatus === 'FAIL').length
  const gateUnknown = publicRows.filter((r) => r.gateStatus === 'UNKNOWN').length

  const evidenceCoverage = {
    ok: publicRows.filter((r) => r.evidenceOk).length,
    total: publicRows.length,
    ratio: publicRows.length
      ? Math.round(
          (publicRows.filter((r) => r.evidenceOk).length / publicRows.length) * 1000
        ) / 10
      : 0
  }

  const docsCoverage = {
    // Prefer audit/docs evidence count from gate results when present
    pass: (gates?.results || []).filter(
      (r) => r.gates?.some?.((g) => g.id === 'docs' && (g.status === 'PASS' || g.status === 'N/A'))
    ).length,
    total: publicRows.length
  }

  const apiCoverage = {
    propsTyped: publicRows.filter((r) => (r.apiCompleteness ?? 0) >= 50).length,
    total: publicRows.length,
    avgCompleteness: audit?.summary?.avgCompleteness ?? 0,
    ratio: publicRows.length
      ? Math.round(
          (publicRows.filter((r) => (r.apiCompleteness ?? 0) >= 50).length /
            publicRows.length) *
            1000
        ) / 10
      : 0
  }

  const stableRatio = publicRows.length
    ? Math.round((stableList.length / publicRows.length) * 1000) / 10
    : 0

  // Unified summary — single calculation chain
  const metrics = {
    inventory: {
      total: inventory.total,
      public: inventory.publicCount,
      target: inventory.target
    },
    public: publicRows.length,
    stable: stableList.length,
    beta: maturityCounts.beta,
    rc: maturityCounts.rc,
    fail: gateFail,
    gatePass,
    gateFail,
    gateUnknown,
    evidenceCoverage: evidenceCoverage.ratio,
    docsCoverage:
      docsCoverage.total > 0
        ? Math.round((docsCoverage.pass / docsCoverage.total) * 1000) / 10
        : 0,
    apiCoverage: apiCoverage.ratio,
    stableRatio
  }

  const dashboard = {
    version: 2,
    generatedAt: new Date().toISOString(),
    ssot: {
      chain: [
        'Inventory',
        'Contract',
        'Gate',
        'Evidence',
        'StableEvaluation',
        'Dashboard'
      ],
      note: 'Dashboard displays gate-derived verifiedStable only. Contract maturity is productMaturity, not Stable proof.'
    },
    inventory: metrics.inventory,
    maturity: {
      // Live counts from verifiedStable + productMaturity — supersedes stale maturity-v4.summary when present
      ...maturityCounts,
      // Keep historical file for reference but do not drive stableRatio
      legacyFileSummary: maturity?.summary ?? null
    },
    gates: {
      ...(gates?.summary || {}),
      pass: gatePass,
      fail: gateFail,
      unknown: gateUnknown,
      total: publicRows.length,
      stable: stableList.length,
      verifiedStable: stableList.length
    },
    api: apiCoverage,
    evidence: evidenceCoverage,
    docs: docsCoverage,
    metrics,
    stableRatio: metrics.stableRatio,
    stableTarget: 90,
    stableTargetMet: metrics.stableRatio >= 90,
    honesty: {
      note: 'verifiedStable requires current gate PASS + mandatory evidence PASS/N/A + apiFreeze + contract maturity=stable. Missing gates → UNKNOWN → stable=false.',
      evidenceRequired: true,
      claimedStableUnverified: maturityCounts.claimedStableUnverified
    },
    familyApi: Object.fromEntries(
      (familyMap?.families || []).map((f) => {
        const fr = publicRows.filter((r) => r.family === f.id)
        const avg = fr.length
          ? Math.round(
              fr.reduce((s, r) => s + (r.apiCompleteness || 0), 0) / fr.length
            )
          : 0
        const stable = fr.filter((r) => r.verifiedStable).length
        return [f.id, { count: fr.length, apiAvg: avg, verifiedStable: stable }]
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
      `- Inventory: ${metrics.inventory.public} public / ${metrics.inventory.total} total (target ${metrics.inventory.target})`,
      `- Verified Stable: ${metrics.stable}/${metrics.public} (${metrics.stableRatio}%) — target ≥ 90% — ${dashboard.stableTargetMet ? 'MET' : 'NOT MET'}`,
      `- Gate: pass=${metrics.gatePass} fail=${metrics.gateFail} unknown=${metrics.gateUnknown}`,
      `- Maturity buckets: stable=${maturityCounts.stable} rc=${maturityCounts.rc} beta=${maturityCounts.beta} claimed-unverified=${maturityCounts.claimedStableUnverified}`,
      `- Evidence coverage: ${metrics.evidenceCoverage}%`,
      `- API coverage (≥50%): ${metrics.apiCoverage}% (avg ${apiCoverage.avgCompleteness}%)`,
      '',
      '## Family API averages',
      ...Object.entries(dashboard.familyApi).map(
        ([k, v]) =>
          `- ${k}: n=${v.count} apiAvg=${v.apiAvg}% verifiedStable=${v.verifiedStable}`
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
        ratio: metrics.stableRatio,
        source: 'gates.results[].verifiedStable',
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
    `[dashboard] verifiedStable=${stableList.length}/${publicRows.length} (${metrics.stableRatio}%) gatePass=${gatePass} gateFail=${gateFail} unknown=${gateUnknown} claimedUnverified=${maturityCounts.claimedStableUnverified}`
  )
}

main()
