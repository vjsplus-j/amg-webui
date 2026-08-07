import type { BaseProps } from '@amg-webui/types'

export interface TabsNavItem {
  name: string
  label: string
  closable?: boolean
  disabled?: boolean
}

export interface TabsNavProps extends BaseProps {
  items?: TabsNavItem[]
  modelValue?: string
  closable?: boolean
  disabled?: boolean
  /**
   * When true (default), show scroll arrows + more menu if tabs overflow.
   */
  overflow?: boolean
  /** Enable HTML5 drag-and-drop reorder; emits update:items + reorder */
  draggable?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface TabsNavEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'close', name: string): void
  (e: 'update:items', items: TabsNavItem[]): void
  (e: 'reorder', payload: { from: number; to: number; items: TabsNavItem[] }): void
}

/** @deprecated */
export type NavItem = TabsNavItem
