import type { BaseProps } from '@amg-webui/types'

export interface InfiniteScrollProps extends BaseProps {
  distance?: number
  disabled?: boolean
  immediate?: boolean
  scrollTarget?: string | HTMLElement
  loading?: boolean
  finished?: boolean
}

export interface InfiniteScrollEmits {
  (e: 'load'): void
}
