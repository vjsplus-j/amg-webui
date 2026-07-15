/**
 * Generate full Lucide icon set + official category catalog for @amg-webui/icons.
 *
 * Usage: node scripts/generate-icon-catalog.mjs
 *
 * Sources:
 * - Icon components: @lucide/vue
 * - Categories: https://lucide.dev/api/categories  (kebab → category ids)
 * - Tags / keywords: lucide-static tags.json
 * - Category titles: Lucide docs categoriesData.json
 *
 * Writes: packages/icons/{types,names,catalog,lucideRegistry,named}.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'packages/icons')
const metaDir = path.join(root, 'scripts/lucide-meta')

/** Official Lucide browse category order (lucide.dev) */
const CATEGORY_IDS = [
  'accessibility',
  'account',
  'animals',
  'arrows',
  'buildings',
  'charts',
  'communication',
  'connectivity',
  'cursors',
  'design',
  'development',
  'devices',
  'emoji',
  'files',
  'finance',
  'food-beverage',
  'gaming',
  'home',
  'layout',
  'mail',
  'math',
  'medical',
  'multimedia',
  'nature',
  'navigation',
  'notifications',
  'people',
  'photography',
  'science',
  'seasons',
  'security',
  'shapes',
  'shopping',
  'social',
  'sports',
  'sustainability',
  'text',
  'time',
  'tools',
  'transportation',
  'travel',
  'weather'
]

/** Existing aliases kept for Button / shell / docs compatibility */
const ALIASES = {
  AlertCircle: 'CircleAlert',
  AlertTriangle: 'TriangleAlert',
  Audio: 'Music',
  CaretDown: 'ChevronDown',
  CaretUp: 'ChevronUp',
  CheckCircle: 'CircleCheck',
  CircleHelp: 'CircleQuestionMark',
  Clear: 'Eraser',
  Collapse: 'Minimize2',
  Edit: 'SquarePen',
  Expand: 'Maximize2',
  Export: 'FileUp',
  Filter: 'Funnel',
  FirstPage: 'ChevronsLeft',
  Help: 'CircleQuestionMark',
  HelpCircle: 'CircleQuestionMark',
  Import: 'FileDown',
  LastPage: 'ChevronsRight',
  Layout: 'LayoutTemplate',
  Loader: 'LoaderCircle',
  Loader2: 'LoaderCircle',
  MoreHorizontal: 'Ellipsis',
  Paste: 'ClipboardPaste',
  Refresh: 'RefreshCw',
  Reset: 'RotateCcw',
  Sliders: 'SlidersHorizontal',
  Table: 'Table2',
  Trash: 'Trash2',
  Unlock: 'LockOpen',
  Video: 'Film',
  Wait: 'Clock',
  XCircle: 'CircleX'
}

/** Lucide glyphs whose PascalCase clashes with common Vue identifiers */
const IMPORT_RENAMES = {
  Component: 'LucideComponent'
}

function kebabToPascal(kebab) {
  return kebab
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

function pascalToKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .replace(/(\d)([a-zA-Z])/g, '$1-$2')
    .toLowerCase()
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.json()
}

function writeCache(name, data) {
  fs.mkdirSync(metaDir, { recursive: true })
  fs.writeFileSync(path.join(metaDir, name), JSON.stringify(data), 'utf8')
}

