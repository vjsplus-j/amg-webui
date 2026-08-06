/** Shared nav item model for *Nav / Dropdown / Anchor family. */
export interface NavItem {
  label: string
  value?: string | number
  icon?: string
  description?: string
  badge?: string | number
  disabled?: boolean
  href?: string
  to?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
  children?: NavItem[]
  /** item = selectable · divider = separator · group = non-selectable heading */
  type?: 'item' | 'divider' | 'group'
}
