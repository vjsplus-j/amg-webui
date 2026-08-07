/**
 * API contract audit scanner (AAPI-001…012).
 * Usage:
 *   node scripts/hardening/audit-api.mjs
 *   node scripts/hardening/audit-api.mjs Select
 *   node scripts/hardening/audit-api.mjs --family selection
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentDirRel, componentToPackage } from '../component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function loadJson(rel) {
  return JSON.parse(readFileSync(join(hardening, rel), 'utf8'))
}

function readCompSources(name) {
  const rel = componentDirRel(name)
  const abs = join(root, rel)
  const vuePath = existsSync(join(abs, 'index.vue'))
    ? join(abs, 'index.vue')
    : existsSync(join(abs, `${name}.vue`))
      ? join(abs, `${name}.vue`)
      : null
  const typesPath = existsSync(join(abs, 'types.ts')) ? join(abs, 'types.ts') : null
  return {
    rel,
    vue: vuePath ? readFileSync(vuePath, 'utf8') : '',
    types: typesPath ? readFileSync(typesPath, 'utf8') : '',
    hasVue: Boolean(vuePath),
    hasTypes: Boolean(typesPath)
  }
}

function extractInterfaceNames(types, suffix) {
  const re = new RegExp(
    `export\\s+(?:interface|type)\\s+(\\w*${suffix})\\b`,
    'g'
  )
  const out = []
  let m
  while ((m = re.exec(types))) out.push(m[1])
  return out
}

function extractTemplateSlots(vue) {
  const slots = new Set()
  // Provider slots: <slot>, <slot name="x">, <slot :name="`body-${…}`">
  for (const m of vue.matchAll(/<slot\b([^>]*)\/?>/g)) {
    const attrs = m[1] || ''
    const named = attrs.match(/\bname\s*=\s*(['"])([\w*-]+)\1/)
    if (named) {
      slots.add(named[2])
      continue
    }
    if (/\b:name\s*=|\bv-bind:name\s*=/.test(attrs)) {
      if (/body-\$\{|`body-|'body-|"body-/.test(attrs)) slots.add('body-*')
      continue
    }
    slots.add('default')
  }
  // Consumer shorthand (rare in library SFCs)
  let m
  const re = /#(default|[\w-]+)(?:\s|=|>|\/)/g
  while ((m = re.exec(vue))) slots.add(m[1])
  const re2 = /v-slot:([\w-]+)/g
  while ((m = re2.exec(vue))) slots.add(m[1])
  return [...slots]
}

function extractEmits(vue, types) {
  const fromDefine = []
  const defineMatch = vue.match(/defineEmits\s*(?:<[^>]+>)?\s*\(\s*\[([^\]]*)\]/s)
  if (defineMatch) {
    const inner = defineMatch[1]
    for (const m of inner.matchAll(/['"]([\w:-]+)['"]/g)) fromDefine.push(m[1])
  }
  const emitCalls = new Set()
  for (const m of vue.matchAll(/emit\(\s*['"]([\w:-]+)['"]/g)) emitCalls.add(m[1])
  const typeEmits = extractInterfaceNames(types, 'Emits')
  return { fromDefine, emitCalls: [...emitCalls], typeEmits }
}

function extractExpose(vue, types) {
  const hasDefineExpose = /defineExpose\s*\(/.test(vue)
  const typeExpose = extractInterfaceNames(types, 'Expose')
  const keys = []
  const block = vue.match(/defineExpose\s*\(\s*\{([^}]*)\}/s)
  if (block) {
    for (const m of block[1].matchAll(/(\w+)\s*[,(]/g)) keys.push(m[1])
  }
  return { hasDefineExpose, typeExpose, keys }
}

function extractModels(vue, types) {
  const models = []
  if (/modelValue|defineModel/.test(vue + types)) {
    models.push('modelValue')
  }
  for (const m of (vue + types).matchAll(/update:([\w]+)/g)) {
    if (!models.includes(m[1])) models.push(m[1])
  }
  return models
}

function status(ok, warn = false) {
  if (ok) return 'PASS'
  if (warn) return 'WARN'
  return 'FAIL'
}

function auditOne(name, contract, familyProfile) {
  const src = readCompSources(name)
  const propsTypes = extractInterfaceNames(src.types, 'Props')
  const slotsTypes = extractInterfaceNames(src.types, 'Slots')
  const instanceTypes = extractInterfaceNames(src.types, 'Instance')
  const emits = extractEmits(src.vue, src.types)
  const expose = extractExpose(src.vue, src.types)
  const templateSlots = extractTemplateSlots(src.vue)
  const models = extractModels(src.vue, src.types)

  const req = familyProfile || { required: [], requiredExpose: [], requiredSlots: [] }

  const checks = {
    props:
      contract.api.props === 'not-applicable'
        ? 'N/A'
        : status(propsTypes.length > 0 || /defineProps/.test(src.vue), !src.hasTypes),
    emits:
      contract.api.emits === 'not-applicable'
        ? 'N/A'
        : status(
            emits.typeEmits.length > 0 ||
              emits.fromDefine.length > 0 ||
              emits.emitCalls.length === 0,
            emits.emitCalls.length > 0 && emits.typeEmits.length === 0
          ),
    slots:
      contract.api.slots === 'not-applicable'
        ? 'N/A'
        : (() => {
            const required = [
              ...new Set([
                ...(contract.requiredSlots || []),
                ...(req.requiredSlots || [])
              ])
            ]
            const typedOrTemplate = slotsTypes.length > 0 || templateSlots.length > 0
            if (required.length > 0) {
              const missing = required.filter((slot) => {
                if (templateSlots.includes(slot)) return false
                // typed body-* covers dynamic
                if (slot.startsWith('body-') && templateSlots.includes('body-*')) return false
                // types-only still counts if Slots interface lists the name
                if (slotsTypes.length > 0) {
                  // detailed names come from template; types presence alone is insufficient for required
                }
                return true
              })
              // Prefer template presence for required slots
              const missingFinal = required.filter((slot) => {
                if (templateSlots.includes(slot)) return false
                if (slot.startsWith('body-') && templateSlots.includes('body-*')) return false
                if (slot === 'body-*' && templateSlots.some((s) => s.startsWith('body-')))
                  return false
                return true
              })
              return status(missingFinal.length === 0 && typedOrTemplate)
            }
            return status(
              slotsTypes.length > 0 || templateSlots.length === 0,
              templateSlots.length > 0 && slotsTypes.length === 0
            )
          })(),
    expose:
      contract.api.expose === 'not-applicable'
        ? 'N/A'
        : contract.api.expose === 'optional'
          ? status(true, expose.hasDefineExpose && expose.typeExpose.length === 0)
          : status(
              expose.hasDefineExpose &&
                (expose.typeExpose.length > 0 || expose.keys.length > 0),
              expose.hasDefineExpose
            ),
    models:
      contract.api.models === 'not-applicable'
        ? 'N/A'
        : contract.api.models === 'optional'
          ? 'PASS'
          : status(models.length > 0),
    instance:
      contract.api.instance === 'not-applicable'
        ? 'N/A'
        : contract.api.instance === 'optional'
          ? status(true, instanceTypes.length === 0)
          : status(instanceTypes.length > 0),
    service: contract.api.service === 'not-applicable' ? 'N/A' : 'WARN',
    context:
      contract.api.context === 'internal' || contract.api.context === 'not-applicable'
        ? 'PASS'
        : 'WARN',
    docsSync: 'WARN'
  }

  const slotDrift =
    templateSlots.length > 0 && slotsTypes.length === 0
      ? { templateSlots, declaredSlots: slotsTypes }
      : null
  const emitDrift =
    emits.emitCalls.some((e) => !emits.fromDefine.includes(e) && emits.typeEmits.length === 0)
      ? { emitCalls: emits.emitCalls, typed: emits.typeEmits }
      : null

  const values = Object.values(checks).filter((v) => v !== 'N/A')
  const pass = values.filter((v) => v === 'PASS').length
  const completeness = values.length ? Math.round((pass / values.length) * 100) : 0
  const hardFail = values.some((v) => v === 'FAIL')

  return {
    name,
    family: contract.family,
    checks,
    completeness,
    status: hardFail ? 'NOT_STABLE' : completeness >= 80 ? 'RC_CANDIDATE' : 'NOT_STABLE',
    details: {
      propsTypes,
      slotsTypes,
      instanceTypes,
      emits,
      expose,
      templateSlots,
      models,
      slotDrift,
      emitDrift,
      requiredExpose: req.requiredExpose,
      requiredSlots: req.requiredSlots
    }
  }
}

function main() {
  const args = process.argv.slice(2)
  const inventory = loadJson('inventory/component-inventory.json')
  const familyProfiles = loadJson('contracts/family-api-profiles.json')
  let names = inventory.components.map((c) => c.name)

  if (args[0] === '--family' && args[1]) {
    names = inventory.components
      .filter((c) => c.family === args[1])
      .map((c) => c.name)
  } else if (args[0] && !args[0].startsWith('-')) {
    names = [args[0]]
  }

  const results = []
  for (const name of names) {
    if (!componentToPackage.has(name)) {
      console.warn(`[audit:api] skip unknown ${name}`)
      continue
    }
    const contractPath = join(hardening, 'contracts', `${name}.json`)
    if (!existsSync(contractPath)) {
      results.push({
        name,
        status: 'NOT_STABLE',
        completeness: 0,
        checks: {},
        error: 'missing contract'
      })
      continue
    }
    const contract = JSON.parse(readFileSync(contractPath, 'utf8'))
    results.push(auditOne(name, contract, familyProfiles[contract.family]))
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    passLike: results.filter((r) => r.completeness >= 80).length,
    notStable: results.filter((r) => r.status === 'NOT_STABLE').length,
    avgCompleteness: results.length
      ? Math.round(
          results.reduce((s, r) => s + (r.completeness || 0), 0) / results.length
        )
      : 0,
    byFamily: {}
  }

  for (const r of results) {
    const f = r.family || 'unknown'
    if (!summary.byFamily[f]) summary.byFamily[f] = { count: 0, avg: 0, sum: 0 }
    summary.byFamily[f].count++
    summary.byFamily[f].sum += r.completeness || 0
  }
  for (const f of Object.keys(summary.byFamily)) {
    const b = summary.byFamily[f]
    b.avg = Math.round(b.sum / b.count)
    delete b.sum
  }

  const out = { summary, results }
  mkdirSync(join(hardening, 'reports'), { recursive: true })
  writeFileSync(
    join(hardening, 'reports/component-api-audit.json'),
    JSON.stringify(out, null, 2) + '\n',
    'utf8'
  )

  if (names.length === 1) {
    const r = results[0]
    console.log(`\n${r.name} API Contract\n`)
    for (const [k, v] of Object.entries(r.checks || {})) {
      console.log(`${k.padEnd(20)} ${v}`)
    }
    console.log(`\nAPI COMPLETENESS: ${r.completeness}%`)
    console.log(`STATUS: ${r.status}\n`)
  } else {
    console.log(
      `[audit:api] total=${summary.total} avg=${summary.avgCompleteness}% rcCandidates=${summary.passLike}`
    )
  }
}

main()
