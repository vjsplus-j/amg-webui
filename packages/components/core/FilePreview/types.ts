import type { BaseProps } from '@amg-webui/types'

export interface FilePreviewProps extends BaseProps {
  src?: string | File | Blob | null
  mime?: string
  height?: string
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface FilePreviewEmits {
  (e: 'load'): void
  (e: 'error', err: Error): void
  (e: 'clear'): void
}
