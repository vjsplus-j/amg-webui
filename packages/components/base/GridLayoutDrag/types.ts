import type { BaseProps } from '@amg-webui/types'

export interface GridLayoutDragProps extends BaseProps {
  cols?: number
  enabled?: boolean
}

export interface GridLayoutDragEmits {
  (e: 'mode', value: 'grid'): void
}
