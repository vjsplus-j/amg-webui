import type { BaseProps } from '@amg-webui/types'

export interface PagerNavProps extends BaseProps {
  /** Current page (1-based) */
  modelValue?: number
  /** Total page count */
  totalPages?: number
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  /** Accessible name for the nav landmark */
  ariaLabel?: string
  trackId?: string
  telemetry?: boolean
}

export interface PagerNavEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}
