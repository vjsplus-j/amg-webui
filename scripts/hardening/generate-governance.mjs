/**
 * Phase 0–1 governance generator.
 * Produces inventory SSOT, family map, batches, gap report, maturity v4 scaffold,
 * contract schema, and gate profiles.
 *
 * Usage: node scripts/hardening/generate-governance.mjs
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  allMappedComponentNames,
  componentDirRel,
  componentToPackage,
  PACKAGE_COMPONENTS
} from '../component-package-map.mjs'
import { BATCH_DEFS, FAMILIES, resolveFamily } from './families.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const outRoot = join(root, 'component-hardening')

function ensureDir(p) {
  mkdirSync(p, { recursive: true })
}

function writeJson(rel, data) {
  const abs = join(outRoot, rel)
  ensureDir(dirname(abs))
  writeFileSync(abs, JSON.stringify(data, null, 2) + '\n', 'utf8')
  return abs
}

function hasFile(compDir, name) {
  return existsSync(join(root, compDir, name))
}

function detectCapability(name, pkg, files) {
  if (['gb28181', 'onvif', 'media', 'lowcode', 'charts', 'editor'].includes(pkg)) {
    return 'composite'
  }
  if (['form', 'data', 'overlay'].includes(pkg)) return 'interaction'
  if (FAMILY_INPUT_LIKE.has(name)) return 'form'
  return 'thin'
}

const FAMILY_INPUT_LIKE = new Set([
  'InputText',
  'Textarea',
  'Password',
  'InputNumber',
  'InputOTP',
  'Select',
  'Checkbox',
  'Radio',
  'Switch',
  'DatePicker',
  'TimePicker',
  'Cascader',
  'TreeSelect',
  'Slider',
  'Rate',
  'Transfer',
  'Mention',
  'AutoComplete',
  'ColorPicker'
])

/** Maturity v4: capability decoupled from maturity; score never implies stable. */
function scoreMaturityV4(entry, files) {
  let depth = 0
  if (files.hasTypes) depth += 2
  if (files.hasStyle) depth += 1
  if (files.hasVue) depth += 2
  if (files.lineCount > 80) depth += 1
  if (files.lineCount > 200) depth += 1
  if (files.hasExpose) depth += 1
  if (files.hasSlotsType) depth += 1

  let maturity = 'draft'
  if (depth <= 3) maturity = 'draft'
  else if (depth <= 5) maturity = 'draft'
  else if (depth <= 7) maturity = 'beta'
  else maturity = 'rc'

  // Never assign stable from score alone
  return {
    capability: entry.capability,
    maturity,
    depthScore: depth,
    stableEligible: false,
    note: 'Stable requires verify:component mandatory gates + evidence — never inferred from depthScore'
  }
}

