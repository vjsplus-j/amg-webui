/**
 * Docs quality gate for P0 public component pages + metadata.
 *
 * Usage:
 *   node scripts/check-docs-quality.mjs
 *   node scripts/check-docs-quality.mjs --all
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toKebab } from '../build/shared.mjs'
import { FOUNDATION_PACKAGES, componentToPackage } from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const hardening = join(root, 'component-hardening')
const apiDir = join(root, 'generated/component-api')
const metaDir = join(root, 'component-metadata')
const docsDir = join(root, 'docs/components')

const checkAll = process.argv.includes('--all')
const PLACEHOLDER = /^(—|–|-|TODO|TBD|待补充|Lorem)$/i

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

/** Parse markdown table rows under a ### heading; return last-column placeholders. */
function findPlaceholderDescriptions(md, sectionName) {
  const sectionRe = new RegExp(`### ${sectionName}[\\s\\S]*?(?=\\n### |\\n## |$)`)
  const section = md.match(sectionRe)
  if (!section) return []

  const bad = []
  for (const line of section[0].split('\n')) {
    if (!/^\|/.test(line) || /^\|\s*[-:| ]+\|/.test(line)) continue
    if (/Prop \| 类型|事件 \| Payload|Slot \| Props|方法/.test(line)) continue
    // Split on | but keep cells; strip outer empties
    const cells = line.split('|').map((c) => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)
    if (cells.length < 2) continue
    const nameCell = cells[0]
    const descCell = cells[cells.length - 1]
    const name = nameCell.replace(/^`|`$/g, '')
    if (PLACEHOLDER.test(descCell.replace(/^`|`$/g, '').trim())) {
      bad.push(name)
    }
  }
  return bad
}

function checkDocPlaceholders(name, api) {
  const kebab = toKebab(name)
  const docPath = join(docsDir, `${kebab}.md`)
  if (!existsSync(docPath)) return { ok: false, issues: ['doc-missing'] }

  const md = readFileSync(docPath, 'utf8')
  const issues = []

  if (api?.props?.length) {
    const badProps = findPlaceholderDescriptions(md, 'Props')
    if (badProps.length) issues.push(`props-placeholder:${badProps.join(',')}`)
  }
  if (api?.events?.length) {
    const badEvents = findPlaceholderDescriptions(md, 'Events')
    if (badEvents.length) issues.push(`events-placeholder:${badEvents.join(',')}`)
  }

  const stableInDoc = /\*\*Stable\*\*/i.test(md) || /成熟度为 \*\*Stable\*\*/i.test(md)
  const contractPath = join(hardening, 'contracts', `${name}.json`)
  if (existsSync(contractPath)) {
    const contract = loadJson(contractPath)
    if (stableInDoc && contract.maturity !== 'stable') {
      issues.push(`maturity-stable-doc-vs-${contract.maturity}-contract`)
    }
  }

  if (/TODO|TBD|待补充|Lorem ipsum/i.test(md)) {
    issues.push('docs-todo-placeholder')
  }

  return { ok: issues.length === 0, issues }
}

function checkMetadata(name) {
  const metaPath = join(metaDir, `${name}.json`)
  if (!existsSync(metaPath)) return { ok: false, issues: ['metadata-missing'] }

  const meta = loadJson(metaPath)
  const issues = []
  if (!meta.summary?.trim()) issues.push('metadata-summary-empty')
  if (/generate-vitepress|本文档由/.test(meta.summary || '')) {
    issues.push('metadata-summary-boilerplate')
  }
  if (!Array.isArray(meta.features) || meta.features.length === 0) {
    issues.push('metadata-features-empty')
  }
  if (!meta.package) issues.push('metadata-package-missing')
  if (!meta.importPaths?.length) issues.push('metadata-importPaths-missing')
  return { ok: issues.length === 0, issues }
}

function main() {
  const inventory = loadJson(join(hardening, 'inventory/component-inventory.json'))
  let components = inventory.components.filter((c) => c.public)

  if (!checkAll) {
    components = components.filter((c) => FOUNDATION_PACKAGES.includes(c.package))
  }

  const failures = []

  for (const comp of components) {
    const name = comp.name
    let api = null
    const apiPath = join(apiDir, `${name}.json`)
    if (existsSync(apiPath)) api = loadJson(apiPath)

    const doc = checkDocPlaceholders(name, api)
    const meta = checkMetadata(name)
    const issues = [...doc.issues, ...meta.issues]

    if (issues.length) {
      failures.push({ name, package: comp.package || componentToPackage.get(name), issues })
    }
  }

  console.log(
    `[check:docs-quality] checked ${components.length} components (${checkAll ? 'all' : 'P0'})`
  )

  if (failures.length) {
    console.error(`[check:docs-quality] FAIL — ${failures.length} component(s)`)
    for (const f of failures.slice(0, 25)) {
      console.error(`  ${f.name}: ${f.issues.join('; ')}`)
    }
    if (failures.length > 25) {
      console.error(`  … and ${failures.length - 25} more`)
    }
    process.exit(1)
  }

  console.log('[check:docs-quality] PASS')
}

main()
