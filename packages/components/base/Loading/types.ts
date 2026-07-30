import type { BaseProps } from '@amg-webui/types'

export type LoadingSize = 'sm' | 'md' | 'lg'

export interface LoadingProps extends BaseProps {
  visible?: boolean
  text?: string
  fullscreen?: boolean
  size?: LoadingSize
  lockScroll?: boolean
}

export interface LoadingEmits {
  (e: 'after-enter'): void
  (e: 'after-leave'): void
}
