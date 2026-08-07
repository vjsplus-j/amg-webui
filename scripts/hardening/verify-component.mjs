/**
 * verify:component — single-component gate runner (HAR-001).
 *
 * Usage:
 *   node scripts/hardening/verify-component.mjs Button
 *   node scripts/hardening/verify-component.mjs --all
 *   node scripts/hardening/verify-component.mjs --batch B01
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentToPackage } from '../component-package-map.mjs'
import {
  checkCleanupHints,
  checkHardcodedColor,
  checkHardcodedCopy,
  checkPackageFiles,
  checkTopLevelDom,
  loadSources
} from './gate-checks.mjs'
import {
  evidenceCompleteForStable,
  loadEvidenceManifest,
  resolveEvidenceGate
} from './evidence.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function loadJson(rel) {
  return JSON.parse(readFileSync(join(hardening, rel), 'utf8'))
}

function gateResult(id, ok, detail = '', severity = 'mandatory', forcedStatus) {
  if (forcedStatus === 'N/A') {
    return { id, status: 'N/A', detail }
  }
  return {
    id,
    status: ok ? 'PASS' : severity === 'optional' ? 'WARN' : 'FAIL',
    detail
  }
}

function verifyOne(name, inventoryEntry, contract, profiles, opts = {}) {
  const strictEvidence = Boolean(opts.strictEvidence)
  const familyProfile = profiles[contract.gates ? null : null]
  const profileId =
    loadJson('inventory/component-family-map.json').families.find(
      (f) => f.id === contract.family
    )?.gateProfile || 'general'
  const profile = profiles[profileId] || profiles.general
  const src = loadSources(root, name)
  const gates = []

  const pkg = checkPackageFiles(src)
  gates.push(
    gateResult(
      'package',
      pkg.ok && pkg.hasTypes,
      pkg.ok
        ? `vue=${pkg.ok} types=${pkg.hasTypes} style=${pkg.hasStyle}`
        : 'missing component files',
      profile.gates.package || 'mandatory'
    )
  )

  gates.push(
    gateResult(
      'api-props',
      /Props/.test(src.types) || /defineProps/.test(src.vue),
      'Props interface or defineProps',
      profile.gates['api-props'] || 'mandatory'
    )
  )
  gates.push(
    gateResult(
      'api-emits',
      contract.api.emits === 'not-applicable' ||
        /Emits/.test(src.types) ||
        /defineEmits/.test(src.vue) ||
        !/emit\(/.test(src.vue),
      'Emits typed or none',
      profile.gates['api-emits'] || 'mandatory'
    )
  )
  gates.push(
    gateResult(
      'api-slots',
      contract.api.slots === 'not-applicable' ||
        /Slots/.test(src.types) ||
        true,
      'Slots contract present or N/A',
      profile.gates['api-slots'] || 'mandatory'
    )
  )

  const copy = checkHardcodedCopy(src)
  gates.push(
    gateResult(
      'i18n',
      copy.ok,
      copy.ok ? 'no hardcoded CJK literals' : `hits: ${copy.hits.join('; ')}`,
      profile.gates.i18n || 'mandatory'
    )
  )

  const color = checkHardcodedColor(src, src.rel)
  gates.push(
    gateResult(
      'tokens',
      color.ok,
      color.ok ? 'no raw hex/rgb in component scss' : `hits: ${color.hits.join(', ')}`,
      profile.gates.tokens || 'mandatory'
    )
  )

  const dom = checkTopLevelDom(src)

  const cleanup = checkCleanupHints(src)
  gates.push(
    gateResult(
      'cleanup',
      cleanup.ok,
      cleanup.note,
      profile.gates.cleanup || 'mandatory'
    )
  )

  const evidence = loadEvidenceManifest(hardening, name)

  // Evidence-backed harness gates (no silent structural PASS for mandatory)
  for (const harnessGate of [
    'behavior',
    'visual',
    'a11y',
    'keyboard',
    'theme',
    'rtl',
    'perf',
    'docs'
  ]) {
    const sev =
      profile.gates[harnessGate] ||
      contract.gates?.[harnessGate] ||
      (harnessGate === 'behavior' || harnessGate === 'docs' ? 'mandatory' : 'optional')
    if (sev === 'na') {
      gates.push(gateResult(harnessGate, true, 'not applicable', sev, 'N/A'))
      continue
    }
    const resolved = resolveEvidenceGate(evidence, harnessGate, sev)
    if (harnessGate === 'keyboard' && sev === 'mandatory' && !evidence.gates.keyboard?.present) {
      if (strictEvidence) {
        gates.push(
          gateResult(
            harnessGate,
            false,
            'missing evidence/keyboard.json (contract field alone is insufficient)',
            sev
          )
        )
      } else {
        gates.push(
          gateResult(
            harnessGate,
            true,
            'evidence pending (non-strict --all); blocks Stable',
            'optional'
          )
        )
      }
      continue
    }
    if (!strictEvidence && sev === 'mandatory' && !resolved.ok && resolved.detail.includes('missing evidence')) {
      gates.push(
        gateResult(
          harnessGate,
          true,
          `${resolved.detail} (non-strict --all; blocks Stable)`,
          'optional'
        )
      )
      continue
    }
    gates.push(
      gateResult(
        harnessGate,
        resolved.ok,
        resolved.detail,
        sev,
        resolved.status === 'N/A' ? 'N/A' : undefined
      )
    )
  }

  // SSR: structural top-level DOM + evidence when mandatory
  {
    const sev = profile.gates.ssr || 'mandatory'
    const resolved = resolveEvidenceGate(evidence, 'ssr', sev)
    if (sev === 'mandatory') {
      if (evidence.gates.ssr?.present) {
        gates.push(
          gateResult(
            'ssr',
            dom.ok && resolved.ok,
            `structural=${dom.ok ? 'PASS' : 'FAIL'}; evidence=${resolved.detail}`,
            sev
          )
        )
      } else if (strictEvidence) {
        gates.push(
          gateResult(
            'ssr',
            false,
            dom.ok
              ? 'missing evidence/ssr.json (structural OK alone insufficient for Stable path)'
              : `hits: ${dom.hits.join('; ')}`,
            sev
          )
        )
      } else {
        gates.push(
          gateResult(
            'ssr',
            dom.ok,
            dom.ok
              ? 'structural OK; evidence/ssr.json pending (blocks Stable)'
              : `hits: ${dom.hits.join('; ')}`,
            sev
          )
        )
      }
    } else {
      gates.push(gateResult('ssr', dom.ok, dom.ok ? 'structural OK' : `hits: ${dom.hits.join('; ')}`, sev))
    }
  }

  if (profile.gates.adapter === 'mandatory') {
    const hasAdapter = /adapter|Adapter|mock|Mock|MediaAdapter/.test(src.all)
    gates.push(
      gateResult(
        'adapter',
        strictEvidence ? hasAdapter : true,
        hasAdapter
          ? 'domain/media adapter symbols present'
          : strictEvidence
            ? 'domain/media adapter symbols required'
            : 'adapter evidence pending (non-strict; blocks Stable)',
        strictEvidence ? 'mandatory' : 'optional'
      )
    )
  }
  if (profile.gates.mock === 'mandatory') {
    const mockOk = evidence.gates.mock?.status === 'PASS' || /mock|Mock/.test(src.all)
    gates.push(
      gateResult(
        'mock',
        strictEvidence ? mockOk : true,
        mockOk
          ? 'mock policy present'
          : strictEvidence
            ? 'missing mock evidence'
            : 'mock evidence pending (non-strict; blocks Stable)',
        strictEvidence ? 'mandatory' : 'optional'
      )
    )
  }
  if (profile.gates['no-backend-dto'] === 'mandatory') {
    gates.push(
      gateResult('no-backend-dto', true, 'policy gate (manual contract)', 'mandatory')
    )
  }
  if (profile.gates.destroy === 'mandatory') {
    const hasDestroy =
      /destroy|dispose|onUnmounted/.test(src.all) ||
      (contract.requiredExpose || []).includes('destroy')
    gates.push(
      gateResult('destroy', hasDestroy, 'destroy/dispose lifecycle', 'mandatory')
    )
  }

  // Deduplicate: remove earlier structural-only ssr if we added evidence ssr
  const seen = new Set()
  const deduped = []
  for (const g of gates) {
    if (seen.has(g.id)) {
      // keep last (evidence-aware)
      const idx = deduped.findIndex((x) => x.id === g.id)
      if (idx >= 0) deduped[idx] = g
      continue
    }
    seen.add(g.id)
    deduped.push(g)
  }
  gates.length = 0
  gates.push(...deduped)

  const blocking = gates.filter((g) => g.status === 'FAIL')
  const passed = blocking.length === 0
  const mandatoryEvidenceIds = Object.entries({
    ...(profile.gates || {}),
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
  const evidenceOk = evidenceCompleteForStable(evidence, mandatoryEvidenceIds)
  const stable =
    passed &&
    evidenceOk &&
    contract.maturity === 'stable' &&
    contract.apiFreeze?.frozen === true

  return {
    name,
    family: contract.family,
    package: componentToPackage.get(name),
    profile: profileId,
    gates,
    failCount: blocking.length,
    status: passed ? 'PASS' : 'FAIL',
    stable: Boolean(stable),
    verifiedAt: new Date().toISOString()
  }
}

function main() {
  const args = process.argv.slice(2)
  const inventory = loadJson('inventory/component-inventory.json')
  const batches = loadJson('inventory/component-batches.json')
  const profiles = loadJson('gates/profiles/index.json')

  let names = []
  let strictEvidence =
    process.env.HARDENING_STRICT === '1' || args.includes('--strict')
  if (args.includes('--all')) {
    names = inventory.components.map((c) => c.name)
    if (!args.includes('--strict') && process.env.HARDENING_STRICT !== '1') {
      strictEvidence = false
    }
  } else if (args[0] === '--batch' && args[1]) {
    const batch = batches.batches.find((b) => b.id === args[1])
    if (!batch) {
      console.error(`Unknown batch ${args[1]}`)
      process.exit(1)
    }
    names = batch.components
    strictEvidence = true
  } else if (args[0] && !args[0].startsWith('-')) {
    names = args.filter((a) => !a.startsWith('-'))
    strictEvidence = true
  } else {
    console.error(
      'Usage: verify-component <Name...> | --all [--strict] | --batch B01'
    )
    process.exit(1)
  }

  const results = []
  for (const name of names) {
    const entry = inventory.components.find((c) => c.name === name)
    const contractPath = join(hardening, 'contracts', `${name}.json`)
    if (!existsSync(contractPath)) {
      results.push({
        name,
        status: 'FAIL',
        stable: false,
        failCount: 1,
        gates: [gateResult('package', false, 'missing contract')]
      })
      continue
    }
    const contract = JSON.parse(readFileSync(contractPath, 'utf8'))
    results.push(verifyOne(name, entry, contract, profiles, { strictEvidence }))
  }

  mkdirSync(join(hardening, 'gates/results'), { recursive: true })
  if (names.length === 1) {
    const r = results[0]
    writeFileSync(
      join(hardening, 'gates/results', `${r.name}.json`),
      JSON.stringify(r, null, 2) + '\n'
    )
    console.log(
      `[verify:component] ${r.name} ${r.status} stable=${r.stable} fails=${r.failCount} strict=${strictEvidence}`
    )
    for (const g of r.gates) {
      if (g.status !== 'PASS' && g.status !== 'N/A') {
        console.log(`  - ${g.id}: ${g.status} (${g.detail})`)
      }
    }
    process.exit(r.status === 'PASS' ? 0 : 1)
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    pass: results.filter((r) => r.status === 'PASS').length,
    fail: results.filter((r) => r.status === 'FAIL').length,
    stable: results.filter((r) => r.stable).length,
    strictEvidence
  }
  writeFileSync(
    join(hardening, 'gates/results/all.json'),
    JSON.stringify({ summary, results }, null, 2) + '\n'
  )
  for (const r of results) {
    writeFileSync(
      join(hardening, 'gates/results', `${r.name}.json`),
      JSON.stringify(r, null, 2) + '\n'
    )
  }
  console.log(
    `[verify:component] total=${summary.total} pass=${summary.pass} fail=${summary.fail} stable=${summary.stable} strict=${strictEvidence}`
  )
  process.exit(summary.fail > 0 ? 1 : 0)
}

main()
