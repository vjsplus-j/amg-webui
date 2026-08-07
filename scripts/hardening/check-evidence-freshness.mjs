/**
 * Scan all on-disk evidence for source/contract hash freshness (P0-02).
 *
 * Usage: node scripts/hardening/check-evidence-freshness.mjs
 * Exit 1 when any mandatory evidence is STALE for stable-maturity contracts.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  checkEvidenceFreshness,
  EVIDENCE_GATES
} from './evidence.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')
const evidenceRoot = join(hardening, 'evidence')

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function loadProfiles() {
  return loadJson(join(hardening, 'gates/profiles/index.json'))
}

function mandatoryGateIds(contract, profiles) {
  const familyProfile =
    loadJson(join(hardening, 'inventory/component-family-map.json')).families.find(
      (f) => f.id === contract.family
    )?.gateProfile || 'general'
  const profile = profiles[familyProfile] || profiles.general
  return Object.entries({ ...(profile.gates || {}), ...(contract.gates || {}) })
    .filter(([, sev]) => sev === 'mandatory')
    .map(([id]) => id)
}

function main() {
  if (!existsSync(evidenceRoot)) {
    console.error('[check:evidence-freshness] missing evidence root')
    process.exit(1)
  }

  const profiles = loadProfiles()
  const components = readdirSync(evidenceRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  let fresh = 0
  let stale = 0
  let missingHash = 0
  let mandatoryStaleStable = 0
  const staleRows = []

  for (const name of components) {
    const contractPath = join(hardening, 'contracts', `${name}.json`)
    const contract = existsSync(contractPath) ? loadJson(contractPath) : null
    const mandatory = contract ? mandatoryGateIds(contract, profiles) : []
    const isStableClaim = contract?.maturity === 'stable'

    const manifestPath = join(evidenceRoot, name, 'manifest.json')
    if (existsSync(manifestPath)) {
      const r = checkEvidenceFreshness(hardening, name, 'manifest.json', root)
      if (r.stale) {
        stale += 1
        staleRows.push({ name, file: 'manifest.json', detail: r.detail, mandatory: false })
      } else if (r.hasHash) fresh += 1
      else missingHash += 1
    }

    for (const gate of EVIDENCE_GATES) {
      const file = `${gate}.json`
      const path = join(evidenceRoot, name, file)
      if (!existsSync(path)) continue
      const r = checkEvidenceFreshness(hardening, name, file, root)
      if (r.stale) {
        stale += 1
        const mandatoryStale = mandatory.includes(gate) && isStableClaim
        if (mandatoryStale) mandatoryStaleStable += 1
        staleRows.push({
          name,
          file,
          detail: r.detail,
          mandatory: mandatory.includes(gate),
          stableClaim: isStableClaim,
          blocking: mandatoryStale
        })
      } else if (r.hasHash) fresh += 1
      else missingHash += 1
    }
  }

  const summary = {
    components: components.length,
    fresh,
    stale,
    missingHash,
    mandatoryStaleStable,
    samples: staleRows.slice(0, 20)
  }

  console.log('[check:evidence-freshness]', JSON.stringify(summary, null, 2))

  if (mandatoryStaleStable > 0) {
    console.error(
      `[check:evidence-freshness] FAIL: ${mandatoryStaleStable} mandatory stale evidence row(s) on stable contracts`
    )
    process.exit(1)
  }
  process.exit(0)
}

main()
