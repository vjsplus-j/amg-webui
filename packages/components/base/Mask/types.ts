import type { BaseProps } from '@amg-webui/types'

export interface MaskProps extends BaseProps {
  visible?: boolean
  dismissible?: boolean
  zIndex?: number
}

export interface MaskEmits {
  (e: 'update:visible', value: boolean): void
}
