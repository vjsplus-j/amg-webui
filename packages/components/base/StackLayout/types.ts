import type { BaseProps } from '@amg-webui/types'

export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'section'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type StackJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

export interface StackLayoutProps extends BaseProps {
  direction?: 'vertical' | 'horizontal'
  gap?: StackGap
  align?: StackAlign
  justify?: StackJustify
  /** Allow wrap (useful for horizontal stacks) */
  wrap?: boolean
  /** inline-flex instead of flex + full width */
  inline?: boolean
  /** Stretch to 100% parent width (default true unless inline) */
  block?: boolean
}

export type StackLayoutEmits = Record<string, never>
