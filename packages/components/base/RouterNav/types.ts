import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }

export interface RouterNavProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  activeMatch?: 'exact' | 'prefix'
  trackId?: string
  telemetry?: boolean
}

export interface RouterNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
