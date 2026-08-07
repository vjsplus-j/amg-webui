import type { BaseProps, Size } from '@amg-webui/types'

export type SpaceDirection = 'horizontal' | 'vertical'

/**
 * Gap preset — five steps, maps to `--spacing-*`:
 * xs 极小 · sm 小 · md 中 · lg 大 · xl 极大
 * CSS length strings also accepted.
 */
export type SpaceSize = Size | string

/** Canonical size keys (极小 → 极大) */
export const SPACE_SIZES: readonly Size[] = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export interface SpaceProps extends BaseProps {
  /** Gap: xs–xl（极小/小/中/大/极大）→ `--spacing-*`；默认 md */
  size?: SpaceSize
  /** Alias of size */
  gap?: SpaceSize
  /** @deprecated Prefer size — kept for early scaffolds */
  gutter?: number | string
  direction?: SpaceDirection
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  /** Wrap onto new lines (default true for horizontal) */
  wrap?: boolean
  /** Stretch to 100% parent width */
  block?: boolean
  /** Accessible name for the spacing group */
  ariaLabel?: string
}