function readCache(name) {
  const p = path.join(metaDir, name)
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

async function loadCategoriesMap() {
  try {
    const data = await fetchJson('https://lucide.dev/api/categories')
    writeCache('categories.json', data)
    return data
  } catch (err) {
    const cached = readCache('categories.json')
    if (cached) {
      console.warn('[icons] categories API failed, using cache:', err.message)
      return cached
    }
    throw err
  }
}

async function loadTagsMap() {
  try {
    const data = await fetchJson('https://cdn.jsdelivr.net/npm/lucide-static@1.24.0/tags.json')
    writeCache('tags.json', data)
    return data
  } catch (err) {
    try {
      const local = require('lucide-static/tags.json')
      writeCache('tags.json', local)
      return local
    } catch {
      const cached = readCache('tags.json')
      if (cached) {
        console.warn('[icons] tags fetch failed, using cache:', err.message)
        return cached
      }
      console.warn('[icons] no tags available — keywords will be derived from names only')
      return {}
    }
  }
}

async function loadLucideExports() {
  const mod = await import('@lucide/vue')
  /** @type {Set<string>} */
  const set = new Set()
  for (const key of Object.keys(mod)) {
    if (!/^[A-Z]/.test(key)) continue
    if (key.startsWith('Lucide')) continue
    if (key.endsWith('Icon')) continue
    if (key === 'Icon' || key === 'createLucideIcon') continue
    const val = /** @type {Record<string, unknown>} */ (mod)[key]
    if (typeof val === 'function' || (val && typeof val === 'object')) {
      set.add(key)
    }
  }
  return { mod, set }
}

function keywordsFor(kebab, name, tagsMap) {
  const fromTags = Array.isArray(tagsMap[kebab]) ? tagsMap[kebab] : []
  const fromName = pascalToKebab(name)
    .split('-')
    .filter((t) => t.length > 1)
  const extra = []
  if (/search/i.test(name)) extra.push('find')
  if (/trash/i.test(name)) extra.push('delete')
  if (/plus/i.test(name)) extra.push('add', 'create')
  if (/check/i.test(name)) extra.push('ok', 'success')
  if (/alert|warning/i.test(name)) extra.push('warning')
  if (/help|question/i.test(name)) extra.push('help')
  if (/lock/i.test(name)) extra.push('secure')
  if (/user/i.test(name)) extra.push('account')
  if (/file|folder/i.test(name)) extra.push('document')
  return [...new Set([...fromTags, ...fromName, ...extra])].slice(0, 8)
}

function writeTypes() {
  const union = CATEGORY_IDS.map((c) => `  | '${c}'`).join('\n')
  return `/** Icon category ids — Lucide official browse categories (full set) */
export type IconCategoryId =
${union}

export interface IconCatalogEntry {
  /** Canonical PascalCase name accepted by \`<Icon name>\` / \`resolveLucideIcon\` */
  name: string
  /** Primary Lucide category (first listed on lucide.dev) */
  category: IconCategoryId
  /** All Lucide categories this glyph belongs to */
  categories: readonly IconCategoryId[]
  /** Extra search tokens (Lucide tags + aliases / verbs) */
  keywords?: readonly string[]
}

export type { IconName } from './names'
`
}

function writeNames(names) {
  const body = names.map((n) => `  '${n}'`).join(',\n')
  return `/**
 * Canonical icon names shipped by \`@amg-webui/icons\` (full Lucide set).
 * Aliases (Edit → SquarePen, etc.) resolve via \`resolveLucideIcon\` but are not listed here.
 * Generated by scripts/generate-icon-catalog.mjs — do not hand-edit.
 */
export const ICON_NAMES = [
${body}
] as const

export type IconName = (typeof ICON_NAMES)[number]

export const ICON_NAME_SET: ReadonlySet<string> = new Set(ICON_NAMES)
`
}

function writeCatalog(entries) {
  const lines = []
  let current = ''
  for (const e of entries) {
    if (e.category !== current) {
      current = e.category
      lines.push(`  // ${current}`)
    }
    const catsLit = e.categories.map((c) => `'${c}'`).join(', ')
    const kw = e.keywords || []
    const kwLit = kw.length ? `, keywords: [${kw.map((k) => `'${k.replace(/'/g, "\\'")}'`).join(', ')}]` : ''
    lines.push(
      `  { name: '${e.name}', category: '${e.category}', categories: [${catsLit}]${kwLit} },`
    )
  }

  return `import type { IconCatalogEntry, IconCategoryId } from './types'
import { ICON_NAMES } from './names'

/** Stable category order for browser / docs (Lucide official) */
export const ICON_CATEGORY_IDS: readonly IconCategoryId[] = [
${CATEGORY_IDS.map((c) => `  '${c}'`).join(',\n')}
] as const

/**
 * Full Lucide catalog — every canonical name appears once.
 * Generated by scripts/generate-icon-catalog.mjs — do not hand-edit.
 */
export const ICON_CATALOG: readonly IconCatalogEntry[] = [
${lines.join('\n')}
] as const

const byName = new Map(ICON_CATALOG.map((e) => [e.name, e]))

/** Every canonical name must appear in the catalog exactly once */
for (const n of ICON_NAMES) {
  if (!byName.has(n)) {
    throw new Error(\`[icons] catalog missing canonical name: \${n}\`)
  }
}

export function getIconCatalog(): readonly IconCatalogEntry[] {
  return ICON_CATALOG
}

export function getIconEntry(name: string): IconCatalogEntry | undefined {
  return byName.get(name)
}

export interface ListIconsOptions {
  category?: IconCategoryId | 'all'
  /** Case-insensitive match against name + keywords */
  query?: string
}

/** Filter the Lucide catalog (for Icon browser / docs). */
export function listIcons(options: ListIconsOptions = {}): IconCatalogEntry[] {
  const q = options.query?.trim().toLowerCase()
  const cat = options.category && options.category !== 'all' ? options.category : undefined

  return ICON_CATALOG.filter((entry) => {
    if (cat && !entry.categories.includes(cat) && entry.category !== cat) return false
    if (!q) return true
    if (entry.name.toLowerCase().includes(q)) return true
    return Boolean(entry.keywords?.some((k) => k.toLowerCase().includes(q)))
  })
}

/** Canonical names only (no aliases). */
export function listIconNames(options: ListIconsOptions = {}): string[] {
  return listIcons(options).map((e) => e.name)
}
`
}

