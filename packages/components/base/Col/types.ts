import type { BaseProps } from '@amg-webui/types'

export interface ColProps extends BaseProps {
  /** 1–24 column span */
  span?: number
  /** Offset before this col (0–23) */
  offset?: number
  push?: number
  pull?: number
  /** Grow to fill remaining row space */
  flex?: boolean
  /** Order within the row */
  order?: number
}

export interface ColEmits {
  (e: 'click', event: MouseEvent): void
}
