import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface TimeRangeValue {
  start?: string | null
  end?: string | null
}

export interface TimeRangeInputProps extends BaseProps, DisabledProps {
  modelValue?: TimeRangeValue
  showSeconds?: boolean
}

export interface TimeRangeInputEmits {
  (e: 'update:modelValue', value: TimeRangeValue): void
  (e: 'change', value: TimeRangeValue): void
}
