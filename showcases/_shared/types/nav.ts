export interface ShowcaseNavItem {
  path: string
  label: string
  /** Permission key required to show this nav item (omit for all authenticated users). */
  permission?: string
}
