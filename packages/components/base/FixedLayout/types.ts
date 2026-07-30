import type { BaseProps } from '@amg-webui/types'

export interface FixedLayoutProps extends BaseProps {
  mode?: 'fixed' | 'absolute'
  position?: 'top' | 'bottom' | 'left' | 'right'
  offset?: 'none' | 'sm' | 'md' | 'lg'
  zIndex?: number
  /**
   * Reserve in-flow space matching the bar so content is not covered.
   * Place the component before main content (top/left) or after (bottom/right).
   */
  placeholder?: boolean
}

export type FixedLayoutEmits = Record<string, never>
