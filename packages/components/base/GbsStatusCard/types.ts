import type { BaseProps } from '@amg-webui/types'
export interface GbsStatusCardProps extends BaseProps { registered?: boolean; deviceCount?: number; channelCount?: number; disabled?: boolean }
export interface GbsStatusCardEmits { (e: 'refresh'): void }
