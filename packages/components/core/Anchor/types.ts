import type { BaseProps } from '@amg-webui/types'
import type { NavItem } from '@amg-webui/utils/nav'

export type { NavItem }

export interface AnchorProps extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
  /** Pixels offset from container top when scrolling / detecting */
  offset?: number
  /** Scroll container CSS selector; omit for window */
  container?: string
  smooth?: boolean
  /** Extra bound (px) for active detection */
  bound?: number
  /** CSS sticky while scrolling */
  affix?: boolean
  /** Sticky top offset (px) when affix */
  affixOffset?: number
  trackId?: string
  telemetry?: boolean
}

export interface AnchorEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
