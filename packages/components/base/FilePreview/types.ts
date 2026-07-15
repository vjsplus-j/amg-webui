import type { BaseProps } from '@amg-webui/types'

export interface FilePreviewProps extends BaseProps {
  src?: string | File | Blob | null
  mime?: string
  height?: string
}

export interface FilePreviewEmits {
  (e: 'load'): void
  (e: 'error', error: Error): void
}
