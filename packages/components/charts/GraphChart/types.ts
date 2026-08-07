import type { BaseProps } from '@amg-webui/types'

export interface GraphChartNode { id: string; label: string; x?: number; y?: number }
export interface GraphChartEdge { from: string; to: string }

export interface GraphChartProps extends BaseProps {
  title?: string
  description?: string
  data?: unknown
  modelValue?: unknown
  disabled?: boolean
  loading?: boolean
  nodes?: GraphChartNode[]
  edges?: GraphChartEdge[]
  selectable?: boolean
  emptyText?: string
}

export interface GraphChartEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: GraphChartNode): void
  (e: 'select', value: GraphChartNode, event?: MouseEvent | KeyboardEvent): void
  (e: 'click', event: MouseEvent): void
}
