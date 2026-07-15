/**
 * Ant-style base component catalog for example debug shell.
 * Source: example/component-catalog.json (8 categories, 268 coverage).
 */
import catalog from './component-catalog.json'
import { componentMaturity, type MaturityLevel } from './component-zones'

export type CatalogCategoryId =
  | 'general'
  | 'layout'
  | 'navigation'
  | 'data-entry'
  | 'data-display'
  | 'feedback'
  | 'other'
  | 'industry'

export interface CatalogEntry {
  name: string
  category: CatalogCategoryId
  titleKey: string
  leadKey?: string
  maturity: MaturityLevel
}

export const CATALOG_CATEGORY_ORDER: CatalogCategoryId[] = [
  'general',
  'layout',
  'navigation',
  'data-entry',
  'data-display',
  'feedback',
  'other',
  'industry'
]

export const CATALOG_CATEGORY_TITLE_KEYS: Record<CatalogCategoryId, string> = {
  general: 'nav.base.category.general',
  layout: 'nav.base.category.layout',
  navigation: 'nav.base.category.navigation',
  'data-entry': 'nav.base.category.dataEntry',
  'data-display': 'nav.base.category.dataDisplay',
  feedback: 'nav.base.category.feedback',
  other: 'nav.base.category.other',
  industry: 'nav.base.category.industry'
}

export const CATALOG_CATEGORY_ICONS: Record<CatalogCategoryId, string> = {
  general: 'Box',
  layout: 'Layout',
  navigation: 'Menu',
  'data-entry': 'Edit',
  'data-display': 'Table',
  feedback: 'MessageCircle',
  other: 'Package',
  industry: 'Camera'
}

/** PascalCase → kebab-case for locale component.* keys */
export function componentNameToKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export function componentTitleKey(name: string): string {
  return `component.${componentNameToKebab(name)}.title`
}

type CatalogJson = {
  byCategory: Record<CatalogCategoryId, string[]>
  components?: Record<string, { category: CatalogCategoryId; titleKey: string; leadKey?: string }>
}

const data = catalog as CatalogJson
const CATEGORY_MAP = data.byCategory

function buildEntries(): CatalogEntry[] {
  const out: CatalogEntry[] = []
  for (const category of CATALOG_CATEGORY_ORDER) {
    for (const name of CATEGORY_MAP[category] ?? []) {
      const meta = data.components?.[name]
      out.push({
        name,
        category,
        titleKey: meta?.titleKey ?? componentTitleKey(name),
        leadKey: meta?.leadKey,
        maturity: componentMaturity(name).level
      })
    }
  }
  return out
}

export const CATALOG_ENTRIES: CatalogEntry[] = buildEntries()

const BY_NAME = new Map(CATALOG_ENTRIES.map((e) => [e.name.toLowerCase(), e]))

export function getCatalogEntry(name: string | undefined | null): CatalogEntry | undefined {
  if (!name) return undefined
  return BY_NAME.get(String(name).toLowerCase())
}

export function catalogNamesByCategory(category: CatalogCategoryId): string[] {
  return [...(CATEGORY_MAP[category] ?? [])]
}

export function allCatalogNames(): string[] {
  return CATALOG_ENTRIES.map((e) => e.name)
}

/** Aliases used by older call sites */
export const getCatalogMeta = getCatalogEntry
export const catalogNames = (category?: CatalogCategoryId) =>
  category ? catalogNamesByCategory(category) : allCatalogNames()
export const catalogEntry = (name: string) => {
  const e = getCatalogEntry(name)
  if (!e) return null
  const m = componentMaturity(name)
  return { ...e, score: m.score }
}
export function resolveCatalogName(param: string | string[] | undefined): string | undefined {
  if (Array.isArray(param)) return param[0]
  return param
}
export function isCatalogComponent(name: string): boolean {
  return Boolean(getCatalogEntry(name))
}
export const listCatalogCategories = () => [...CATALOG_CATEGORY_ORDER]

export function assertCatalogCoverage(expectedNames: string[]): {
  ok: boolean
  total: number
  missing: string[]
  extra: string[]
  duplicates: string[]
} {
  const listed = allCatalogNames()
  const seen = new Set<string>()
  const duplicates: string[] = []
  for (const n of listed) {
    if (seen.has(n)) duplicates.push(n)
    seen.add(n)
  }
  const expected = new Set(expectedNames)
  const missing = expectedNames.filter((n) => !seen.has(n))
  const extra = listed.filter((n) => !expected.has(n))
  return {
    ok: missing.length === 0 && extra.length === 0 && duplicates.length === 0,
    total: listed.length,
    missing,
    extra,
    duplicates
  }
}

if (import.meta.env?.DEV) {
  const check = assertCatalogCoverage(allCatalogNames())
  if (check.duplicates.length || check.total !== 267) {
    console.warn('[component-catalog] coverage warning', check)
  }
}
