import type { BaseProps, DisabledProps } from '@amg-webui/types'

/** ISO quarter value e.g. `2024-Q2` */
export type QuarterValue = string | null

export interface QuarterPickerProps extends BaseProps, DisabledProps {
  modelValue?: QuarterValue
  id?: string
  invalid?: boolean
  minYear?: number
  maxYear?: number
  ariaLabel?: string
}

export interface QuarterPickerEmits {
  (e: 'update:modelValue', value: QuarterValue): void
  (e: 'change', value: QuarterValue): void
  (e: 'blur', event: FocusEvent): void
}
