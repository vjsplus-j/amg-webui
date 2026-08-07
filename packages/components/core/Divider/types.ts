import type { BaseProps } from '@amg-webui/types'

export type DividerDirection = 'horizontal' | 'vertical'
export type DividerContentPosition = 'left' | 'center' | 'right'
export type DividerMargin = 'none' | 'sm' | 'md' | 'lg'

export interface DividerProps extends BaseProps {
  /** Layout axis — `vertical` is the inline `|` pipe separator */
  direction?: DividerDirection
  /** Alias of `direction` (Ant Design–style API) */
  type?: DividerDirection
  contentPosition?: DividerContentPosition
  dashed?: boolean
  borderStyle?: string
  /** Compact visual weight (softer line / text) */
  plain?: boolean
  /** Outer margin along the primary axis — maps to spacing tokens */
  margin?: DividerMargin
  /**
   * Decorative separator (no semantic landmark).
   * Sets `aria-hidden` and omits `role="separator"` when true.
   */
  decorative?: boolean
  /** Accessible name when the divider is a landmark separator */
  ariaLabel?: string
}
