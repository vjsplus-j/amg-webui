import type { BaseProps } from '@amg-webui/types'
export interface GbsSignEntry {
  id: string
  type: string
  message: string
  time: string
}

export interface GbsSignMonitorProps extends BaseProps {
  logs?: GbsSignEntry[]
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface GbsSignMonitorEmits {
  (e: 'refresh'): void
}
