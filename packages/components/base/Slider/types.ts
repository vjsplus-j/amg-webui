import type { BaseProps, DisabledProps } from '@amg-webui/types'

export type SliderValue = number | [number, number]

export interface SliderProps extends BaseProps, DisabledProps {
  modelValue?: SliderValue
  min?: number
  max?: number
  step?: number
  range?: boolean
  showTooltip?: boolean
}

export interface SliderEmits {
  (e: 'update:modelValue', value: SliderValue): void
  (e: 'change', value: SliderValue): void
}
