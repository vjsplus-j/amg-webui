/**
 * Enrich all batch contracts B01–B24 with family behavioral defaults + freeze candidates.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function main() {
  const batches = JSON.parse(
    readFileSync(join(hardening, 'inventory/component-batches.json'), 'utf8')
  )
  const familyProfiles = JSON.parse(
    readFileSync(join(hardening, 'contracts/family-api-profiles.json'), 'utf8')
  )
  let n = 0
  for (const batch of batches.batches) {
    if (!/^B(0[1-9]|1\d|2[0-4])$/.test(batch.id)) continue
    for (const name of batch.components) {
      const path = join(hardening, 'contracts', `${name}.json`)
      if (!existsSync(path)) continue
      const contract = JSON.parse(readFileSync(path, 'utf8'))
      const profile = familyProfiles[batch.family] || {}
      contract.batch = batch.id
      contract.batchTitle = batch.title
      contract.requiredExpose = profile.requiredExpose || contract.requiredExpose
      contract.requiredSlots = profile.requiredSlots || contract.requiredSlots
      contract.behavioralContract = {
        ...(contract.behavioralContract || {}),
        batch: `${batch.id} ${batch.title}`,
        disabled: 'Interactive actions no-op when disabled',
        unmount: 'Listeners, timers, observers, and abort controllers must be released'
      }
      if (!contract.states?.length) {
        contract.states = ['default', 'disabled']
      }
      contract.updatedAt = new Date().toISOString()
      writeFileSync(path, JSON.stringify(contract, null, 2) + '\n')
      n++
    }
  }
  console.log(`[enrich-batches] updated=${n}`)
}

main()
