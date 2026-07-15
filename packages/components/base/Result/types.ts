import type { BaseProps } from '@amg-webui/types'

export type ResultStatus = 'success' | 'warning' | 'error' | 'info'

export interface ResultProps extends BaseProps {
  status?: ResultStatus
  title?: string
  subTitle?: string
}
