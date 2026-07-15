import type { BaseProps } from '@amg-webui/types'

export interface QrcodeProps extends BaseProps {
  modelValue?: string
  value?: string
  size?: number
  pixelSize?: number
  disabled?: boolean
  loading?: boolean
}

export interface QrcodeEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
