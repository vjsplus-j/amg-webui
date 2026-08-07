import type { BaseProps } from '@amg-webui/types'

export interface AffixProps extends BaseProps {
  modelValue?: boolean
  /** Distance to top when affixed (px) */
  offsetTop?: number
  /** Distance to bottom when affixed (px) */
  offsetBottom?: number
  /** Scroll container — defaults to window */
  target?: string | HTMLElement | Window
  zIndex?: number
  disabled?: boolean
  placeholder?: boolean
  affixedClass?: string
  ariaLive?: 'off' | 'polite' | 'assertive'
}

export interface AffixScrollPayload {
  scrollTop: number
  fixed: boolean
}

export interface AffixEmits {
  (e: 'update:modelValue', affixed: boolean): void
  (e: 'change', affixed: boolean): void
  (e: 'scroll', payload: AffixScrollPayload): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}
