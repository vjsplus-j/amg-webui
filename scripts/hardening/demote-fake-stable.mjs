/**
 * Demote contracts marked stable without current verified gate + credible evidence.
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

function loadGate(name) {
  const singlePath = join(hardening, 'gates/results', `${name}.json`)
  if (existsSync(singlePath)) {
    return JSON.parse(readFileSync(singlePath, 'utf8'))
  }
  const allPath = join(hardening, 'gates/results/all.json')
  if (existsSync(allPath)) {
    const all = JSON.parse(readFileSync(allPath, 'utf8'))
    return (all.results || []).find((r) => r.name === name) || null
  }
  return null
}

function demote(contract, reason) {
  contract.maturity = 'rc'
  contract.promoteStable = false
  contract.apiFreeze = {
    ...(contract.apiFreeze || { version: '1' }),
    frozen: false,
    demotedAt: new Date().toISOString(),
    demoteReason: reason
  }
  contract.updatedAt = new Date().toISOString()
}

function main() {
  const files = readdirSync(contractsDir).filter(
    (f) => f.endsWith('.json') && f !== 'schema.json' && f !== 'family-api-profiles.json'
  )
  let demoted = 0
  let kept = 0
  const keptNames = []
  const demotedNames = []

  for (const file of files) {
    const path = join(contractsDir, file)
    const contract = JSON.parse(readFileSync(path, 'utf8'))
    if (contract.maturity !== 'stable' && !contract.apiFreeze?.frozen) continue

    const name = contract.name || file.replace(/\.json$/, '')
    const gate = loadGate(name)
    const evidence = loadEvidenceManifest(hardening, name)
    const mandatory = Object.entries(contract.gates || {})
      .filter(([, sev]) => sev === 'mandatory')
      .map(([id]) => id)
      .filter((id) =>
        ['a11y', 'visual', 'behavior', 'keyboard', 'ssr', 'docs', 'theme', 'rtl', 'perf'].includes(
          id
        )
      )

    const evidenceOk = evidenceCompleteForStable(evidence, mandatory)
    const verified =
      gate &&
      gate.status === 'PASS' &&
      (gate.verifiedStable === true || gate.stable === true) &&
      evidenceOk

    if (verified) {
      kept += 1
      keptNames.push(name)
      continue
    }

    const reason = !gate
      ? 'no current gate results'
      : gate.status !== 'PASS'
        ? `gate ${gate.status}`
        : !evidenceOk
          ? 'mandatory evidence FAIL/MISSING or credibility check failed'
          : 'gate did not report verifiedStable'

    demote(contract, reason)
    writeFileSync(path, JSON.stringify(contract, null, 2) + '\n')
    demoted += 1
    demotedNames.push({ name, reason })
  }

  const report = {
    generatedAt: new Date().toISOString(),
    demoted,
    keptStable: kept,
    keptNames,
    demotedNames,
    note: 'Stable requires current gate verifiedStable + credible evidence. No protected keep-list.'
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
