import type { BaseProps } from '@amg-webui/types'

export type HeaderPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'page'

export interface HeaderProps extends BaseProps {
  sticky?: boolean
  /** Viewport-fixed bar (implies sticky stacking) */
  fixed?: boolean
  bordered?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** Horizontal padding token; default follows size / page pad */
  padding?: HeaderPadding
  /** Soft glass surface (default true) */
  translucent?: boolean
}
