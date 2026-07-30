import type { BaseProps } from '@amg-webui/types'

export interface MaskProps extends BaseProps {
  visible?: boolean
  dismissible?: boolean
  zIndex?: number
  /** Lock document body scroll while visible */
  lockScroll?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface MaskEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'close', event?: Event): void
}
