import type { BaseProps, VisibleEmits } from '@amg-webui/types'

export type DrawerPlacement = 'left' | 'right'

export interface DrawerProps extends BaseProps {
  visible?: boolean
  title?: string
  placement?: DrawerPlacement
  width?: string
  closable?: boolean
  dismissible?: boolean
}

export interface DrawerEmits extends VisibleEmits {}
