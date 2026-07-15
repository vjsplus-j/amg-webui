import type { BaseProps } from '@amg-webui/types'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps extends BaseProps {
  content?: string
  placement?: TooltipPlacement
  disabled?: boolean
  delay?: number
}
