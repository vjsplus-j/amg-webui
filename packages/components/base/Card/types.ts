import type { BaseProps } from '@amg-webui/types'

/**
 * Compact loading skeletons for Card — cover common admin / SaaS body layouts.
 * Maps 1:1 to Skeleton `card-*` variants.
 */
export type CardSkeleton =
  | 'basic'
  | 'profile'
  | 'metric'
  | 'duo'
  | 'stats'
  | 'media'
  | 'actions'
  | 'list'
  | 'table'
  | 'chart'
  | 'form'
  | 'notice'
  | 'product'
  | 'article'
  | 'comment'
  | 'timeline'
  | 'toolbar'

/** All presets — use in demos / docs */
export const CARD_SKELETONS: readonly CardSkeleton[] = [
  'basic',
  'profile',
  'metric',
  'duo',
  'stats',
  'media',
  'actions',
  'list',
  'table',
  'chart',
  'form',
  'notice',
  'product',
  'article',
  'comment',
  'timeline',
  'toolbar'
] as const

export interface CardProps extends BaseProps {
  /** Header bar title (left) */
  header?: string
  /** Footer text when no footer slot */
  footer?: string
  /** Body title above slot */
  title?: string
  /** Body subtitle */
  subTitle?: string
  /** Alias of subTitle */
  subtitle?: string
  /** Soft elevation */
  raised?: boolean
  /** Hover affordance; clickable when true */
  hover?: boolean
  /** Alias of hover */
  hoverable?: boolean
  /** Selected visual state */
  selected?: boolean
  /** Selection interaction; emits update:selected on click */
  selectable?: boolean
  /** Show 1px border (default true) */
  bordered?: boolean
  /** Replace body with a compact skeleton */
  loading?: boolean
  /** Which small skeleton to show while loading */
  skeleton?: CardSkeleton
}

export interface CardEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'update:selected', value: boolean): void
}