function scanComponent(name) {
  const pkg = componentToPackage.get(name)
  const rel = componentDirRel(name)
  const abs = join(root, rel)
  const exists = existsSync(abs)
  let lineCount = 0
  let hasVue = false
  let hasTypes = false
  let hasStyle = false
  let hasExpose = false
  let hasSlotsType = false
  let source = ''

  if (exists) {
    hasVue =
      hasFile(rel, 'index.vue') ||
      hasFile(rel, `${name}.vue`) ||
      hasFile(rel, `${name}Host.vue`) ||
      hasFile(rel, 'service.ts')
    hasTypes = hasFile(rel, 'types.ts')
    hasStyle =
      hasFile(rel, 'style.scss') ||
      hasFile(rel, 'index.scss') ||
      hasFile(rel, `${name}.scss`)
    const vuePath = hasFile(rel, 'index.vue')
      ? join(abs, 'index.vue')
      : hasFile(rel, `${name}.vue`)
        ? join(abs, `${name}.vue`)
        : hasFile(rel, `${name}Host.vue`)
          ? join(abs, `${name}Host.vue`)
          : null
    const typesPath = hasTypes ? join(abs, 'types.ts') : null
    if (vuePath) {
      source = readFileSync(vuePath, 'utf8')
      lineCount += source.split(/\r?\n/).length
      hasExpose = /defineExpose\s*\(/.test(source)
    }
    if (typesPath) {
      const t = readFileSync(typesPath, 'utf8')
      lineCount += t.split(/\r?\n/).length
      hasSlotsType = /Slots\s*=|interface\s+\w+Slots/.test(t)
      hasExpose = hasExpose || /Expose\s*=|interface\s+\w+Expose/.test(t)
    }
  }

  const family = resolveFamily(name, pkg)
  const publicExport = pkg !== 'business'
  const capability = detectCapability(name, pkg, {})

  const files = {
    hasVue,
    hasTypes,
    hasStyle,
    hasExpose,
    hasSlotsType,
    lineCount,
    exists
  }

  const entry = {
    name,
    package: pkg,
    path: rel,
    family,
    public: publicExport,
    capability,
    deprecated: false,
    mergeInto: null,
    batch: null
  }

  const maturity = scoreMaturityV4(entry, files)

  return {
    ...entry,
    ...maturity,
    files: {
      vue: files.hasVue,
      types: files.hasTypes,
      style: files.hasStyle,
      exposeHint: files.hasExpose,
      slotsTypeHint: files.hasSlotsType,
      lineCount: files.lineCount,
      exists: files.exists
    }
  }
}

function buildInventory() {
  const names = allMappedComponentNames()
  const components = names.map(scanComponent)

  // Assign batches
  const batchOf = new Map()
  for (const b of BATCH_DEFS) {
    for (const c of b.components) batchOf.set(c, b.id)
  }
  // Remainder buckets by family
  const remainderByFamily = new Map()
  for (const c of components) {
    if (batchOf.has(c.name)) {
      c.batch = batchOf.get(c.name)
    } else {
      const list = remainderByFamily.get(c.family) || []
      list.push(c.name)
      remainderByFamily.set(c.family, list)
    }
  }

  // Extra batches for remainder (BxxR)
  const extraBatches = []
  let extraIdx = 1
  for (const [family, list] of [...remainderByFamily.entries()].sort()) {
    for (let i = 0; i < list.length; i += 10) {
      const chunk = list.slice(i, i + 10)
      const id = `B${String(25 + extraIdx - 1).padStart(2, '0')}R`
      extraBatches.push({
        id,
        family,
        title: `${FAMILIES[family]?.label || family} Remainder ${extraIdx}`,
        priority: 'P2',
        components: chunk,
        remainder: true
      })
      for (const name of chunk) {
        const comp = components.find((x) => x.name === name)
        if (comp) comp.batch = id
      }
      extraIdx++
    }
  }

  return { components, extraBatches }
}

function buildGapReport(components) {
  const target = 300
  const actual = components.length
  const missingDirs = components.filter((c) => !c.files.exists).map((c) => c.name)
  const thinShell = components.filter((c) => c.maturity === 'draft')
  const byFamily = {}
  for (const c of components) {
    byFamily[c.family] = (byFamily[c.family] || 0) + 1
  }

  const mergeCandidates = []
  // Near-duplicate modal shells
  const modalGroup = components.filter((c) =>
    /Modal$|ConfirmDialog|MessageBox/.test(c.name)
  )
  if (modalGroup.length > 3) {
    mergeCandidates.push({
      kind: 'overlay-modals',
      recommendation: 'Keep Dialog + MessageBox as public; treat *Modal as thin wrappers or deprecate duplicates after API freeze',
      components: modalGroup.map((c) => c.name)
    })
  }

  const deprecateCandidates = components
    .filter((c) => c.maturity === 'draft' && c.files.lineCount < 40)
    .map((c) => c.name)
    .slice(0, 20)

  return {
    generatedAt: new Date().toISOString(),
    target,
    actual,
    delta: actual - target,
    policy: 'Do NOT invent low-value components to hit 300. Prefer merge/deprecate over create.',
    missingDirs,
    familyCounts: byFamily,
    thinOrShellCount: thinShell.length,
    mergeCandidates,
    deprecateCandidates,
    verdict:
      actual < target
        ? `Inventory ${actual} < target ${target}. Gap of ${target - actual} is acceptable; fill only with real product needs.`
        : `Inventory ${actual} meets or exceeds target ${target}.`
  }
}

function buildContractSchema() {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://amg-webui.local/schemas/component-contract.json',
    title: 'AMG-WebUI Component Contract',
    type: 'object',
    required: ['name', 'family', 'maturity', 'api', 'gates'],
    properties: {
      name: { type: 'string' },
      family: { type: 'string' },
      package: { type: 'string' },
      maturity: {
        type: 'string',
        enum: ['draft', 'beta', 'rc', 'stable', 'experimental', 'deprecated']
      },
      capability: {
        type: 'string',
        enum: ['thin', 'form', 'interaction', 'composite']
      },
      api: {
        type: 'object',
        properties: {
          props: { enum: ['required', 'optional', 'not-applicable'] },
          emits: { enum: ['required', 'optional', 'not-applicable'] },
          slots: { enum: ['required', 'optional', 'not-applicable'] },
          expose: { enum: ['required', 'optional', 'not-applicable'] },
          models: { enum: ['required', 'optional', 'not-applicable'] },
          instance: { enum: ['required', 'optional', 'not-applicable'] },
          service: { enum: ['required', 'optional', 'not-applicable'] },
          context: { enum: ['internal', 'public', 'not-applicable'] }
        },
        required: ['props', 'emits', 'slots']
      },
      requiredExpose: { type: 'array', items: { type: 'string' } },
      requiredSlots: { type: 'array', items: { type: 'string' } },
      models: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string' },
            clearValue: {},
            notes: { type: 'string' }
          },
          required: ['name', 'type']
        }
      },
      behavioralContract: {
        type: 'object',
        additionalProperties: { type: 'string' }
      },
      states: {
        type: 'array',
        items: { type: 'string' }
      },
      keyboard: {
        type: 'array',
        items: { type: 'string' }
      },
      gates: {
        type: 'object',
        additionalProperties: {
          type: 'string',
          enum: ['mandatory', 'optional', 'na']
        }
      },
      apiFreeze: {
        type: 'object',
        properties: {
          version: { type: 'string' },
          frozen: { type: 'boolean' },
          frozenAt: { type: ['string', 'null'] }
        }
      }
    }
  }
}

