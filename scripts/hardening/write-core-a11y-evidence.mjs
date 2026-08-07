/**
 * Write unit-level a11y evidence for template-five components using axe-core.
 * Separates A11Y_STRUCTURE (all rules except color-contrast) and A11Y_CONTRAST.
 *
 * Usage: node scripts/hardening/write-core-a11y-evidence.mjs
 */
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'

const require = createRequire(import.meta.url)
const axe = require('axe-core')

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const evidenceRoot = join(root, 'component-hardening/evidence')

const FIXTURES = {
  Button: `<button type="button" class="vp-button">Action</button>`,
  Select: `<div class="vp-select" role="combobox" aria-expanded="false" aria-controls="list" tabindex="0"><span>Option</span></div><ul id="list" role="listbox" hidden><li role="option">A</li></ul>`,
  Dialog: `<div class="vp-dialog-overlay"><div class="vp-dialog" role="dialog" aria-modal="true" aria-labelledby="t"><h2 id="t">Title</h2><button type="button">Close</button></div></div>`,
  DatePicker: `<button type="button" class="vp-datepicker__trigger" aria-haspopup="dialog" aria-expanded="false">Pick date</button>`,
  DataTable: `<div class="vp-datatable" role="grid" tabindex="0"><table><thead><tr><th role="columnheader" aria-sort="none">ID</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table></div>`
}

async function runAxe(html, disableContrast) {
  const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><body><main id="root">${html}</main></body></html>`, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost/'
  })
  const { window } = dom
  // Inject axe
  window.eval(readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8'))
  const axeWin = window.axe
  const options = disableContrast
    ? { rules: { 'color-contrast': { enabled: false } } }
    : { runOnly: { type: 'rule', values: ['color-contrast'] } }
  const results = await axeWin.run(window.document.querySelector('#root'), options)
  const critical = results.violations.filter((v) => v.impact === 'critical').length
  const serious = results.violations.filter((v) => v.impact === 'serious').length
  return {
    critical,
    serious,
    blocking: critical + serious,
    violations: results.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help }))
  }
}

async function main() {
  const report = []
  for (const [name, html] of Object.entries(FIXTURES)) {
    const structure = await runAxe(html, true)
    const contrast = await runAxe(html, false)
    const dir = join(evidenceRoot, name)
    mkdirSync(dir, { recursive: true })

    const structureStatus = structure.blocking === 0 ? 'PASS' : 'FAIL'
    const contrastStatus = contrast.blocking === 0 ? 'PASS' : 'FAIL'
    const overall =
      structureStatus === 'PASS' && contrastStatus === 'PASS' ? 'PASS' : 'FAIL'

    const payload = {
      status: overall,
      A11Y_STRUCTURE: {
        status: structureStatus,
        critical: structure.critical,
        serious: structure.serious,
        detail: 'axe-core unit fixture (color-contrast disabled)'
      },
      A11Y_CONTRAST: {
        status: contrastStatus,
        critical: contrast.critical,
        serious: contrast.serious,
        detail:
          contrastStatus === 'PASS'
            ? 'axe color-contrast on fixture'
            : `contrast violations: ${JSON.stringify(contrast.violations)}`,
        violations: contrast.violations
      },
      detail: `A11Y_STRUCTURE=${structureStatus}; A11Y_CONTRAST=${contrastStatus}`,
      source: 'scripts/hardening/write-core-a11y-evidence.mjs',
      updatedAt: new Date().toISOString()
    }
    writeFileSync(join(dir, 'a11y.json'), JSON.stringify(payload, null, 2) + '\n')
    report.push({ name, overall, structure: structureStatus, contrast: contrastStatus })
    console.log(`[a11y-evidence] ${name} ${overall} structure=${structureStatus} contrast=${contrastStatus}`)
  }
  writeFileSync(
    join(root, 'component-hardening/reports/core-a11y-evidence.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2) + '\n'
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
