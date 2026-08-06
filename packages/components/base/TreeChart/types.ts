import type { BaseProps } from '@amg-webui/types'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'

export interface TreeChartProps extends BaseProps {
  title?: string
  description?: string
  data?: unknown
  modelValue?: unknown
  disabled?: boolean
  loading?: boolean
  options?: TreeNode[]
  emptyText?: string
  selectable?: boolean
}

export interface TreeChartEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: TreeNode): void
  (e: 'select', value: TreeNode, event?: MouseEvent | KeyboardEvent): void
  (e: 'click', event: MouseEvent): void
}
