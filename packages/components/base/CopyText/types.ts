import type { BaseProps, Size } from '@amg-webui/types'

export interface CopyTextProps extends BaseProps {
  /** Text written to the clipboard (required for copy) */
  text: string
  /** Visible label — defaults to `text` */
  label?: string
  /** Truncate display with ellipsis */
  truncate?: boolean
  /** Max visible characters when truncate (graphemes approx via CSS) */
  maxWidth?: string
  size?: Size
  /** Show copy control (default true) */
  showButton?: boolean
  /** Tooltip / aria for the copy control */
  copyTooltip?: string
}

export interface CopyTextEmits {
  (e: 'copy', text: string): void
  /** Preferred — aligns with Typography */
  (e: 'copyError', error: unknown): void
  /** @deprecated Prefer `copyError` */
  (e: 'error', error: unknown): void
}
