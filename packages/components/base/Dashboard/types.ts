import type { BaseProps, LoadingProps } from '@amg-webui/types'

export interface DashboardStat {
  id: string
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'flat'
}

export interface DashboardWidget {
  id: string
  label?: string
  /** Grid column span (1–column count) */
  span?: number
}

export interface DashboardProps extends BaseProps, LoadingProps {
  stats?: DashboardStat[]
  /** Named widget slots: #widget-{id} */
  widgets?: DashboardWidget[]
  /** Responsive grid column count */
  columns?: number
  loading?: boolean
}

export interface DashboardEmits {
  (e: 'refresh'): void
  (e: 'select-stat', stat: DashboardStat): void
}
