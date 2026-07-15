import type { BaseProps } from '@amg-webui/types'

export interface PdfPreviewProps extends BaseProps {
  src?: string | File | Blob | null
  height?: string
}

export interface PdfPreviewEmits {
  (e: 'load'): void
}
