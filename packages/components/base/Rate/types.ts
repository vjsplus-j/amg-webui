import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface RateProps extends BaseProps, DisabledProps {
  modelValue?: number
  max?: number
  allowHalf?: boolean
  clearable?: boolean
}

export interface RateEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}
