import type { BaseProps } from '@amg-webui/types'

export interface OcrScanProps extends BaseProps {
  disabled?: boolean
  accept?: string
  maxPreviewWidth?: number
  showPreview?: boolean
}

export interface OcrScanEmits {
  (e: 'scan', text: string): void
  (e: 'error', error: Error): void
  (e: 'change', file: File | null): void
}
