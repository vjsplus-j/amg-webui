import type { BaseProps } from '@amg-webui/types'

export type FooterPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'page'

export interface FooterProps extends BaseProps {
  bordered?: boolean
  align?: 'start' | 'center' | 'end'
  size?: 'sm' | 'md' | 'lg'
  sticky?: boolean
  fixed?: boolean
  padding?: FooterPadding
}

export interface FooterEmits {
  (e: 'click', event: MouseEvent): void
}
