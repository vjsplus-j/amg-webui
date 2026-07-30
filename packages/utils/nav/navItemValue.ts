import type { NavItem } from './types'

/** Resolve selection key — prefer `value`, fall back to `label`. */
export function navItemValue(item: NavItem): string | number {
  return item.value ?? item.label
}

export function isNavItemActive(
  item: NavItem,
  modelValue: string | number | undefined | null
): boolean {
  if (modelValue === undefined || modelValue === null) return false
  return navItemValue(item) === modelValue
}
