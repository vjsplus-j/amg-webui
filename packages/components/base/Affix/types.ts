import type { BaseProps } from '@amg-webui/types'

export interface AffixProps extends BaseProps {
  /** Distance to top when affixed (px) */
  offsetTop?: number
  /** Distance to bottom when affixed (px) */
  offsetBottom?: number
  /** Scroll container — defaults to window */
  target?: string | HTMLElement | Window
  zIndex?: number
  disabled?: boolean
}

export interface AffixScrollPayload {
  scrollTop: number
  fixed: boolean
}

export interface AffixEmits {
  (e: 'change', affixed: boolean): void
  (e: 'scroll', payload: AffixScrollPayload): void
}
