/**
 * Demote contracts marked stable without evidence packs (honesty pass).
 *
 * Usage: node scripts/hardening/demote-fake-stable.mjs
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEvidenceManifest, evidenceCompleteForStable } from './evidence.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')
const contractsDir = join(hardening, 'contracts')

const TEMPLATE_FIVE = new Set([
  'Button',
  'Select',
  'DatePicker',
  'Dialog',
  'DataTable'
])

function main() {
  const files = readdirSync(contractsDir).filter(
    (f) => f.endsWith('.json') && f !== 'schema.json'
  )
  let demoted = 0
  let kept = 0
  const keptNames = []

  for (const file of files) {
    const path = join(contractsDir, file)
    const contract = JSON.parse(readFileSync(path, 'utf8'))
    if (contract.maturity !== 'stable' && !contract.apiFreeze?.frozen) continue

    const name = contract.name || file.replace(/\.json$/, '')
    const evidence = loadEvidenceManifest(hardening, name)
    const mandatory = Object.entries(contract.gates || {})
      .filter(([, sev]) => sev === 'mandatory')
      .map(([id]) => id)
      .filter((id) =>
        ['a11y', 'visual', 'behavior', 'keyboard', 'ssr', 'docs', 'theme', 'rtl'].includes(
          id
        )
      )

    const ok = evidenceCompleteForStable(evidence, mandatory)
    if (ok) {
      kept += 1
      keptNames.push(name)
      continue
    }

    contract.maturity = TEMPLATE_FIVE.has(name) ? 'rc' : 'beta'
    contract.promoteStable = false
    if (contract.apiFreeze) {
      contract.apiFreeze = {
        ...contract.apiFreeze,
        frozen: false,
        demotedAt: new Date().toISOString(),
        demoteReason: 'missing mandatory gate evidence'
      }
    }
    contract.updatedAt = new Date().toISOString()
    writeFileSync(path, JSON.stringify(contract, null, 2) + '\n')
    demoted += 1
  }

  const report = {
    generatedAt: new Date().toISOString(),
    demoted,
    keptStable: kept,
    keptNames,
    note: 'Stable requires evidence/<Name>/{a11y,visual,...}.json PASS|N/A for mandatory gates'
  }
  writeFileSync(
    join(hardening, 'reports/demote-fake-stable.json'),
    JSON.stringify(report, null, 2) + '\n'
  )
  console.log(
    `[demote-fake-stable] demoted=${demoted} keptStable=${kept} kept=[${keptNames.join(', ')}]`
  )
}

main()
