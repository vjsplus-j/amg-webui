import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface TimeRangeValue {
  start?: string | null
  end?: string | null
}

export interface TimeRangeInputProps extends BaseProps, DisabledProps {
  modelValue?: TimeRangeValue
  id?: string
  name?: string
  invalid?: boolean
  showSeconds?: boolean
  clearable?: boolean
  ariaLabel?: string
}

export interface TimeRangeInputEmits {
  (e: 'update:modelValue', value: TimeRangeValue): void
  (e: 'change', value: TimeRangeValue): void
  (e: 'clear'): void
}
