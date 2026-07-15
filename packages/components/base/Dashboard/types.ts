import type { BaseProps } from '@amg-webui/types'

export interface DashboardStat {
  id: string
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'flat'
}

export interface DashboardProps extends BaseProps {
  stats?: DashboardStat[]
  loading?: boolean
}

export interface DashboardEmits {
  (e: 'refresh'): void
  (e: 'select-stat', stat: DashboardStat): void
}
