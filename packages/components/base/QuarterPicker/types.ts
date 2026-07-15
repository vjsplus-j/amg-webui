import type { BaseProps, DisabledProps } from '@amg-webui/types'

/** ISO quarter value e.g. `2024-Q2` */
export type QuarterValue = string | null

export interface QuarterPickerProps extends BaseProps, DisabledProps {
  modelValue?: QuarterValue
  minYear?: number
  maxYear?: number
}

export interface QuarterPickerEmits {
  (e: 'update:modelValue', value: QuarterValue): void
  (e: 'change', value: QuarterValue): void
}
