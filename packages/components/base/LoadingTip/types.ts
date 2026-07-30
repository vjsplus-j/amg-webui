import type { BaseProps } from '@amg-webui/types'

export type LoadingTipSize = 'sm' | 'md' | 'lg'

export interface LoadingTipProps extends BaseProps {
  message?: string
  loading?: boolean
  size?: LoadingTipSize
  /** Delay ms before showing spinner */
  delay?: number
  block?: boolean
}

export type LoadingTipEmits = Record<string, never>
