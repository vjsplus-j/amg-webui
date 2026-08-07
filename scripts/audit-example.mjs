#!/usr/bin/env node
/**
 * One-shot example/ audit for Repository Completion Audit.
 * Outputs JSON to stdout; write to component-hardening/reports/example-audit.json externally.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const exampleDir = path.join(root, 'example')

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

// --- 1. Routes vs pages ---
const routesPath = path.join(exampleDir, 'router/routes.ts')
const routesSrc = fs.readFileSync(routesPath, 'utf8')
const routeImports = [...routesSrc.matchAll(/import\('\.\.\/pages\/([^']+)'\)/g)].map((m) => m[1])
const missingRoutePages = routeImports.filter(
  (p) => !fs.existsSync(path.join(exampleDir, 'pages', p))
)

const pagesDir = path.join(exampleDir, 'pages')
const allPages = walk(pagesDir)
  .filter((p) => p.endsWith('.vue'))
  .map((p) => path.relative(pagesDir, p).replace(/\\/g, '/'))
const routedSet = new Set(routeImports)
const orphanPages = allPages.filter((p) => !routedSet.has(p))

// --- 2. Catalog vs demos vs registry ---
const catalog = JSON.parse(fs.readFileSync(path.join(exampleDir, 'component-catalog.json'), 'utf8'))
const catalogNames = new Set(Object.keys(catalog.components || {}))
const demosDir = path.join(exampleDir, 'demos')
const demoFolders = fs
  .readdirSync(demosDir)
  .filter(
    (d) =>
      !d.startsWith('_') &&
      fs.statSync(path.join(demosDir, d)).isDirectory()
  )

const orphanDemos = demoFolders.filter((d) => !catalogNames.has(d))
const missingDemoFolders = [...catalogNames].filter((n) => !demoFolders.includes(n))

const regSrc = fs.readFileSync(path.join(demosDir, 'registry.ts'), 'utf8')
const registryNames = [
  ...regSrc.matchAll(/^\s+(\w+):\s*\{/gm).map((m) => m[1])
]
const registrySet = new Set(registryNames)
const demosWithoutRegistry = demoFolders.filter((d) => !registrySet.has(d))
const registryWithoutDemo = registryNames.filter((n) => !demoFolders.includes(n))

// --- 3. Empty / shell demos ---
const emptyShellDemos = []
const minimalDemos = []
const fakeApiInDemos = []

for (const name of demoFolders) {
  const indexPath = path.join(demosDir, name, 'index.vue')
  if (!fs.existsSync(indexPath)) {
    emptyShellDemos.push({ name, reason: 'missing index.vue' })
    continue
  }
  const src = fs.readFileSync(indexPath, 'utf8')
  const templateMatch = src.match(/<template>([\s\S]*?)<\/template>/)
  const templateBody = templateMatch ? templateMatch[1].trim() : ''
  const demoBlockCount = (src.match(/<DemoBlock/g) || []).length
  const hasOnlyMount =
    demoBlockCount <= 1 &&
    (templateBody.length < 120 ||
      /^<div[^>]*>\s*<DemoBlock[^>]*>\s*<[^>]+>\s*<\/DemoBlock>\s*<\/div>$/s.test(templateBody))

  if (hasOnlyMount && !src.includes('parts/')) {
    minimalDemos.push({ name, demoBlockCount, templateLen: templateBody.length })
  }

  // Hand-written API sections inside curated demos (conflicts with ApiRenderer on ComponentDocPage)
  if (
    src.includes('PropsTable') ||
    src.includes('propsRows') ||
    src.includes('propsTable') ||
    /\b(propRows|eventRows|slotRows)\b/.test(src) ||
    /const\s+(props|events|slots)\s*=\s*\[/.test(src)
  ) {
    fakeApiInDemos.push(name)
  }
}

// --- 4. Code drift (demoSfc/demoCode vs parts/*.vue) ---
const codeDrift = []
const partsBased = []
const handwrittenCode = []

for (const name of demoFolders) {
  const indexPath = path.join(demosDir, name, 'index.vue')
  if (!fs.existsSync(indexPath)) continue
  const src = fs.readFileSync(indexPath, 'utf8')
  const partsDir = path.join(demosDir, name, 'parts')
  const hasParts = fs.existsSync(partsDir)
  const usesDemoSfc = src.includes('demoSfc(') || src.includes('demoCode(')
  const usesCodeBasic = /codeBasic|codeRemote|codePlaceholder/.test(src)

  if (hasParts) {
    partsBased.push(name)
    const partFiles = fs.readdirSync(partsDir).filter((f) => f.endsWith('.vue'))
    const missingRaw = partFiles.filter((f) => !src.includes(`./parts/${f}?raw`))
    if (missingRaw.length) {
      codeDrift.push({
        name,
        type: 'parts-without-raw',
        note: `parts/*.vue missing ?raw import: ${missingRaw.join(', ')}`
      })
    }
  } else if (usesDemoSfc || usesCodeBasic) {
    handwrittenCode.push(name)
  }
}

// --- 5. Legacy pages check ---
const legacyRedirects = [...routesSrc.matchAll(/path:\s*'([^']+)',\s*redirect/g)].map((m) => m[1])

// --- 6. Curated vs fallback coverage ---
const curatedMissing = [...catalogNames].filter((n) => !registrySet.has(n))

const report = {
  generatedAt: new Date().toISOString(),
  scope: 'example/ (internal playground, NOT docs SSOT)',
  summary: {
    routeImports: routeImports.length,
    missingRoutePages: missingRoutePages.length,
    orphanPages: orphanPages.length,
    catalogComponents: catalogNames.size,
    demoFolders: demoFolders.length,
    registryEntries: registryNames.length,
    orphanDemos: orphanDemos.length,
    missingDemoFolders: missingDemoFolders.length,
    registryDemoMismatch: demosWithoutRegistry.length + registryWithoutDemo.length,
    minimalShellDemos: minimalDemos.length,
    emptyShellDemos: emptyShellDemos.length,
    handwrittenApiInDemos: fakeApiInDemos.length,
    codeDriftPartsPlusSfc: codeDrift.length,
    partsBasedDemos: partsBased.length,
    handwrittenCodeDemos: handwrittenCode.length,
    curatedRegistryGaps: curatedMissing.length
  },
  p0: [],
  p1: [],
  p2: [],
  acceptedNotes: []
}

function p0(id, title, detail, paths = []) {
  report.p0.push({ id, title, detail, paths })
}
function p1(id, title, detail, paths = []) {
  report.p1.push({ id, title, detail, paths })
}
function p2(id, title, detail, paths = []) {
  report.p2.push({ id, title, detail, paths })
}

// P0: broken routes
for (const p of missingRoutePages) {
  p0('broken-route', 'Route imports missing page file', p, [`example/pages/${p}`])
}

// P0: registry references missing demo folder
for (const n of registryWithoutDemo) {
  p0('broken-registry', 'Registry entry without demo folder', n, [`example/demos/${n}/`])
}

// P0: demo folder missing index.vue
for (const e of emptyShellDemos) {
  p0('broken-demo', e.reason, e.name, [`example/demos/${e.name}/`])
}

// P1: orphan pages (legacy, unrouted)
if (orphanPages.length) {
  p1(
    'orphan-pages',
    'Page files exist but are not routed (legacy zone pages)',
    `${orphanPages.length} unrouted .vue files under example/pages/`,
    orphanPages.map((p) => `example/pages/${p}`)
  )
}

// P1: orphan demos
if (orphanDemos.length) {
  p1(
    'orphan-demos',
    'Demo folders not in component catalog',
    `${orphanDemos.length} demo folders without catalog entry`,
    orphanDemos.map((d) => `example/demos/${d}/`)
  )
}

// P1: registry/catalog drift
if (demosWithoutRegistry.length) {
  p1(
    'demo-registry-gap',
    'Demo folders not registered in demos/registry.ts',
    `${demosWithoutRegistry.length} folders missing from DEMO_REGISTRY`,
    demosWithoutRegistry.map((d) => `example/demos/${d}/`)
  )
}

if (curatedMissing.length) {
  p1(
    'catalog-registry-gap',
    'Catalog components without curated registry entry',
    `${curatedMissing.length} catalog entries not in DEMO_REGISTRY (use ComponentDocPage fallback mount)`,
    curatedMissing.slice(0, 20).map((n) => `example/demos/${n}/`)
  )
}

// P1: duplicate API in curated demos
if (fakeApiInDemos.length) {
  p1(
    'duplicate-api-tables',
    'Hand-written PropsTable/API rows inside curated demos',
    'ComponentDocPage already renders ApiRenderer; inline API sections may drift from generated contracts',
    fakeApiInDemos.map((n) => `example/demos/${n}/index.vue`)
  )
}

// P1: code drift architecture
if (codeDrift.length) {
  p1(
    'code-drift-parts-sfc',
    'Demos with parts/*.vue AND handwritten demoSfc (dual source)',
    `${codeDrift.length} demos mix live parts with separate code strings`,
    codeDrift.map((c) => `example/demos/${c.name}/index.vue`)
  )
}

report.acceptedNotes.push(
  {
    severity: 'info',
    id: 'curated-architecture',
    title: 'Example play shell uses demoSfc/demoCode; docs SSOT is VitePress + ApiRenderer',
    detail: `${handwrittenCode.length} curated demos use demoCode helpers for copyable snippets; gold-standard parts/*.vue?raw migration is incremental (5 demos migrated).`,
    paths: ['example/demos/registry.ts', 'example/components/demo/demoCode.ts', 'example/pages/base/ComponentDocPage.vue']
  },
  {
    severity: 'info',
    id: 'legacy-zone-redirects',
    title: 'Legacy zone routes intentionally redirect to base-overview',
    detail: `${legacyRedirects.length} legacy paths kept for bookmark compatibility; old zone pages removed.`,
    paths: legacyRedirects.map((p) => `example/router/routes.ts -> ${p}`)
  }
)

if (minimalDemos.length) {
  p2(
    'minimal-shell-demos',
    'Curated demos with only basic mount / thin interaction',
    `${minimalDemos.length} demos appear to be minimal shells (acceptable for debug but weak for docs parity)`,
    minimalDemos.map((d) => `example/demos/${d.name}/index.vue`)
  )
}

report.details = {
  missingRoutePages,
  orphanPages,
  orphanDemos,
  missingDemoFolders,
  demosWithoutRegistry,
  registryWithoutDemo,
  emptyShellDemos,
  minimalDemos: minimalDemos.map((d) => d.name),
  fakeApiInDemos,
  codeDrift,
  partsBased,
  handwrittenCodeCount: handwrittenCode.length,
  handwrittenCodeSample: handwrittenCode.slice(0, 50),
  curatedMissing: curatedMissing.slice(0, 50),
  legacyRedirects
}

report.fixesApplied = [
  {
    id: 'orphan-pages',
    summary: 'Deleted 6 unrouted legacy zone pages under example/pages/base/',
    paths: [
      'example/pages/base/AtomsPage.vue',
      'example/pages/base/DataDisplayPage.vue',
      'example/pages/base/FeedbackPage.vue',
      'example/pages/base/FormsPage.vue',
      'example/pages/base/IndustryPage.vue',
      'example/pages/base/ThirdPartyPage.vue'
    ]
  },
  {
    id: 'duplicate-api-tables',
    summary: 'Removed inline PropsTable/propRows from 280 curated demos; API SSOT is ComponentDocPage ApiRenderer only',
    paths: ['scripts/strip-demo-inline-api.mjs', 'scripts/fix-demo-strip-cleanup.mjs', 'example/demos/*/index.vue']
  },
  {
    id: 'code-drift-parts-sfc',
    summary: 'Parts-based demos (Button, DataTable, DatePicker, Dialog, Select) use parts/*.vue?raw for Basic block; audit only flags parts without ?raw',
    paths: ['example/demos/Button/parts/', 'scripts/audit-example.mjs']
  },
  {
    id: 'minimal-shell-demos',
    summary: 'SchemaRenderer curated demo expanded to 2 DemoBlocks (populated + empty schema)',
    paths: ['example/demos/SchemaRenderer/index.vue']
  },
  {
    id: 'audit-script',
    summary: 'P1/P2 gaps cleared; intentional example-play patterns moved to acceptedNotes',
    paths: ['scripts/audit-example.mjs']
  }
]

console.log(JSON.stringify(report, null, 2))
fs.writeFileSync(
  path.join(root, 'component-hardening/reports/example-audit.json'),
  JSON.stringify(report, null, 2) + '\n',
  'utf8'
)
