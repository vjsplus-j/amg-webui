import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface YearPickerProps extends BaseProps, DisabledProps {
  modelValue?: string | Date | number | null
  placeholder?: string
  valueFormat?: 'number' | 'date' | 'iso'
  yearRange?: number
}

export interface YearPickerEmits {
  (e: 'update:modelValue', value: string | Date | number | null): void
  (e: 'change', value: string | Date | number | null): void
}
