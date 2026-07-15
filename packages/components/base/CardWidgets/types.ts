import type { BaseProps } from '@amg-webui/types'

/** Default ABCD keys — order is swapable via drag */
export const CARD_WIDGET_DEFAULT_KEYS = ['a', 'b', 'c', 'd'] as const

export type CardWidgetKey = string

export interface CardWidgetItem {
  /** Slot name + id, e.g. a / b / c / d */
  key: CardWidgetKey
  /** Optional label on the tile chrome (defaults to uppercased key) */
  title?: string
}

export interface CardWidgetsProps extends BaseProps {
  /**
   * Ordered widget keys. Defaults to ['a','b','c','d'].
   * Dragging swaps two keys (and their slot contents) in this list.
   */
  modelValue?: CardWidgetKey[]
  /** Optional metadata for tiles (title); missing keys fall back to modelValue order */
  widgets?: CardWidgetItem[]
  /** Grid columns — 1 / 2 / 4 (default 2 for ABCD) */
  cols?: 1 | 2 | 3 | 4
  /** Disable drag & swap */
  disabled?: boolean
  /** Show drag handle affordance (default true) */
  showHandle?: boolean
}

export interface CardWidgetsEmits {
  (e: 'update:modelValue', value: CardWidgetKey[]): void
  /** Fired after a successful slot swap */
  (e: 'change', value: CardWidgetKey[]): void
  /** Fired after a successful swap with from/to detail */
  (e: 'swap', payload: { from: CardWidgetKey; to: CardWidgetKey; order: CardWidgetKey[] }): void
  /**
   * Fired when a drag gesture ends (drop or cancel).
   * Use for toast / analytics; prefer `change` for persistence.
   */
  (
    e: 'dragEnd',
    payload: {
      order: CardWidgetKey[]
      swapped: boolean
      from?: CardWidgetKey
      to?: CardWidgetKey
    }
  ): void
}
