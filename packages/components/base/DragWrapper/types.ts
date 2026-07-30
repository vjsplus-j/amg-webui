import type { BaseProps } from '@amg-webui/types'

export interface DragWrapperProps extends BaseProps {
  label?: string
  nested?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface DragWrapperEmits {
  (e: 'drop', type: string): void
  (e: 'clear'): void
}
