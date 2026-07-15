import type { BaseProps } from '@amg-webui/types'

export interface OcrScanProps extends BaseProps {
  disabled?: boolean
}

export interface OcrScanEmits {
  (e: 'scan', text: string): void
  (e: 'error', error: Error): void
}
