import type { BaseProps } from '@amg-webui/types'

export type FormLayoutMode = 'horizontal' | 'vertical' | 'inline'

export type FormLayoutColumns = 1 | 2 | 3

export interface FormLayoutProps extends BaseProps {
  /** Label + control arrangement */
  layout?: FormLayoutMode
  /** Multi-column grid for horizontal / vertical layouts */
  columns?: FormLayoutColumns
  /** Append colon suffix to labels via `--vp-form-layout-colon` */
  colon?: boolean
  labelWidth?: 'sm' | 'md' | 'lg' | 'auto'
  gap?: 'sm' | 'md' | 'lg'
}

export interface FormLayoutEmits {
  (e: 'layout-change', layout: FormLayoutMode): void
}
