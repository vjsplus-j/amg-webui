import type { BaseProps } from '@amg-webui/types'
export interface AudioTalkProps extends BaseProps {
  active?: boolean
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface AudioTalkEmits {
  (e: 'update:active', v: boolean): void
  (e: 'start'): void
  (e: 'stop'): void
}
