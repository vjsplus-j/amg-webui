/**
 * Deep SSR + cleanup audit for packages/ public components.
 *
 * Usage: node scripts/hardening/ssr-cleanup-audit.mjs
 * Output: component-hardening/reports/ssr-cleanup-audit.json
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentDirRel } from '../component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')
const packagesRoot = join(root, 'packages')

const GLOBALS = [
  'window',
  'document',
  'localStorage',
  'navigator',
  'ResizeObserver',
  'MutationObserver',
  'IntersectionObserver',
  'matchMedia'
]

const GLOBAL_RE = new RegExp(
  `\\b(${GLOBALS.join('|')})\\b`
)

const GUARD_RE =
  /typeof\s+(?:window|document|localStorage|navigator|ResizeObserver|MutationObserver|IntersectionObserver|globalThis)\s*===|getWindow\s*\(|getDocument\s*\(|isClient|isServer|\/\/|\/\*|\*\/|import\s|export\s/

const LIFECYCLE_HOOK_RE =
  /\bon(?:Mounted|BeforeMount|Unmounted|BeforeUnmount|Updated|Activated|Deactivated)\s*\(/

const SETUP_INIT_RE =
  /\bref\s*\(\s*(?:window|document)\b|=>\s*(?:window|document)\b|\b(?:const|let|var)\s+\w+\s*=\s*(?:window|document)\b(?!\.)/

const SIDE_EFFECT_RE =
  /addEventListener|setInterval|setTimeout|new\s+(?:ResizeObserver|MutationObserver|IntersectionObserver|AbortController|Worker)\b|matchMedia\s*\(/

const CLEANUP_RE =
  /removeEventListener|clearInterval|clearTimeout|\.disconnect\s*\(|\.abort\s*\(|\.terminate\s*\(|onUnmounted|onBeforeUnmount|destroy\s*\(|teardown|dispose|unmount|\{\s*once:\s*true\s*\}/

/** Service-only public surfaces (MessageBox, Toast, …) */
const SERVICE_PUBLIC_FILES = ['service.ts', 'index.ts', 'types.ts']

function readInventory() {
  const path = join(hardening, 'inventory/component-inventory.json')
  if (!existsSync(path)) {
    throw new Error('Missing component-inventory.json — run hardening:generate first')
  }
  return JSON.parse(readFileSync(path, 'utf8'))
}

function listComponentFiles(compDirAbs) {
  if (!existsSync(compDirAbs)) return []
  const out = []
  const stack = [compDirAbs]
  while (stack.length) {
    const dir = stack.pop()
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name)
      const st = statSync(abs)
      if (st.isDirectory()) {
        if (name === 'node_modules' || name === '__tests__') continue
        stack.push(abs)
      } else if (/\.(vue|ts|tsx)$/.test(name) && !/\.(spec|test|d)\.ts$/.test(name)) {
        out.push(abs)
      }
    }
  }
  return out
}

function extractScriptBlocks(vueSource) {
  const blocks = []
  const re = /<script[^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(vueSource))) blocks.push(m[1])
  return blocks.length ? blocks : ['']
}

function stripComments(line) {
  let s = line
  const block = s.indexOf('/*')
  if (block >= 0) s = s.slice(0, block)
  const lineComment = s.indexOf('//')
  if (lineComment >= 0) s = s.slice(0, lineComment)
  return s.trim()
}

function trackDepth(line, depth) {
  let d = depth
  const stripped = stripComments(line)
  if (!stripped) return { depth: d, atModule: d === 0, stripped: '' }
  const open = (stripped.match(/[{([]/g) || []).length
  const close = (stripped.match(/[}\])]/g) || []).length
  const atModule = d === 0
  d += open - close
  if (d < 0) d = 0
  return { depth: d, atModule, stripped }
}

function isTypeOnlyLine(stripped) {
  return (
    /^(export\s+)?(type|interface)\s/.test(stripped) ||
    /:\s*(typeof\s+)?(window|document|Window|Document|Storage|Navigator|MediaQueryList|ResizeObserver|MutationObserver|IntersectionObserver|AbortController|Worker)\b/.test(
      stripped
    ) ||
    /<(typeof\s+)?(window|document|Window|Document)/.test(stripped)
  )
}

