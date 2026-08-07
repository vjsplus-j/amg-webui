/**
 * Build honest program-status.json from dashboard + verify reports (SSOT).
 *
 * Usage: node scripts/hardening/build-program-status.mjs
 * Prereq: npm run hardening:dashboard (component-dashboard.json fresh)
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkEvidenceFreshness, EVIDENCE_GATES } from './evidence.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function load(rel) {
  const p = join(hardening, rel)
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
}

function loadPkgVersion() {
  return JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version
}

function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function scanComponentEvidenceFreshness() {
  const evidenceRoot = join(hardening, 'evidence')
  const profiles = load('gates/profiles/index.json') || {}
  const familyMap = load('inventory/component-family-map.json')

  function mandatoryGateIds(contract) {
    const familyProfile =
      familyMap?.families?.find((f) => f.id === contract.family)?.gateProfile || 'general'
    const profile = profiles[familyProfile] || profiles.general || { gates: {} }
    return Object.entries({ ...(profile.gates || {}), ...(contract.gates || {}) })
      .filter(([, sev]) => sev === 'mandatory')
      .map(([id]) => id)
  }

  const components = readdirSync(evidenceRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  let freshComponents = 0
  let staleComponents = 0

  for (const name of components) {
    const contractPath = join(hardening, 'contracts', `${name}.json`)
    const contract = existsSync(contractPath)
      ? JSON.parse(readFileSync(contractPath, 'utf8'))
      : null
    const mandatory = contract ? mandatoryGateIds(contract) : []
    let componentStale = false
    let checked = 0

    for (const gate of EVIDENCE_GATES) {
      if (!mandatory.includes(gate)) continue
      const file = `${gate}.json`
      const path = join(evidenceRoot, name, file)
      if (!existsSync(path)) {
        componentStale = true
        continue
      }
      checked += 1
      const r = checkEvidenceFreshness(hardening, name, file, root)
      if (r.stale || !r.hasHash) componentStale = true
    }

    if (!checked) {
      staleComponents += 1
    } else if (componentStale) {
      staleComponents += 1
    } else {
      freshComponents += 1
    }
  }

  return { freshComponents, staleComponents, scanned: components.length }
}

function scanKeyboardPassEvidence() {
  const evidenceRoot = join(hardening, 'evidence')
  if (!existsSync(evidenceRoot)) return { components: [], byFamily: {} }
  const components = []
  const byFamily = {}
  for (const d of readdirSync(evidenceRoot, { withFileTypes: true })) {
    if (!d.isDirectory()) continue
    const path = join(evidenceRoot, d.name, 'keyboard.json')
    if (!existsSync(path)) continue
    try {
      const data = JSON.parse(readFileSync(path, 'utf8'))
      const status = String(data.status || '').toUpperCase()
      const cases = Array.isArray(data.testCases) ? data.testCases : []
      const allPass =
        status === 'PASS' &&
        cases.length > 0 &&
        cases.every((tc) => tc.status === 'PASS' && tc.expected)
      const fresh = checkEvidenceFreshness(hardening, d.name, 'keyboard.json', root)
      if (allPass && !fresh.stale) {
        components.push(d.name)
        const family = data.family || 'unknown'
        byFamily[family] = byFamily[family] || []
        byFamily[family].push(d.name)
      }
    } catch {
      /* ignore invalid */
    }
  }
  components.sort()
  return { components, byFamily }
}

function scanShowcaseBuilds() {
  const showcasesDir = join(root, 'showcases')
  const entries = readdirSync(showcasesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{2}-/.test(d.name))
    .map((d) => ({
      id: d.name,
      dist: existsSync(join(showcasesDir, d.name, 'dist')),
      domainPages: existsSync(join(showcasesDir, d.name, 'src', 'pages'))
    }))
  const built = entries.filter((e) => e.dist).length
  return {
    status: built === entries.length ? 'BUILT' : 'BUILDING',
    total: entries.length,
    built,
    entries
  }
}

