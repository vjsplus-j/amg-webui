/**
 * `@amg-webui/icons` — full Lucide icon library (~1745 glyphs, 42 official categories).
 *
 * Import styles:
 * - Named SVG: `import { Search, Settings } from '@amg-webui/icons'`
 * - Name resolve: `resolveLucideIcon('Search')` (used by `<Icon name>` / Button)
 * - Browse: `ICON_CATALOG` / `listIcons({ query, category })`
 *
 * Regenerate: `npm run generate:icons`
 */

export {
  resolveLucideIcon,
  hasLucideIcon,
  lucideIconMap,
  listRegisteredIconKeys
} from './lucideRegistry'

export { hasLucideIcon as hasIconPaths } from './lucideRegistry'

export {
  ICON_CATALOG,
  ICON_CATEGORY_IDS,
  getIconCatalog,
  getIconEntry,
  listIcons,
  listIconNames
} from './catalog'

export type { ListIconsOptions } from './catalog'

export { ICON_NAMES, ICON_NAME_SET } from './names'
export type { IconName } from './names'

export type { IconCategoryId, IconCatalogEntry } from './types'

export * from './named'
