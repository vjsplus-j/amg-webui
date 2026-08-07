import { computed } from 'vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'
import { useAdminAuth } from './useAdminAuth'

export const ADMIN_NAV_ITEMS: ShowcaseNavItem[] = [
  { path: '/', label: 'Dashboard' },
  { path: '/users', label: 'Users', permission: 'users:read' },
  { path: '/roles', label: 'Roles', permission: 'roles:read' },
  { path: '/permissions', label: 'Permissions', permission: 'roles:read' },
  { path: '/organizations', label: 'Organizations', permission: 'organizations:read' },
  { path: '/audit', label: 'Audit', permission: 'audit:read' },
  { path: '/settings', label: 'Settings', permission: 'settings:read' }
]

export function useAdminNav() {
  const { hasPermission } = useAdminAuth()

  const navItems = computed(() =>
    ADMIN_NAV_ITEMS.filter((item) => !item.permission || hasPermission(item.permission))
  )

  return { navItems, allNavItems: ADMIN_NAV_ITEMS }
}
