/** Shared nav item model for *Nav / Dropdown / Anchor family. */
export interface NavItem {
  label: string
  value?: string | number
  icon?: string
  disabled?: boolean
  href?: string
  to?: string
  children?: NavItem[]
  /** item = selectable · divider = separator · group = non-selectable heading */
  type?: 'item' | 'divider' | 'group'
}
