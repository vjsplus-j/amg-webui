import type { BaseProps } from '@amg-webui/types'

export interface FreeLayoutDragProps extends BaseProps {
  enabled?: boolean
}

export interface FreeLayoutDragEmits {
  (e: 'mode', value: 'free'): void
}
