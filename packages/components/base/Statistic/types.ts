import type { BaseProps } from '@amg-webui/types'

export type StatisticTrend = 'up' | 'down' | 'none'

export interface StatisticProps extends BaseProps {
  title?: string
  value: number | string
  precision?: number
  prefix?: string
  suffix?: string
  groupSeparator?: string
  decimalSeparator?: string
  trend?: StatisticTrend
  animate?: boolean
  duration?: number
}

export interface StatisticEmits {
  /** Count-up animation finished (or skipped when animate=false) */
  (e: 'finish', value: number | string): void
}
