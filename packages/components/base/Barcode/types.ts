import type { BaseProps } from '@amg-webui/types'

export interface BarcodeProps extends BaseProps {
  modelValue?: string
  value?: string
  barWidth?: number
  height?: number
  showLabel?: boolean
  disabled?: boolean
  loading?: boolean
}

export interface BarcodeEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
