import type { BaseProps } from '@amg-webui/types'

export interface ScrollbarProps extends BaseProps {
  /** CSS length or spacing-step number (× --spacing-xs) */
  height?: string | number
  maxHeight?: string | number
  /** Use browser native scrollbar chrome */
  native?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface ScrollbarEmits {
  (e: 'scroll', event: Event): void
}
