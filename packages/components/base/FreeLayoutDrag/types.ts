import type { BaseProps } from '@amg-webui/types'

export interface FreeLayoutDragProps extends BaseProps {
  enabled?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface FreeLayoutDragEmits {
  (e: 'mode', mode: 'free'): void
  (e: 'toggle', enabled: boolean): void
}
