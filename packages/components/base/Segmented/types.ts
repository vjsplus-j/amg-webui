import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface SegmentedOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
  icon?: string
}

export interface SegmentedProps extends BaseProps, DisabledProps {
  modelValue?: string | number | boolean
  options?: SegmentedOption[]
  size?: Size
  block?: boolean
  name?: string
  ariaLabel?: string
}

export interface SegmentedEmits {
  (e: 'update:modelValue', value: string | number | boolean): void
  (e: 'change', value: string | number | boolean): void
}
