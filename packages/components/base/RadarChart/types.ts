import type { BaseProps } from '@amg-webui/types'

export interface RadarChartProps extends BaseProps {
  title?: string
  description?: string
  data?: unknown
  modelValue?: string | number | null
  disabled?: boolean
  loading?: boolean
  max?: number
  levels?: number
  showValues?: boolean
  selectable?: boolean
  emptyText?: string
}

export interface RadarChartEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: { label: string; value: number; index: number }): void
  (e: 'click', event: MouseEvent): void
}
