import type { BaseProps } from '@amg-webui/types'
export interface GbsStatusCardProps extends BaseProps {
  registered?: boolean
  deviceCount?: number
  channelCount?: number
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface GbsStatusCardEmits {
  (e: 'refresh'): void
}
