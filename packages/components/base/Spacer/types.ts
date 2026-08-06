import type { BaseProps } from '@amg-webui/types'

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'section'
export type SpacerAxis = 'horizontal' | 'vertical' | 'both'

export interface SpacerProps extends BaseProps {
  /** Grow to fill remaining flex space (default true when size omitted) */
  flex?: boolean
  /** Flex grow factor when `flex` is true */
  grow?: number
  /** Flex shrink factor when `flex` is true */
  shrink?: number
  /** Fixed size via spacing scale key */
  size?: SpacerSize
  axis?: SpacerAxis
  /** Minimum size when flexing */
  minSize?: SpacerSize
  /** Render as inline spacer when used inside text / button rows */
  inline?: boolean
  /** Explicit flex basis when flexing */
  basis?: string
  /** Whether the root is hidden from assistive tech */
  ariaHidden?: boolean
  /** Optional focus order when the spacer is used as a semantic separator */
  tabIndex?: number
  /** Emit resize payload through ResizeObserver */
  observeResize?: boolean
}

export interface SpacerResizePayload {
  width: number
  height: number
}

export interface SpacerEmits {
  (e: 'resize', payload: SpacerResizePayload): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}
