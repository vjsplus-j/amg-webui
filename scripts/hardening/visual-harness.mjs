/**
 * HAR-008 Visual harness scaffold — records required states per stable component.
 * Full Playwright baselines run via tests/e2e + nightly; this writes the matrix SSOT.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

const STATES = ['default', 'focus', 'disabled', 'dark']
const THEMES = [
  'mercedes',
  'linear',
  'porsche',
  'lamborghini',
  'ferrari',
  'apple',
  'wechat',
  'alipay'
]

function main() {
  const inventory = JSON.parse(
    readFileSync(join(hardening, 'inventory/component-inventory.json'), 'utf8')
  )
  const gates = existsSync(join(hardening, 'gates/results/all.json'))
    ? JSON.parse(readFileSync(join(hardening, 'gates/results/all.json'), 'utf8'))
    : { results: [] }

  const matrix = inventory.components
    .filter((c) => c.public)
    .map((c) => {
      const g = (gates.results || []).find((r) => r.name === c.name)
      return {
        name: c.name,
        family: c.family,
        states: STATES,
        themes: THEMES,
        rtl: true,
        baselineStatus: g?.status === 'PASS' ? 'scheduled' : 'blocked',
        note: 'Playwright screenshot baselines: tests/e2e + CI nightly'
      }
    })

  const out = {
    generatedAt: new Date().toISOString(),
    states: STATES,
    themes: THEMES,
    components: matrix,
    summary: {
      total: matrix.length,
      scheduled: matrix.filter((m) => m.baselineStatus === 'scheduled').length
    }
  }

  mkdirSync(join(hardening, 'reports'), { recursive: true })
  writeFileSync(
    join(hardening, 'reports/visual-report.json'),
    JSON.stringify(out, null, 2) + '\n'
  )
  console.log(
    `[visual-harness] matrix=${out.summary.total} scheduled=${out.summary.scheduled}`
  )
}

main()
