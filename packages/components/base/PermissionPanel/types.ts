import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface PermissionNode {
  id: string
  label: string
  children?: PermissionNode[]
}

export interface PermissionPanelProps extends BaseProps, DisabledProps {
  modelValue?: string[]
  tree?: PermissionNode[]
  checkStrictly?: boolean
}

export interface PermissionPanelEmits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', value: string[]): void
}