function buildGateProfiles() {
  const base = {
    'api-props': 'mandatory',
    'api-emits': 'mandatory',
    'api-slots': 'mandatory',
    'api-docs': 'mandatory',
    package: 'mandatory',
    ssr: 'mandatory',
    cleanup: 'mandatory',
    tokens: 'mandatory',
    i18n: 'mandatory',
    visual: 'optional',
    a11y: 'optional',
    keyboard: 'optional',
    perf: 'na',
    theme: 'optional',
    rtl: 'optional'
  }

  return {
    general: { id: 'general', gates: { ...base, a11y: 'mandatory', visual: 'mandatory' } },
    form: {
      id: 'form',
      gates: {
        ...base,
        a11y: 'mandatory',
        keyboard: 'mandatory',
        visual: 'mandatory',
        'form-contract': 'mandatory',
        ime: 'optional'
      }
    },
    overlay: {
      id: 'overlay',
      gates: {
        ...base,
        a11y: 'mandatory',
        keyboard: 'mandatory',
        visual: 'mandatory',
        focus: 'mandatory',
        escape: 'mandatory',
        'scroll-lock': 'mandatory'
      }
    },
    data: {
      id: 'data',
      gates: {
        ...base,
        a11y: 'mandatory',
        keyboard: 'mandatory',
        visual: 'mandatory',
        virtual: 'optional',
        perf: 'optional'
      }
    },
    media: {
      id: 'media',
      gates: {
        ...base,
        a11y: 'optional',
        visual: 'optional',
        adapter: 'mandatory',
        destroy: 'mandatory',
        mock: 'mandatory'
      }
    },
    domain: {
      id: 'domain',
      gates: {
        ...base,
        a11y: 'optional',
        visual: 'optional',
        adapter: 'mandatory',
        mock: 'mandatory',
        'no-backend-dto': 'mandatory'
      }
    }
  }
}

