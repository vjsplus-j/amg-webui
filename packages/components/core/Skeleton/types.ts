import type { BaseProps, Size } from '@amg-webui/types'

/** text / paragraph / media primitives · card / list-item / page · card-* = Card body presets */
export type SkeletonVariant =
  | 'text'
  | 'paragraph'
  | 'image'
  | 'rect'
  | 'circle'
  | 'avatar'
  | 'card'
  | 'card-basic'
  | 'card-profile'
  | 'card-metric'
  | 'card-duo'
  | 'card-stats'
  | 'card-media'
  | 'card-actions'
  | 'card-list'
  | 'card-table'
  | 'card-chart'
  | 'card-form'
  | 'card-notice'
  | 'card-product'
  | 'card-article'
  | 'card-comment'
  | 'card-timeline'
  | 'card-toolbar'
  | 'list-item'
  | 'page'

export type SkeletonAnimation = 'shimmer' | 'pulse' | false

export type SkeletonWidth = string | number | Array<string | number>

export interface SkeletonProps extends BaseProps {
  /** Show skeleton when true; otherwise render default slot (real content) */
  loading?: boolean
  /** Layout preset */
  variant?: SkeletonVariant
  /** Paragraph / text line count */
  rows?: number
  /** Soft loading animation (false disables) */
  animated?: boolean
  /** Animation kind — shimmer (default) / pulse */
  animation?: SkeletonAnimation
  /** Circle / avatar diameter — Size token or CSS length / number(px) */
  size?: Size | number | string
  /** Block / line width — CSS length, % or per-row array */
  width?: SkeletonWidth
  /** Block / line height — CSS length or number(px) */
  height?: string | number
  /** Fully rounded rect/image */
  round?: boolean
  /** Accessible loading label (defaults via i18n caller / aria) */
  ariaLabel?: string
}
