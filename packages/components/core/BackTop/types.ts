import type { BaseProps } from '@amg-webui/types'

export interface BackTopProps extends BaseProps {
  /** Show button after scrolling past this distance (px) */
  visibilityHeight?: number
  /** Scroll container selector or element; defaults to window */
  container?: string | HTMLElement
  /** Teleport button to document.body */
  teleport?: boolean
  right?: string
  bottom?: string
  /** Lucide icon name */
  icon?: string
}

export interface BackTopEmits {
  (e: 'click', event: MouseEvent): void
}
