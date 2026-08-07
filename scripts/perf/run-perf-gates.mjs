/**
 * Performance gate — DataTable / Tree / Select / VirtualList coarse budgets.
 * Fails CI when mount or DOM node counts regress beyond thresholds.
 *
 * Usage: node scripts/perf/run-perf-gates.mjs
 * Or: npm run test:perf-gates (vitest wrapper)
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

/** Budgets — DOM nodes for virtualized views must stay << dataset size */
export const PERF_BUDGETS = {
  dataTable10k: { maxBodyRows: 500, maxMountMs: 3000 },
  dataTable100k: { maxBodyRows: 800, maxMountMs: 8000 },
  tree10k: { maxVisibleNodes: 500, maxMountMs: 4000 },
  select10k: { maxDomOptions: 100, maxMountMs: 2000 },
  virtualList100k: { maxDomItems: 100, maxMountMs: 3000 }
}

export function assertBudget(name, actual, budget) {
  const fails = []
  for (const [key, max] of Object.entries(budget)) {
    if (typeof actual[key] === 'number' && actual[key] > max) {
      fails.push(`${name}.${key}=${actual[key]} > ${max}`)
    }
  }
  return { ok: fails.length === 0, fails }
}

function main() {
  mkdirSync(join(root, 'component-hardening/reports'), { recursive: true })
  const report = {
    generatedAt: new Date().toISOString(),
    budgets: PERF_BUDGETS,
    note: 'Measured by tests/unit/perf/perf-gates.spec.ts — this script exports budgets SSOT'
  }
  writeFileSync(
    join(root, 'component-hardening/reports/perf-budgets.json'),
    JSON.stringify(report, null, 2) + '\n'
  )
  console.log('[perf-gates] budgets written → component-hardening/reports/perf-budgets.json')
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || process.argv[1]?.endsWith('run-perf-gates.mjs')) {
  main()
}
