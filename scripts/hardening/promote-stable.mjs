/**
 * Promote components that PASS verify gates **and** have mandatory evidence packs.
 *
 * Usage:
 *   node scripts/hardening/promote-stable.mjs --batch B01
 *   node scripts/hardening/promote-stable.mjs Button Select
 *   node scripts/hardening/promote-stable.mjs --all-passing   # only evidence-complete
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  evidenceCompleteForStable,
  loadEvidenceManifest
} from './evidence.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function loadJson(rel) {
  return JSON.parse(readFileSync(join(hardening, rel), 'utf8'))
}

function saveContract(name, contract) {
  writeFileSync(
    join(hardening, 'contracts', `${name}.json`),
    JSON.stringify(contract, null, 2) + '\n'
  )
}

function main() {
  const args = process.argv.slice(2)
  const gatesPath = join(hardening, 'gates/results/all.json')
  const gates = existsSync(gatesPath) ? loadJson('gates/results/all.json') : { results: [] }
  const batches = loadJson('inventory/component-batches.json')
  const inventory = loadJson('inventory/component-inventory.json')

  let candidates = (gates.results || []).filter((r) => r.status === 'PASS')

  if (args[0] === '--batch' && args[1]) {
    const batch = batches.batches.find((b) => b.id === args[1])
    const set = new Set(batch?.components || [])
    candidates = candidates.filter((r) => set.has(r.name))
  } else if (args.length && !args[0].startsWith('-')) {
    const set = new Set(args)
    // Prefer per-component verify results when promoting an explicit list.
    candidates = [...set]
      .map((name) => {
        const singlePath = join(hardening, 'gates/results', `${name}.json`)
        if (existsSync(singlePath)) {
          return JSON.parse(readFileSync(singlePath, 'utf8'))
        }
        return (gates.results || []).find((r) => r.name === name)
      })
      .filter((r) => r && r.status === 'PASS')
  }

  const now = new Date().toISOString()
  let count = 0
  let skipped = 0
  const promoted = []
  const blocked = []

  for (const row of candidates) {
    const path = join(hardening, 'contracts', `${row.name}.json`)
    if (!existsSync(path)) continue
    const contract = JSON.parse(readFileSync(path, 'utf8'))
    const evidence = loadEvidenceManifest(hardening, row.name)
    const mandatory = Object.entries({
      ...(contract.gates || {}),
      behavior: contract.gates?.behavior || 'mandatory',
      docs: contract.gates?.docs || 'mandatory'
    })
      .filter(([, sev]) => sev === 'mandatory')
      .map(([id]) => id)
      .filter((id) =>
        ['a11y', 'visual', 'behavior', 'keyboard', 'ssr', 'docs', 'theme', 'rtl', 'perf'].includes(
          id
        )
      )

    if (!evidenceCompleteForStable(evidence, mandatory)) {
      skipped += 1
      blocked.push({ name: row.name, reason: 'incomplete evidence pack' })
      continue
    }

    contract.maturity = 'stable'
    contract.promoteStable = true
    contract.apiFreeze = {
      version: '1',
      frozen: true,
      frozenAt: now
    }
    contract.updatedAt = now
    saveContract(row.name, contract)

    const inv = inventory.components.find((c) => c.name === row.name)
    if (inv) {
      inv.maturity = 'stable'
      inv.stableEligible = true
    }
    count += 1
    promoted.push(row.name)
  }

  writeFileSync(
    join(hardening, 'inventory/component-inventory.json'),
    JSON.stringify(inventory, null, 2) + '\n'
  )

  writeFileSync(
    join(hardening, 'reports/stable-report.json'),
    JSON.stringify(
      {
        generatedAt: now,
        promoted: count,
        skipped,
        promotedNames: promoted,
        blocked,
        publicCount: inventory.publicCount,
        note: 'Stable only with verify PASS + mandatory evidence PASS|N/A'
      },
      null,
      2
    ) + '\n'
  )

  console.log(
    `[promote-stable] promoted=${count} skipped=${skipped} names=[${promoted.join(', ')}]`
  )
  if (blocked.length) {
    console.log(`[promote-stable] blocked sample: ${blocked.slice(0, 5).map((b) => b.name).join(', ')}`)
  }
}

main()
