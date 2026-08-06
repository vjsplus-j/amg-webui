import type { BaseProps } from '@amg-webui/types'

export interface LineChartItem {
  label: string
  value: number
  index: number
}

export interface LineChartProps extends BaseProps {
  title?: string
  description?: string
  data?: unknown
  modelValue?: unknown
  disabled?: boolean
  loading?: boolean
  height?: number
  max?: number
  showArea?: boolean
  showPoints?: boolean
  selectable?: boolean
  emptyText?: string
}

export interface LineChartEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', item: LineChartItem): void
  (e: 'select', item: LineChartItem, event?: MouseEvent | KeyboardEvent): void
  (e: 'click', event: MouseEvent): void
}
