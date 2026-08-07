import type { BaseProps, VisibleEmits } from '@amg-webui/types'

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type DialogCloseReason = 'overlay' | 'escape' | 'close-button' | 'programmatic'

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
  /** Lock document scroll while open (modal only). @default true */
  lockScroll?: boolean
  /** Close on Escape. @default dismissible */
  closeOnPressEscape?: boolean
  /** Close on overlay click. @default dismissible */
  closeOnClickOverlay?: boolean
  /** Teleport target. @default body (via Overlay runtime) */
  teleportTo?: string | HTMLElement
  /** Explicit stacking order; otherwise Overlay z-index manager. */
  zIndex?: number
}

export interface DialogEmits extends VisibleEmits {
  (e: 'maximize', maximized: boolean): void
  (e: 'close', event?: Event, reason?: DialogCloseReason): void
}

export interface DialogSlots {
  /** Main dialog body */
  default?(props: Record<string, never>): unknown
  /** Header region — replaces `title` / `header` props when provided */
  header?(props: Record<string, never>): unknown
  /** Footer region — replaces `footer` prop when provided */
  footer?(props: Record<string, never>): unknown
}

export interface DialogExpose {
  /** Open the dialog (`update:visible` true) */
  open: () => void
  /** Close the dialog with an optional reason */
  close: (reason?: DialogCloseReason) => void
}

export type DialogInstance = DialogExpose
