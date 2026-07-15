/** Icon category ids — Lucide official browse categories (full set) */
export type IconCategoryId =
  | 'accessibility'
  | 'account'
  | 'animals'
  | 'arrows'
  | 'buildings'
  | 'charts'
  | 'communication'
  | 'connectivity'
  | 'cursors'
  | 'design'
  | 'development'
  | 'devices'
  | 'emoji'
  | 'files'
  | 'finance'
  | 'food-beverage'
  | 'gaming'
  | 'home'
  | 'layout'
  | 'mail'
  | 'math'
  | 'medical'
  | 'multimedia'
  | 'nature'
  | 'navigation'
  | 'notifications'
  | 'people'
  | 'photography'
  | 'science'
  | 'seasons'
  | 'security'
  | 'shapes'
  | 'shopping'
  | 'social'
  | 'sports'
  | 'sustainability'
  | 'text'
  | 'time'
  | 'tools'
  | 'transportation'
  | 'travel'
  | 'weather'

export interface IconCatalogEntry {
  /** Canonical PascalCase name accepted by `<Icon name>` / `resolveLucideIcon` */
  name: string
  /** Primary Lucide category (first listed on lucide.dev) */
  category: IconCategoryId
  /** All Lucide categories this glyph belongs to */
  categories: readonly IconCategoryId[]
  /** Extra search tokens (Lucide tags + aliases / verbs) */
  keywords?: readonly string[]
}

export type { IconName } from './names'
