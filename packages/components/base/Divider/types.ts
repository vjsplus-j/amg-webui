import type { BaseProps } from '@amg-webui/types'

export type DividerDirection = 'horizontal' | 'vertical'
export type DividerContentPosition = 'left' | 'center' | 'right'

export interface DividerProps extends BaseProps {
  /** Layout axis — `vertical` is the inline `|` pipe separator */
  direction?: DividerDirection
  /** Alias of `direction` (Ant Design–style API) */
  type?: DividerDirection
  contentPosition?: DividerContentPosition
  dashed?: boolean
  borderStyle?: string
}