function writeRegistry(names) {
  const importLines = names
    .map((n) => (IMPORT_RENAMES[n] ? `  ${n} as ${IMPORT_RENAMES[n]}` : `  ${n}`))
    .join(',\n')
  const mapLines = names
    .map((n) => (IMPORT_RENAMES[n] ? `  ${n}: ${IMPORT_RENAMES[n]},` : `  ${n},`))
    .join('\n')
  const nameSet = new Set(names)
  const aliasLines = Object.entries(ALIASES)
    .filter(([alias, target]) => nameSet.has(target) && !nameSet.has(alias))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([alias, target]) => `  ${alias}: ${IMPORT_RENAMES[target] || target},`)
    .join('\n')

  return `/**
 * Lucide icon registry — full set + ergonomic aliases.
 * Generated by scripts/generate-icon-catalog.mjs — do not hand-edit the map.
 * @see https://lucide.dev
 */
import type { Component as VueComponent } from 'vue'
import {
${importLines}
} from '@lucide/vue'

/** Public name (PascalCase) → Lucide component — includes ergonomic aliases */
export const lucideIconMap: Record<string, VueComponent> = {
${mapLines}
${aliasLines}
}

export function resolveLucideIcon(name: string): VueComponent | undefined {
  if (!name) return undefined
  if (lucideIconMap[name]) return lucideIconMap[name]
  const pascal = name
    .split(/[-_\\s]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('')
  return lucideIconMap[pascal]
}

export function hasLucideIcon(name: string): boolean {
  return Boolean(resolveLucideIcon(name))
}

/** All public map keys (canonical + aliases), sorted */
export function listRegisteredIconKeys(): string[] {
  return Object.keys(lucideIconMap).sort((a, b) => a.localeCompare(b))
}
`
}

