/**
 * LC-012 Golden Path — shared step labels + report writer (Playwright E2E).
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

/** @type {readonly string[]} */
export const GOLDEN_PATH_STEP_LABELS = [
  'Create blank page',
  'Drop Container',
  'Drop Form',
  'Drop InputText',
  'Edit label',
  'Bind state.keyword',
  'Add Button',
  'click → call queryUsers',
  'Drop DataTable',
  'value → data.queryUsers.list',
  'Click Preview',
  'Page works',
  'Save',
  'Refresh browser',
  'Page restored',
  'Export JSON',
  'Import JSON',
  'Generate Vue',
  'Generated Vue builds'
]

const SOURCE_PATHS = [
  'packages/lowcode/studio/StudioShell.vue',
  'packages/lowcode/studio/EditorCanvas.vue',
  'packages/lowcode/studio/StudioInspector.vue',
  'packages/lowcode/document/index.ts',
  'packages/lowcode/codegen.ts',
  'scripts/lowcode/build-generated-sfc-fixture.mjs'
]

export function hashLowcodeGoldenPathSources() {
  const h = createHash('sha256')
  for (const rel of SOURCE_PATHS) {
    const abs = join(repoRoot, rel)
    if (existsSync(abs)) h.update(readFileSync(abs))
  }
  return h.digest('hex')
}

/**
 * @param {Array<{ id: number; pass: boolean; note?: string }>} stepResults
 * @param {{ runId?: string; source?: string }} [meta]
 */
export function writeGoldenPathReport(stepResults, meta = {}) {
  const steps = GOLDEN_PATH_STEP_LABELS.map((label, i) => {
    const id = i + 1
    const found = stepResults.find((s) => s.id === id)
    return {
      id,
      label,
      pass: Boolean(found?.pass),
      note: found?.note ?? (found ? undefined : 'not evaluated')
    }
  })
  const pass = steps.filter((s) => s.pass).length
  const fail = steps.length - pass
  const report = {
    runId: meta.runId ?? `lc012-${Date.now()}`,
    verifiedAt: new Date().toISOString(),
    source: meta.source ?? 'tests/e2e/lowcode-golden-path.spec.ts',
    sourceSha: hashLowcodeGoldenPathSources(),
    total: steps.length,
    pass,
    fail,
    status: pass === steps.length ? 'PASS' : 'FAIL',
    goldenPathReady: pass === steps.length,
    productionReady: false,
    steps
  }
  const outPath = join(repoRoot, 'component-hardening/reports/lowcode-golden-path.json')
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return { report, outPath }
}
