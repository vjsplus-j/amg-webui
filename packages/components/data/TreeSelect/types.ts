import type { BaseProps, DisabledProps, InvalidProps } from '@amg-webui/types'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'

export interface TreeSelectOption {
  label: string
  value: unknown
  disabled?: boolean
  children?: TreeSelectOption[]
}

export interface TreeSelectProps extends BaseProps, DisabledProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
  modelValue?: unknown
  options?: TreeSelectOption[]
  placeholder?: string
  filterable?: boolean
  clearable?: boolean
  multiple?: boolean
  /** Show tree checkboxes (implies cascade when multiple). */
  showCheckbox?: boolean
  checkStrictly?: boolean
  /** Show loading state in the dropdown panel */
  loading?: boolean
}

export interface TreeSelectEmits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
}

export type { TreeNode }
