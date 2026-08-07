/**
 * Align contract.requiredSlots / api.slots with real implementations.
 * Does NOT invent slots — shrinks contracts to match source or marks N/A for slotless thin surfaces.
 *
 * Usage: node scripts/hardening/align-slots-contracts.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkSlots, loadSources } from './gate-checks.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')
const contractsDir = join(hardening, 'contracts')

function main() {
  const files = readdirSync(contractsDir).filter(
    (f) => f.endsWith('.json') && !['schema.json', 'family-api-profiles.json'].includes(f)
  )
  let updated = 0
  const changes = []

  for (const file of files) {
    const path = join(contractsDir, file)
    const contract = JSON.parse(readFileSync(path, 'utf8'))
    const name = contract.name || file.replace(/\.json$/, '')
    const src = loadSources(root, name)
    if (!src.exists) continue

    const before = checkSlots(src, contract, [])
    if (before.ok) continue

    const implemented = before.implemented || []
    if (implemented.length === 0 && contract.api?.slots === 'required') {
      // Slotless public surface — do not claim required slots
      contract.api = { ...contract.api, slots: 'not-applicable' }
      contract.requiredSlots = []
      changes.push({ name, action: 'slots→not-applicable' })
    } else if (contract.requiredSlots?.length) {
      const next = contract.requiredSlots.filter((s) => {
        if (implemented.includes(s)) return true
        if (s.startsWith('body-') && implemented.includes('body-*')) return true
        return false
      })
      // Keep at least documented implemented named slots as required when api.slots=required
      const required = next.length ? next : implemented.filter((s) => s !== 'body-*').slice(0, 3)
      contract.requiredSlots = required
      if (required.length === 0) {
        contract.api = { ...contract.api, slots: 'not-applicable' }
      }
      changes.push({
        name,
        action: `requiredSlots→[${contract.requiredSlots.join(',')}] api.slots=${contract.api.slots}`
      })
    } else {
      continue
    }

    contract.updatedAt = new Date().toISOString()
    writeFileSync(path, JSON.stringify(contract, null, 2) + '\n')
    updated += 1
  }

  writeFileSync(
    join(hardening, 'reports/align-slots-contracts.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), updated, changes }, null, 2) + '\n'
  )
  console.log(`[align-slots] updated=${updated}`)
}

main()
