import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface MonthPickerProps extends BaseProps, DisabledProps {
  modelValue?: string | Date | null
  placeholder?: string
  valueFormat?: 'date' | 'iso'
}

export interface MonthPickerEmits {
  (e: 'update:modelValue', value: string | Date | null): void
  (e: 'change', value: string | Date | null): void
}
