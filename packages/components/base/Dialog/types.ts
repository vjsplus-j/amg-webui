import { BaseProps, VisibleEmits } from '@amg-webui/types'

export interface DialogProps extends BaseProps {
  visible?: boolean
  header?: string
  footer?: string
  title?: string
  modal?: boolean
  dismissible?: boolean
  closable?: boolean
  maximizable?: boolean
  minimizable?: boolean
}

export type DialogEmits = VisibleEmits