function familyApiProfile(familyId) {
  const profiles = {
    foundation: {
      required: ['props', 'emits', 'slots'],
      optional: ['expose'],
      requiredExpose: [],
      requiredSlots: ['default']
    },
    input: {
      required: ['props', 'emits', 'slots', 'expose', 'models'],
      optional: ['instance'],
      requiredExpose: ['focus', 'blur'],
      requiredSlots: ['default', 'prefix', 'suffix']
    },
    selection: {
      required: ['props', 'emits', 'slots', 'expose', 'models'],
      optional: ['instance'],
      requiredExpose: ['focus', 'blur', 'open', 'close', 'clear'],
      requiredSlots: ['default', 'option', 'empty', 'loading']
    },
    datetime: {
      required: ['props', 'emits', 'slots', 'expose', 'models'],
      optional: ['instance'],
      requiredExpose: ['focus', 'blur', 'open', 'close'],
      requiredSlots: ['default']
    },
    form: {
      required: ['props', 'emits', 'slots', 'expose', 'context'],
      optional: ['instance'],
      requiredExpose: ['validate', 'resetFields', 'clearValidate'],
      requiredSlots: ['default']
    },
    overlay: {
      required: ['props', 'emits', 'slots', 'expose', 'models'],
      optional: ['instance'],
      requiredExpose: ['open', 'close'],
      requiredSlots: ['default', 'header', 'footer']
    },
    feedback: {
      required: ['props', 'emits', 'slots'],
      optional: ['service', 'expose'],
      requiredExpose: [],
      requiredSlots: ['default']
    },
    navigation: {
      required: ['props', 'emits', 'slots'],
      optional: ['expose', 'models'],
      requiredExpose: [],
      requiredSlots: ['default']
    },
    layout: {
      required: ['props', 'slots'],
      optional: ['emits'],
      requiredExpose: [],
      requiredSlots: ['default']
    },
    tree: {
      required: ['props', 'emits', 'slots', 'expose', 'models'],
      optional: ['instance'],
      requiredExpose: ['getNode', 'filter', 'scrollTo'],
      requiredSlots: ['default', 'node']
    },
    table: {
      required: ['props', 'emits', 'slots', 'expose'],
      optional: ['models', 'instance'],
      requiredExpose: ['scrollTo'],
      requiredSlots: ['empty', 'loading']
    },
    upload: {
      required: ['props', 'emits', 'slots', 'expose'],
      optional: ['models'],
      requiredExpose: ['clear', 'abort'],
      requiredSlots: ['default']
    },
    editor: {
      required: ['props', 'emits', 'slots', 'expose', 'models'],
      optional: ['instance'],
      requiredExpose: ['focus', 'blur'],
      requiredSlots: ['default']
    },
    charts: {
      required: ['props', 'emits'],
      optional: ['slots', 'expose'],
      requiredExpose: ['resize'],
      requiredSlots: []
    },
    lowcode: {
      required: ['props', 'emits', 'slots'],
      optional: ['expose'],
      requiredExpose: [],
      requiredSlots: ['default']
    },
    media: {
      required: ['props', 'emits', 'expose'],
      optional: ['slots', 'models'],
      requiredExpose: ['destroy'],
      requiredSlots: []
    },
    gb28181: {
      required: ['props', 'emits'],
      optional: ['slots', 'expose'],
      requiredExpose: [],
      requiredSlots: []
    },
    onvif: {
      required: ['props', 'emits'],
      optional: ['slots', 'expose'],
      requiredExpose: [],
      requiredSlots: []
    },
    vcr: {
      required: ['props', 'emits', 'expose'],
      optional: ['slots'],
      requiredExpose: ['destroy'],
      requiredSlots: []
    },
    special: {
      required: ['props'],
      optional: ['emits', 'slots'],
      requiredExpose: [],
      requiredSlots: []
    }
  }
  return profiles[familyId] || profiles.foundation
}