function buildLowcodeSection(golden) {
  return {
    studioVersion: '0.1',
    maturity: 'beta',
    exportPath: 'amg-webui/lowcode',
    exportNote: 'experimental Studio — not root barrel; Theme Studio is amg-webui/theme/studio',
    goldenPath: {
      status: golden?.status ?? 'UNKNOWN',
      productionReady: golden?.productionReady === true,
      goldenPathReady: golden?.goldenPathReady === true,
      stepsTotal: golden?.total ?? 19,
      stepsPass: golden?.pass ?? 0,
      stepsFail: golden?.fail ?? 0,
      report: 'component-hardening/reports/lowcode-golden-path.json',
      verifiedBy: golden?.source ?? 'tests/e2e/lowcode-golden-path.spec.ts',
      note:
        'LC-012 golden path E2E PASS ≠ Studio product-stable. productionReady stays false until six-dimension Studio Ready.'
    }
  }
}

function buildBlockingLists(ctx) {
  const blockingForStable = []
  const blockingFor1_0 = []
  const coverageGaps = []
  const experimental = [
    'Lowcode Studio (productionReady=false)',
    'Theme Studio (amg-webui/theme/studio)',
    'Skill Runtime (SR3 experimental)'
  ]

  const staleCount = Math.max(0, ctx.publicTotal - ctx.evidenceFresh)
  if (staleCount > 0) {
    blockingForStable.push(
      `${staleCount} components missing fresh mandatory evidence (sourceHash+contractHash)`
    )
  }
  if (ctx.verifiedStable === 0) {
    blockingForStable.push('verifiedStable=0 — no component currently meets Stable promotion gates')
  }
  if (ctx.keyboardFail > 0) {
    coverageGaps.push(`keyboard ${ctx.keyboardPass}/${ctx.publicTotal}`)
  }
  if (ctx.a11yThemeIncomplete) {
    coverageGaps.push('browser a11y theme matrix incomplete')
  } else if (ctx.a11yPass < 7) {
    coverageGaps.push(`browser/family a11y coverage incomplete (${ctx.a11yPass} families)`)
  }
  if (!ctx.onePointZeroReady) {
    if (!ctx.coreSetReady) {
      blockingFor1_0.push('Enterprise Admin Core Stable Set (Batch 01–04) not all CLOSED')
    }
    blockingFor1_0.push('npm version remains 0.1.0 trial — publish policy separate from Core Set readiness')
  }
  if (ctx.lowcodeNotProductReady) {
    experimental.push('Lowcode golden path may PASS while Studio stays experimental')
  }

  const knownGaps = [
    ...blockingForStable.map((x) => `stable: ${x}`),
    ...blockingFor1_0.map((x) => `1.0: ${x}`),
    ...coverageGaps.map((x) => `coverage: ${x}`)
  ]
  const todo = [
    ...(staleCount > 0
      ? ['HASH-EVIDENCE: regenerate mandatory evidence with both hashes before Stable promote']
      : []),
    ...(ctx.keyboardFail > 0
      ? ['KEYBOARD-COVERAGE: expand behavioral keyboard evidence beyond current family set']
      : []),
    'CLOSURE: complete Batch 01–04 Core Stable Set for 1.0 readiness'
  ]

  return { blockingForStable, blockingFor1_0, coverageGaps, experimental, knownGaps, todo }
}

