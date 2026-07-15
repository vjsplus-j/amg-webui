import type { BaseProps } from '@amg-webui/types'

export interface PopconfirmProps extends BaseProps {
  visible?: boolean
  title?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  dismissible?: boolean
  disabled?: boolean
}

export interface PopconfirmEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', event: Event): void
  (e: 'cancel', event: Event): void
}