function defaultContract(comp, gateProfiles) {
  const family = FAMILIES[comp.family]
  const apiProfile = familyApiProfile(comp.family)
  const profile = gateProfiles[family?.gateProfile || 'general']
  const serviceComponents = new Set([
    'Message',
    'Toast',
    'Notification',
    'Confirm',
    'Loading',
    'MessageBox'
  ])

  const api = {
    props: apiProfile.required.includes('props') ? 'required' : 'optional',
    emits: apiProfile.required.includes('emits') ? 'required' : 'optional',
    slots: apiProfile.required.includes('slots') ? 'required' : 'optional',
    expose: apiProfile.required.includes('expose')
      ? 'required'
      : apiProfile.optional.includes('expose')
        ? 'optional'
        : 'not-applicable',
    models: apiProfile.required.includes('models')
      ? 'required'
      : apiProfile.optional.includes('models')
        ? 'optional'
        : 'not-applicable',
    instance: apiProfile.required.includes('instance')
      ? 'required'
      : apiProfile.optional.includes('instance')
        ? 'optional'
        : 'not-applicable',
    service: serviceComponents.has(comp.name) ? 'required' : 'not-applicable',
    context: apiProfile.required.includes('context')
      ? 'public'
      : 'internal'
  }

  return {
    name: comp.name,
    family: comp.family,
    package: comp.package,
    capability: comp.capability,
    maturity: 'beta',
    batch: comp.batch,
    api,
    requiredExpose: apiProfile.requiredExpose,
    requiredSlots: apiProfile.requiredSlots,
    models: [],
    behavioralContract: {
      disabled: 'Interactive actions no-op when disabled',
      unmount: 'Listeners, timers, observers, and abort controllers must be released'
    },
    states: ['default', 'disabled'],
    keyboard: [],
    gates: profile.gates,
    apiFreeze: {
      version: '0',
      frozen: false,
      frozenAt: null
    },
    generated: true,
    generatedAt: new Date().toISOString()
  }
}

