import type { BaseProps } from '@amg-webui/types'
export interface VideoWatermarkProps extends BaseProps {
  text?: string
  opacity?: number
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface VideoWatermarkEmits {
  (e: 'update:text', v: string): void
  (e: 'change', v: string): void
}
