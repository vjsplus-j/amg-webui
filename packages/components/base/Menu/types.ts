import type { BaseProps } from '@amg-webui/types'

/** Compact pill tone for sidebar / menu chrome */
export type MenuBadgeTone = 'gold' | 'ep' | 'new'

export interface MenuBadge {
  label: string
  tone?: MenuBadgeTone
}

export interface MenuItem {
  /** Unique key (used for modelValue / openKeys) */
  key: string
  label: string
  icon?: string
  /**
   * @deprecated Prefer `badges` for multi-tone pills.
   * Still rendered as a single gold-tone badge when `badges` is empty.
   */
  badge?: string
  /** Compact pills next to the label (DoD / EP / New, …) */
  badges?: MenuBadge[]
  disabled?: boolean
  /** Group heading — not selectable */
  type?: 'item' | 'group'
  children?: MenuItem[]
  /** Opaque payload for consumers (e.g. routeName) */
  meta?: Record<string, unknown>
}

export interface MenuProps extends BaseProps {
  items?: MenuItem[]
  modelValue?: string
  openKeys?: string[]
  collapsed?: boolean
  direction?: 'vertical' | 'horizontal'
  /**
   * inline | popup | auto (horizontal/collapsed → popup)
   */
  mode?: 'auto' | 'inline' | 'popup'
  disabled?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface MenuEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:openKeys', value: string[]): void
  (e: 'change', value: string): void
  (e: 'select', item: MenuItem, event: MouseEvent): void
  (e: 'openChange', openKeys: string[]): void
}

/** @deprecated use MenuItem */
export type NavItem = MenuItem
