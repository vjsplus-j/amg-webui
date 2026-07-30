import type { BaseProps } from '@amg-webui/types'
export interface OnvifAlarm {
  id: string
  type: string
  time: string
}

export interface OnvifAlarmPanelProps extends BaseProps {
  alarms?: OnvifAlarm[]
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface OnvifAlarmPanelEmits {
  (e: 'acknowledge', id: string): void
}
