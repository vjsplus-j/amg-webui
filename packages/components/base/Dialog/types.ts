import type { BaseProps, VisibleEmits } from '@amg-webui/types'

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

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
  /** Preset width — ignored when maximized */
  size?: DialogSize
  /** Custom width CSS value (overrides size) */
  width?: string
}

export interface DialogEmits extends VisibleEmits {
  (e: 'maximize', maximized: boolean): void
}
