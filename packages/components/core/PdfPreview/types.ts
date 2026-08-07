import type { BaseProps } from '@amg-webui/types'

export interface PdfPreviewProps extends BaseProps {
  src?: string | File | Blob | null
  height?: string
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface PdfPreviewEmits {
  (e: 'load'): void
  (e: 'clear'): void
}
