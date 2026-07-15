import type { App, Plugin } from 'vue'

import '@amg-webui/theme/styles/index.scss'
import '@amg-webui/animations/transitions.scss'
import '@amg-webui/animations/motion.scss'
import '@amg-webui/animations/neon.scss'
import '@amg-webui/animations/text-shimmer.scss'

export * from './components'
export * from './hooks'
export * from './telemetry'
export * from './theme'
/** Catalog + resolver only — named Lucide glyphs live on `@amg-webui/icons` to avoid clashing with UI components */
export {
  resolveLucideIcon,
  hasLucideIcon,
  hasIconPaths,
  lucideIconMap,
  listRegisteredIconKeys,
  ICON_CATALOG,
  ICON_CATEGORY_IDS,
  ICON_NAMES,
  ICON_NAME_SET,
  getIconCatalog,
  getIconEntry,
  listIcons,
  listIconNames
} from './icons'
export type { IconName, IconCategoryId, IconCatalogEntry, ListIconsOptions } from './icons'
export * from './utils'
export * from './types'
export * from './locale'
export * from './constants'
export * from './animations'

export const AmgWebUI: Plugin = {
  install(_app: App) {
    // opt-in global registration — import components explicitly by default
  }
}

export default AmgWebUI
