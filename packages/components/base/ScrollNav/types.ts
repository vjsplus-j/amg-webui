import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }

export interface ScrollNavProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  /** Soft fade on overflow edges (horizontal). Default true. */
  fadeEdges?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface ScrollNavEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