function main() {
  const dashboard = load('dashboard/component-dashboard.json')
  if (!dashboard) {
    console.error('[program-status] missing dashboard — run npm run hardening:dashboard first')
    process.exit(1)
  }

  const gates = load('gates/results/all.json')
  const stableReport = load('reports/stable-components.json')
  const a11yReport = load('reports/a11y-report.json')
  const visualReport = load('reports/visual-report.json')
  const golden = load('reports/lowcode-golden-path.json')
  const maturity = load('inventory/component-maturity-v4.json')

  const publicTotal = dashboard.metrics?.public ?? dashboard.inventory?.public ?? 287
  const verifiedStable =
    dashboard.gates?.verifiedStable ?? dashboard.metrics?.stable ?? stableReport?.count ?? 0
  const gatePass = dashboard.metrics?.gatePass ?? dashboard.gates?.pass ?? 0
  const gateFail = dashboard.metrics?.gateFail ?? dashboard.gates?.fail ?? 0
  const gateUnknown = dashboard.metrics?.gateUnknown ?? dashboard.gates?.unknown ?? 0
  const docsPass = dashboard.docs?.pass ?? 0

  const evidenceScan = scanComponentEvidenceFreshness()
  const evidenceFresh = dashboard.evidence?.ok ?? evidenceScan.freshComponents
  const evidenceStale = publicTotal - evidenceFresh

  const keyboardScan = scanKeyboardPassEvidence()
  const keyboardPassComponents = keyboardScan.components
  const keyboardPass = keyboardPassComponents.length
  const keyboardFail = Math.max(0, publicTotal - keyboardPass)
  writeFileSync(
    join(hardening, 'reports/keyboard-family-evidence.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pass: keyboardPass,
        fail: keyboardFail,
        components: keyboardPassComponents,
        byFamily: keyboardScan.byFamily
      },
      null,
      2
    ) + '\n'
  )

  const a11yFamilies = a11yReport?.familyEvidence ?? []
  const a11yPass = a11yFamilies.filter((f) => f.axe?.status === 'PASS').length
  const a11yFail = a11yFamilies.filter((f) => f.axe?.status === 'FAIL').length
  const themeMatrixFamilies = visualReport?.familyEvidence?.length ?? 0
  const totalFamilies = load('inventory/component-family-map.json')?.families?.length ?? 0
  const browserA11y = load('reports/a11y-browser/summary.json')

  const showcaseBuilds = scanShowcaseBuilds()
  const npmVersion = loadPkgVersion()

  const readiness = load('reports/amg-webui-1.0-readiness.json')
  const closedRegistry = load('closed-components.json')
  const closedCount = Object.keys(closedRegistry?.components || {}).filter(
    (n) => closedRegistry.components[n]?.status === 'CLOSED'
  ).length
  const coreReady = readiness?.onePointZeroReady === true

  const lists = buildBlockingLists({
    publicTotal,
    evidenceFresh,
    verifiedStable,
    keyboardPass,
    keyboardFail,
    a11yPass,
    a11yThemeIncomplete: !browserA11y?.themeMatrixComplete,
    onePointZeroReady: coreReady,
    lowcodeNotProductReady: golden?.productionReady !== true
  })
  // Core Stable Set may be ready while warehouse Stable remains 0
  if (coreReady) {
    lists.blockingFor1_0 = lists.blockingFor1_0.filter(
      (x) => !/Enterprise Admin|Core Stable Set not yet CLOSED/i.test(x)
    )
    lists.todo = lists.todo.filter((t) => !t.startsWith('CLOSURE:'))
    lists.knownGaps = lists.knownGaps.filter((g) => !g.startsWith('1.0: Enterprise') && !g.includes('Core Stable Set not yet CLOSED'))
  }
  const { knownGaps, todo, blockingForStable, blockingFor1_0, coverageGaps, experimental } = lists

  const status = {
    updatedAt: new Date().toISOString(),
    version: `${npmVersion}-honest`,
    verifiedStable,
    gatePass,
    gateFail,
    gateUnknown,
    evidenceFresh,
    evidenceStale,
    docsPass,
    keyboardPass,
    keyboardFail,
    a11yPass,
    a11yFail,
    lowcodeGoldenPath: golden?.status ?? 'UNKNOWN',
    blockingForStable,
    blockingFor1_0,
    coverageGaps,
    experimental,
    coreStableSet: {
      closedComponents: closedCount,
      onePointZeroReady: coreReady,
      readinessReport: 'component-hardening/reports/amg-webui-1.0-readiness.json',
      note: '1.0 readiness tracks Batch 01–04 Core Stable Set + Enterprise Admin, not 287/287'
    },
    releaseReadiness: {
      npmVersion,
      onePointZeroReady: coreReady,
      note: coreReady
        ? 'Core Stable Set READY (Batches 01–04 + Enterprise Admin). Warehouse verifiedStable may remain 0.'
        : '0.1.0 trial — Core Stable Set via Batch 01–04 closure; not 287/287'
    },
    inventory: {
      actual: publicTotal,
      target: dashboard.inventory?.target ?? 300,
      ssot: 'component-hardening/inventory/component-inventory.json'
    },
    hardening: {
      verifiedStable,
      total: publicTotal,
      stableRatio: dashboard.stableRatio ?? 0,
      stableTarget: dashboard.stableTarget ?? 90,
      stableTargetMet: Boolean(dashboard.stableTargetMet),
      gatePass,
      gateFail,
      gateUnknown,
      evidenceFresh,
      evidenceStale,
      evidenceFiles: {
        fresh: evidenceScan.freshComponents,
        stale: evidenceScan.staleComponents,
        scanned: evidenceScan.scanned,
        note: 'Component-level freshness requires mandatory evidence with valid hashes'
      },
      docsPass,
      docsTotal: dashboard.docs?.total ?? publicTotal,
      keyboardPass,
      keyboardFail,
      keyboardPassComponents,
      keyboardSource: 'component-hardening/reports/keyboard-family-evidence.json',
      keyboardByFamily: keyboardScan.byFamily,
      a11yPass,
      a11yFail,
      a11yFamiliesPass: a11yPass,
      a11yThemeMatrixFamilies: themeMatrixFamilies,
      a11yThemeMatrixTotalFamilies: totalFamilies,
      a11yBrowser: browserA11y,
      a11ySource: 'component-hardening/reports/a11y-report.json',
      demoteNote:
        'All prior Stable demoted: STALE evidence without sourceHash/contractHash. Structural gates PASS; verifiedStable requires fresh evidence.',
      dashboard: 'component-hardening/dashboard/component-dashboard.json',
      gatesReport: 'component-hardening/gates/results/all.json',
      stableComponents: stableReport?.components ?? []
    },
    maturity: {
      scale: ['draft', 'beta', 'rc', 'stable'],
      fileSummary: maturity?.summary ?? null,
      claimedStableUnverified: dashboard.honesty?.claimedStableUnverified ?? 0
    },
    lowcode: buildLowcodeSection(golden),
    themeStudio: {
      exportPath: 'amg-webui/theme/studio',
      maturity: 'experimental',
      note: 'Theme Studio visual generator — not product-stable'
    },
    showcaseBuilds: {
      ...showcaseBuilds,
      note: '10 domain showcases with domain-specific pages; mock adapters only'
    },
    consumerBuilds: {
      status: 'CI_WIRED',
      fixtures: ['consumer-vite', 'consumer-webpack', 'consumer-nuxt'],
      command: 'npm run test:consumers',
      note: 'Includes amg-webui/theme/studio resolve smoke'
    },
    ciStatus: {
      status: 'WIRED',
      script: '.github/workflows/ci.yml',
      includes: [
        'verify:component --all --strict',
        'check:evidence-freshness',
        'hardening:demote',
        'test:showcases',
        'test:lowcode-golden-path',
        'test:a11y-browser',
        'test:consumers',
        'docs:build'
      ]
    },
    done: [
      'P0 keyboard evidence rewrite (behavioral testCases + family harness)',
      'P0 evidence freshness (sourceHash/contractHash; STALE blocks Stable)',
      'P0 no-backend-dto real static gate',
      'P0 Stable recalculated — verifiedStable 0/287 after honest demote',
      'P0 DataTable rowKey + DataTableRowInteractionEvent',
      'P0 Lowcode golden path Playwright 19/19',
      'P0 Theme Studio package export amg-webui/theme/studio',
      'P1 Showcases 01–10 domain pages + build matrix',
      'P1 Docs dead-link allowlist (not global ignore), API descriptions, sidebar SSOT',
      'P1 Browser A11Y axe structure+contrast + AutoComplete slots restored',
      'CI wired: strict verify, freshness, demote, showcases, lowcode, a11y-browser'
    ],
    todo,
    programBacklog: [],
    deferred: [],
    knownGaps,
    notes: [
      'Skill SR3 / Lowcode Studio / Theme Studio remain experimental by design.',
      'gatePass=287 reflects structural verify after demote; evidenceFresh=0 blocks Stable promotion.',
      'Docs sidebar SSOT: npm run generate:docs-sidebar from catalog + maturity metadata.',
      'ignoreDeadLinks is a narrow allowlist in docs/.vitepress/config.ts — NOT global true.',
      'onePointZeroReady=false until fresh evidence promotes a credible Stable set.'
    ]
  }

  writeFileSync(
    join(hardening, 'program-status.json'),
    JSON.stringify(status, null, 2) + '\n'
  )

  console.log(
    `[program-status] verifiedStable=${verifiedStable}/${publicTotal} gatePass=${gatePass} evidenceFresh=${evidenceFresh} keyboardPass=${keyboardPass} a11yFamilies=${a11yPass} lowcode=${golden?.status ?? 'UNKNOWN'}`
  )
}

main()
