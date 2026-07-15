import type { BaseProps } from '@amg-webui/types'

export interface PopoverProps extends BaseProps {
  visible?: boolean
  title?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  dismissible?: boolean
  disabled?: boolean
}

export interface PopoverEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}
