import type { BaseProps } from '@amg-webui/types'

export interface SiderProps extends BaseProps {
  /** Expanded width (CSS length or token). Default: var(--ln-sidebar-width) */
  width?: string
  /** Collapsed width. Default: var(--ln-sidebar-width-collapsed) */
  collapsedWidth?: string
  collapsed?: boolean
  collapsible?: boolean
  /** Which edge the sider docks to */
  side?: 'left' | 'right'
  /** Show edge border (default true) */
  bordered?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface SiderEmits {
  (e: 'update:collapsed', value: boolean): void
  (e: 'collapse', collapsed: boolean): void
}