function writeNamed(names) {
  const exportLines = names
    .map((n) => {
      if (!IMPORT_RENAMES[n]) return `  ${n}`
      return `  ${n} as ${IMPORT_RENAMES[n]}`
    })
    .join(',\n')

  return `/**
 * Tree-shakeable named Lucide components (full set).
 * Prefer \`import { Search } from '@amg-webui/icons'\` for direct SVG usage,
 * or \`<Icon name="Search" />\` from \`@amg-webui/components/base\` for themed wrapping.
 * Generated by scripts/generate-icon-catalog.mjs — do not hand-edit.
 *
 * Note: Lucide's \`Component\` glyph is exported as \`LucideComponent\` to avoid clashing
 * with Vue's \`Component\` type. Use \`<Icon name="Component" />\` for that glyph.
 */
export {
${exportLines}
} from '@lucide/vue'
`
}

async function main() {
  const [{ set: lucideSet }, categoriesMap, tagsMap] = await Promise.all([
    loadLucideExports(),
    loadCategoriesMap(),
    loadTagsMap()
  ])

  const categorySet = new Set(CATEGORY_IDS)
  /** @type {Map<string, { name: string, category: string, categories: string[], keywords: string[] }>} */
  const byName = new Map()
  const missingExport = []
  const unknownCats = new Set()

  for (const [kebab, cats] of Object.entries(categoriesMap)) {
    const name = kebabToPascal(kebab)
    if (!lucideSet.has(name)) {
      missingExport.push(`${kebab} → ${name}`)
      continue
    }
    const categories = (Array.isArray(cats) ? cats : []).filter((c) => {
      if (categorySet.has(c)) return true
      unknownCats.add(c)
      return false
    })
    if (!categories.length) {
      unknownCats.add(`(empty:${kebab})`)
      continue
    }
    byName.set(name, {
      name,
      category: categories[0],
      categories,
      keywords: keywordsFor(kebab, name, tagsMap)
    })
  }

  if (missingExport.length) {
    console.warn(
      `Skipped ${missingExport.length} API icons not in @lucide/vue:`,
      missingExport.slice(0, 12).join(', '),
      missingExport.length > 12 ? '…' : ''
    )
  }
  if (unknownCats.size) {
    console.warn('Unknown / empty categories:', [...unknownCats].join(', '))
  }

  const entries = [...byName.values()].sort((a, b) => {
    const ai = CATEGORY_IDS.indexOf(a.category)
    const bi = CATEGORY_IDS.indexOf(b.category)
    if (ai !== bi) return ai - bi
    return a.name.localeCompare(b.name)
  })

  const names = entries.map((e) => e.name).sort((a, b) => a.localeCompare(b))

  for (const [alias, target] of Object.entries(ALIASES)) {
    if (!names.includes(target)) {
      console.warn(`Alias ${alias} → ${target} target not in catalog`)
    }
  }

  fs.writeFileSync(path.join(outDir, 'types.ts'), writeTypes(), 'utf8')
  fs.writeFileSync(path.join(outDir, 'names.ts'), writeNames(names), 'utf8')
  fs.writeFileSync(path.join(outDir, 'catalog.ts'), writeCatalog(entries), 'utf8')
  fs.writeFileSync(path.join(outDir, 'lucideRegistry.ts'), writeRegistry(names), 'utf8')
  fs.writeFileSync(path.join(outDir, 'named.ts'), writeNamed(names), 'utf8')

  const primaryCounts = Object.fromEntries(
    CATEGORY_IDS.map((c) => [c, entries.filter((e) => e.category === c).length])
  )
  const membershipCounts = Object.fromEntries(
    CATEGORY_IDS.map((c) => [c, entries.filter((e) => e.categories.includes(c)).length])
  )

  console.log(
    JSON.stringify(
      {
        total: names.length,
        categories: CATEGORY_IDS.length,
        missingExport: missingExport.length,
        primaryCounts,
        membershipCounts
      },
      null,
      2
    )
  )
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