function auditSource(relPath, source, isVue) {
  const findings = []
  const chunks = isVue ? extractScriptBlocks(source) : [source]

  for (const chunk of chunks) {
    const lines = chunk.split(/\r?\n/)
    let depth = 0
    for (let i = 0; i < lines.length; i++) {
      const lineNo = i + 1
      const raw = lines[i]
      const { depth: nextDepth, atModule, stripped } = trackDepth(raw, depth)
      depth = nextDepth

      if (!stripped || isTypeOnlyLine(stripped)) continue
      if (!GLOBAL_RE.test(stripped)) continue
      if (GUARD_RE.test(stripped)) continue
      if (/^\s*(import|export)\s/.test(stripped)) continue
      if (LIFECYCLE_HOOK_RE.test(stripped)) continue

      const isSetupInit =
        SETUP_INIT_RE.test(stripped) ||
        (/\bref\s*\(\s*(?:window|document)\b/.test(stripped) && !GUARD_RE.test(stripped))

      if (atModule || isSetupInit) {
        findings.push({
          severity: 'P0',
          kind: isSetupInit ? 'setup-init-global' : 'module-scope-global',
          file: relPath,
          line: lineNo,
          snippet: stripped.slice(0, 160),
          detail: isSetupInit
            ? 'Unsafe browser global during setup/composable init (SSR render risk)'
            : 'Unsafe browser global at module scope (SSR import risk)'
        })
      }
    }
  }

  const code = isVue ? extractScriptBlocks(source).join('\n') : source
  const hasSideEffects = SIDE_EFFECT_RE.test(code)
  const hasCleanup = CLEANUP_RE.test(code)
  if (hasSideEffects && !hasCleanup) {
    findings.push({
      severity: 'P1',
      kind: 'missing-cleanup',
      file: relPath,
      line: null,
      snippet: null,
      detail: 'Side-effect APIs detected without obvious cleanup (onUnmounted/disconnect/abort/clear*)'
    })
  }

  return findings
}

function auditComponent(name, entry) {
  const relDir = componentDirRel(name)
  const absDir = join(root, relDir)
  const files = listComponentFiles(absDir)

  // Service-only public surfaces (MessageBox.service.ts, Toast service, …)
  if (!files.some((f) => f.endsWith('service.ts'))) {
    const servicePath = join(absDir, 'service.ts')
    if (existsSync(servicePath)) files.push(servicePath)
  }
  for (const name of SERVICE_PUBLIC_FILES) {
    const abs = join(absDir, name)
    if (existsSync(abs) && !files.includes(abs)) files.push(abs)
  }

  const componentFindings = []
  for (const abs of files) {
    const rel = relative(root, abs).replace(/\\/g, '/')
    const isVue = abs.endsWith('.vue')
    const source = readFileSync(abs, 'utf8')
    componentFindings.push(...auditSource(rel, source, isVue))
  }

  return {
    name,
    package: entry?.package ?? null,
    path: relDir,
    public: entry?.public !== false,
    filesScanned: files.length,
    findings: componentFindings
  }
}

function main() {
  const inventory = readInventory()
  const publicComponents = inventory.components.filter((c) => c.public && c.files?.exists)

  const results = []
  const allFindings = []

  for (const entry of publicComponents) {
    const row = auditComponent(entry.name, entry)
    results.push(row)
    for (const f of row.findings) {
      allFindings.push({ component: entry.name, ...f })
    }
  }

  const p0 = allFindings.filter((f) => f.severity === 'P0')
  const p1 = allFindings.filter((f) => f.severity === 'P1')

  const report = {
    summary: {
      generatedAt: new Date().toISOString(),
      scope: 'packages/ public components (inventory SSOT)',
      componentsScanned: results.length,
      filesScanned: results.reduce((n, r) => n + r.filesScanned, 0),
      p0Count: p0.length,
      p1Count: p1.length,
      p0Components: [...new Set(p0.map((f) => f.component))].sort(),
      p1Components: [...new Set(p1.map((f) => f.component))].sort(),
      note: 'P0 = module-scope browser global without guard; P1 = side effects without obvious cleanup'
    },
    findings: {
      P0: p0,
      P1: p1
    },
    components: results.map((r) => ({
      name: r.name,
      package: r.package,
      path: r.path,
      filesScanned: r.filesScanned,
      p0: r.findings.filter((f) => f.severity === 'P0').length,
      p1: r.findings.filter((f) => f.severity === 'P1').length
    }))
  }

  mkdirSync(join(hardening, 'reports'), { recursive: true })
  const outPath = join(hardening, 'reports/ssr-cleanup-audit.json')
  writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n')
  console.log(
    `[ssr-cleanup-audit] components=${report.summary.componentsScanned} P0=${p0.length} P1=${p1.length} → ${relative(root, outPath)}`
  )
}

main()
