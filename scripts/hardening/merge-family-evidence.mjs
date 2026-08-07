/**
 * Merge family-evidence summary into dashboard + a11y/visual reports.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')
const evidencePath = join(hardening, 'reports/family-evidence/summary.json')

function load(rel) {
  const p = join(hardening, rel)
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null
}

function main() {
  if (!existsSync(evidencePath)) {
    console.warn('[merge-family-evidence] no summary yet — run e2e hardening-family-evidence first')
    process.exit(0)
  }
  const evidence = JSON.parse(readFileSync(evidencePath, 'utf8'))
  const dashboard = load('dashboard/component-dashboard.json') || {}

  dashboard.familyEvidence = {
    generatedAt: evidence.generatedAt,
    source: evidence.source,
    families: Object.fromEntries(
      (evidence.families || []).map((f) => [
        f.family,
        {
          batch: f.batch,
          axe: f.axe?.status,
          keyboard: f.keyboard?.status,
          visual: f.visual?.status,
          themes: f.visual?.themes || []
        }
      ])
    ),
    deepenedCount: (evidence.families || []).length
  }

  mkdirSync(join(hardening, 'dashboard'), { recursive: true })
  writeFileSync(
    join(hardening, 'dashboard/component-dashboard.json'),
    JSON.stringify(dashboard, null, 2) + '\n'
  )

  writeFileSync(
    join(hardening, 'reports/a11y-report.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        policy: 'Critical/Serious must be 0 for interactive/form/overlay',
        familyEvidence: evidence.families.map((f) => ({
          family: f.family,
          batch: f.batch,
          axe: f.axe
        })),
        status: 'family-deepened'
      },
      null,
      2
    ) + '\n'
  )

  writeFileSync(
    join(hardening, 'reports/visual-report.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        familyEvidence: evidence.families
          .filter((f) => f.visual)
          .map((f) => ({
            family: f.family,
            themes: f.visual.themes,
            artifacts: `reports/family-evidence/visual/`
          })),
        status: 'family-deepened'
      },
      null,
      2
    ) + '\n'
  )

  writeFileSync(
    join(hardening, 'reports/family-evidence.md'),
    [
      '# Family Evidence Deepen',
      '',
      `- Generated: ${evidence.generatedAt}`,
      `- Source: ${evidence.source}`,
      '',
      '| Family | Batch | Unit | Axe | Keyboard | Visual |',
      '|---|---|---|---|---|---|',
      ...(evidence.families || []).map(
        (f) =>
          `| ${f.family} | ${f.batch} | ${f.unit?.status ?? '-'} | ${f.axe?.status ?? '-'} | ${f.keyboard?.status ?? '-'} | ${f.visual?.status ?? '-'} |`
      ),
      '',
      'Artifacts: `component-hardening/reports/family-evidence/`',
      '',
      'Playwright deepen: `npm run hardening:evidence` (requires `npx playwright install chromium`).',
      ''
    ].join('\n'),
    'utf8'
  )

  console.log(
    `[merge-family-evidence] deepened=${(evidence.families || []).length} families`
  )
}

main()
