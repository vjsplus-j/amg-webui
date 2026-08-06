import type { BaseProps } from '@amg-webui/types'

export interface GaugeChartProps extends BaseProps {
  title?: string
  description?: string
  data?: unknown
  modelValue?: number | null
  disabled?: boolean
  loading?: boolean
  min?: number
  max?: number
  unit?: string
  showValue?: boolean
  thresholds?: { value: number; color: string }[]
  emptyText?: string
}

export interface GaugeChartEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
  (e: 'click', event: MouseEvent): void
}
