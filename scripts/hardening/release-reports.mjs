/**
 * Write final release reports (REL-004 / REL-005 / REL-006).
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function load(rel) {
  const p = join(hardening, rel)
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
}

function main() {
  const dashboard = load('dashboard/component-dashboard.json')
  const stable = load('reports/stable-components.json')
  const ssr = load('reports/ssr-report.json')
  const visual = load('reports/visual-report.json')
  const audit = load('reports/component-api-audit.json')

  const a11y = {
    generatedAt: new Date().toISOString(),
    policy: 'Critical/Serious must be 0 for interactive/form/overlay (HAR-007)',
    enforcement: {
      pr: 'Playwright axe samples in tests/e2e (dialog/overlay)',
      nightly: 'Expand per-family axe matrix',
      structural: 'verify:component a11y gate present on profiles'
    },
    status: 'baseline-wired'
  }

  const close = {
    generatedAt: new Date().toISOString(),
    program: 'AMG-WebUI 300 Component Hardening',
    stableRatio: dashboard?.stableRatio ?? null,
    stableTarget: 90,
    stableTargetMet: Boolean(dashboard?.stableTargetMet),
    inventory: dashboard?.inventory,
    gateSummary: dashboard?.gates,
    apiAvg: audit?.summary?.avgCompleteness ?? null,
    ssr: ssr?.summary,
    visual: visual?.summary,
    knownLimitations: [
      'Per-component Playwright screenshot golden baselines are scheduled via visual-report matrix; expand nightly coverage family-by-family.',
      'axe-core Critical/Serious=0 is enforced on overlay e2e samples today; full interactive inventory rolls out via nightly.',
      'Benchmark gates (Select 10k / Tree 50k / Table 100k) require dedicated benchmark runners under benchmarks/.',
      'Industry Media/GB/ONVIF Stable requires mock adapters — engines/mediaAdapter.ts is the contract; domain UIs must not bind real server DTOs.'
    ],
    verdict: dashboard?.stableTargetMet
      ? 'HARDENING_PROGRAM_CLOSE_READY — Stable Ratio met; continue deepening visual/axe/benchmark evidence.'
      : 'HARDENING_PROGRAM_OPEN — Stable Ratio below target.'
  }

  mkdirSync(join(hardening, 'reports'), { recursive: true })
  writeFileSync(
    join(hardening, 'reports/a11y-report.json'),
    JSON.stringify(a11y, null, 2) + '\n'
  )
  writeFileSync(
    join(hardening, 'reports/program-close.json'),
    JSON.stringify(close, null, 2) + '\n'
  )
  writeFileSync(
    join(hardening, 'reports/stable-report.md'),
    [
      '# Stable Components Report',
      '',
      `- Count: ${stable?.count ?? 0}`,
      `- Ratio: ${stable?.ratio ?? 0}%`,
      `- Generated: ${stable?.generatedAt ?? ''}`,
      '',
      '## Components',
      ...(stable?.components || []).map((n) => `- ${n}`),
      '',
      '## Known Limitations',
      ...close.knownLimitations.map((l) => `- ${l}`),
      '',
      `## Verdict`,
      '',
      close.verdict,
      ''
    ].join('\n'),
    'utf8'
  )

  writeFileSync(
    join(hardening, 'reports/CHANGELOG-HARDENING.md'),
    [
      '# Component Hardening Changelog',
      '',
      '## 0.1.0-hardening',
      '',
      '- Added `component-hardening/` SSOT (inventory, family map, batches, contracts, gates, dashboard).',
      '- Added shared engines under `packages/utils/engines` (ENG-001…012).',
      '- Added `audit:api`, `verify:component`, `verify:family`, promote + dashboard scripts.',
      '- Wired CI changed-component + nightly hardening jobs.',
      `- Stable components: ${stable?.count ?? 0} (${stable?.ratio ?? 0}%).`,
      ''
    ].join('\n'),
    'utf8'
  )

  console.log(`[release-reports] ${close.verdict}`)
}

main()
