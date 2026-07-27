import type { BaseProps } from '@amg-webui/types'
import type { TooltipPlacement } from '../Tooltip/types'

export interface EllipsisProps extends BaseProps {
  /** Max visible lines (1 = single-line ellipsis) */
  lines?: number
  /** Show full text in Tooltip when overflowing */
  tooltip?: boolean
  /** Tooltip placement when tooltip is enabled */
  tooltipPlacement?: TooltipPlacement
  /** Plain text fallback when slot is empty; also used as tooltip source when set */
  content?: string
  /** Accessible name when truncated text is focusable */
  ariaLabel?: string
}

export interface EllipsisEmits {
  /** Overflow state changed (true = text is truncated) */
  (e: 'overflowChange', overflowing: boolean): void
}
