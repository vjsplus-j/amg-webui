import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface RangeValue {
  min?: number | null
  max?: number | null
}

export interface RangeInputProps extends BaseProps, DisabledProps {
  modelValue?: RangeValue
  precision?: number
  step?: number
}

export interface RangeInputEmits {
  (e: 'update:modelValue', value: RangeValue): void
  (e: 'change', value: RangeValue): void
}
