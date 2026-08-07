/**
 * Compile-check core Docs Vue SFC examples extracted from markdown fences.
 *
 * Usage: node scripts/test-docs-code.mjs
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { toKebab } from '../build/shared.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'tests/docs-code-fixture/.generated')

/** P0 priority components that must have compilable basic usage fences. */
const CORE_DOCS = [
  'Button',
  'InputText',
  'Select',
  'Form',
  'DataTable',
  'Tree',
  'Dialog',
  'Drawer',
  'Tabs',
  'Menu',
  'Upload',
  'Pagination'
]

function extractVueFences(md) {
  const fences = []
  const re = /```vue\n([\s\S]*?)```/g
  let m
  while ((m = re.exec(md))) {
    fences.push(m[1].trim())
  }
  return fences
}

function main() {
  mkdirSync(outDir, { recursive: true })
  const failures = []
  let checked = 0

  for (const name of CORE_DOCS) {
    const docPath = join(root, 'docs/components', `${toKebab(name)}.md`)
    if (!existsSync(docPath)) {
      failures.push(`${name}: doc-missing`)
      continue
    }
    const fences = extractVueFences(readFileSync(docPath, 'utf8'))
    if (!fences.length) {
      failures.push(`${name}: no-vue-fence`)
      continue
    }

    fences.forEach((code, idx) => {
      checked += 1
      const file = join(outDir, `${name}-${idx}.vue`)
      writeFileSync(file, code + '\n', 'utf8')
      const { errors } = parseSfc(code, { filename: file })
      if (errors?.length) {
        failures.push(`${name}#${idx}: ${errors.map((e) => e.message || e).join('; ')}`)
      }
    })
  }

  // Optional vue-tsc over generated fixtures if tsconfig exists
  const tsconfig = join(root, 'tests/docs-code-fixture/tsconfig.json')
  if (existsSync(tsconfig) && failures.length === 0) {
    const r = spawnSync('npx', ['vue-tsc', '--noEmit', '-p', tsconfig], {
      cwd: root,
      encoding: 'utf8',
      shell: true
    })
    if (r.status !== 0) {
      failures.push(`vue-tsc:\n${r.stdout || ''}\n${r.stderr || ''}`)
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    checked,
    components: CORE_DOCS.length,
    status: failures.length ? 'FAIL' : 'PASS',
    failures
  }
  writeFileSync(
    join(root, 'component-hardening/reports/docs-code-validation.json'),
    JSON.stringify(report, null, 2) + '\n'
  )

  console.log(`[test:docs-code] checked=${checked} status=${report.status}`)
  if (failures.length) {
    for (const f of failures.slice(0, 20)) console.error(' ', f)
    process.exit(1)
  }
}

main()
