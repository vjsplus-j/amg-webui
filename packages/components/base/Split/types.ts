import type { BaseProps } from '@amg-webui/types'

export type SplitDirection = 'horizontal' | 'vertical'

export interface SplitProps extends BaseProps {
  direction?: SplitDirection
  min?: number
  max?: number
  size?: number | string
}

export interface SplitEmits {
  (e: 'update:size', value: number | string): void
}