function main() {
  ensureDir(outRoot)
  const { components, extraBatches } = buildInventory()

  const inventory = {
    version: 1,
    generatedAt: new Date().toISOString(),
    target: 300,
    total: components.length,
    publicCount: components.filter((c) => c.public).length,
    source: {
      packageMap: 'scripts/component-package-map.mjs',
      note: 'Single inventory SSOT for hardening; catalog/maturity/dashboard must read this file'
    },
    components
  }
  writeJson('inventory/component-inventory.json', inventory)

  const familyMap = {
    version: 1,
    generatedAt: new Date().toISOString(),
    families: Object.values(FAMILIES),
    coverage: {
      public: components.filter((c) => c.public).length,
      mapped: components.filter((c) => c.family).length,
      unmapped: components.filter((c) => !c.family).map((c) => c.name)
    },
    byFamily: Object.fromEntries(
      Object.keys(FAMILIES).map((id) => [
        id,
        components.filter((c) => c.family === id).map((c) => c.name)
      ])
    ),
    componentFamily: Object.fromEntries(components.map((c) => [c.name, c.family]))
  }
  writeJson('inventory/component-family-map.json', familyMap)

  const batches = {
    version: 1,
    generatedAt: new Date().toISOString(),
    rule: 'Each batch 6–12 same-family components where possible',
    batches: [...BATCH_DEFS, ...extraBatches]
  }
  writeJson('inventory/component-batches.json', batches)

  const gap = buildGapReport(components)
  writeJson('inventory/gap-report.json', gap)
  writeFileSync(
    join(outRoot, 'reports/gap-report.md'),
    [
      '# Component Inventory Gap Report',
      '',
      `- Target: ${gap.target}`,
      `- Actual: ${gap.actual}`,
      `- Delta: ${gap.delta}`,
      `- Policy: ${gap.policy}`,
      `- Verdict: ${gap.verdict}`,
      '',
      '## Family counts',
      ...Object.entries(gap.familyCounts).map(([k, v]) => `- ${k}: ${v}`),
      '',
      '## Merge candidates',
      ...gap.mergeCandidates.map(
        (m) => `- ${m.kind}: ${m.recommendation} (${m.components.join(', ')})`
      ),
      '',
      '## Deprecate review list (stubs)',
      ...gap.deprecateCandidates.map((n) => `- ${n}`),
      ''
    ].join('\n'),
    'utf8'
  )

  const maturityV4 = {
    version: 4,
    generatedAt: new Date().toISOString(),
    contract:
      'Capability and maturity are decoupled. depthScore never promotes Stable. Stable only via verify:component gates.',
    summary: {
      draft: components.filter((c) => c.maturity === 'draft').length,
      beta: components.filter((c) => c.maturity === 'beta').length,
      rc: components.filter((c) => c.maturity === 'rc').length,
      stable: components.filter((c) => c.maturity === 'stable').length
    },
    components: Object.fromEntries(
      components.map((c) => [
        c.name,
        {
          capability: c.capability,
          maturity: c.maturity,
          depthScore: c.depthScore,
          stableEligible: false,
          family: c.family,
          batch: c.batch
        }
      ])
    )
  }
  writeJson('inventory/component-maturity-v4.json', maturityV4)

  writeJson('contracts/schema.json', buildContractSchema())

  const gateProfiles = buildGateProfiles()
  writeJson('gates/profiles/index.json', gateProfiles)
  for (const [id, profile] of Object.entries(gateProfiles)) {
    writeJson(`gates/profiles/${id}.json`, profile)
  }

  const familyProfiles = Object.fromEntries(
    Object.keys(FAMILIES).map((id) => [id, familyApiProfile(id)])
  )
  writeJson('contracts/family-api-profiles.json', familyProfiles)

  // Seed contracts for all components (do not clobber frozen / hand-enriched)
  let contractCount = 0
  let skipped = 0
  for (const comp of components) {
    const rel = `contracts/${comp.name}.json`
    const abs = join(outRoot, rel)
    if (existsSync(abs)) {
      try {
        const prev = JSON.parse(readFileSync(abs, 'utf8'))
        if (prev.apiFreeze?.frozen || prev.generated === false || prev.template) {
          // keep enrichment; only refresh batch/family if missing
          if (!prev.batch && comp.batch) {
            prev.batch = comp.batch
            writeJson(rel, prev)
          }
          skipped++
          continue
        }
      } catch {
        /* rewrite */
      }
    }
    const contract = defaultContract(comp, gateProfiles)
    writeJson(rel, contract)
    contractCount++
  }

  writeFileSync(
    join(outRoot, 'README.md'),
    [
      '# Component Hardening SSOT',
      '',
      'Generated by `npm run hardening:generate`.',
      '',
      '- `inventory/` — unique component inventory, family map, batches, maturity v4, gap report',
      '- `contracts/` — per-component API contracts + schema + family API profiles',
      '- `gates/` — gate profiles and results',
      '- `dashboard/` — aggregate metrics',
      '- `reports/` — a11y/ssr/visual/benchmark/stable reports',
      '',
      `Public components: ${inventory.publicCount} / total ${inventory.total}`,
      `Contracts written: ${contractCount} (skipped frozen/enriched: ${skipped})`,
      ''
    ].join('\n'),
    'utf8'
  )

  console.log(
    `[hardening:generate] inventory=${inventory.total} contractsWritten=${contractCount} skipped=${skipped} families=${Object.keys(FAMILIES).length} batches=${batches.batches.length}`
  )
}

main()
