export interface AdminPermission {
  id: string
  key: string
  name: string
  module: string
  description: string
  risk: 'low' | 'medium' | 'high'
  updatedAt: string
}

export type AdminPermissionPayload = Omit<AdminPermission, 'id' | 'updatedAt'>

const LATENCY_MS = 320

function delay(ms = LATENCY_MS) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const seedPermissions: AdminPermission[] = [
  {
    id: 'perm-users-read',
    key: 'users:read',
    name: 'View users',
    module: 'Users',
    description: 'List and inspect user profiles without mutating records.',
    risk: 'low',
    updatedAt: '2026-08-07T11:00:00.000Z'
  },
  {
    id: 'perm-users-write',
    key: 'users:write',
    name: 'Manage users',
    module: 'Users',
    description: 'Create, update, and deactivate user accounts.',
    risk: 'high',
    updatedAt: '2026-08-07T11:00:00.000Z'
  },
  {
    id: 'perm-roles-read',
    key: 'roles:read',
    name: 'View roles',
    module: 'Roles',
    description: 'Inspect role definitions and assigned permission sets.',
    risk: 'low',
    updatedAt: '2026-08-06T15:30:00.000Z'
  },
  {
    id: 'perm-roles-write',
    key: 'roles:write',
    name: 'Manage roles',
    module: 'Roles',
    description: 'Create and edit roles; assign permissions to roles.',
    risk: 'high',
    updatedAt: '2026-08-06T15:30:00.000Z'
  },
  {
    id: 'perm-settings-read',
    key: 'settings:read',
    name: 'View settings',
    module: 'Settings',
    description: 'Read organization and security configuration.',
    risk: 'medium',
    updatedAt: '2026-08-05T09:00:00.000Z'
  },
  {
    id: 'perm-settings-write',
    key: 'settings:write',
    name: 'Manage settings',
    module: 'Settings',
    description: 'Update organization and security configuration.',
    risk: 'high',
    updatedAt: '2026-08-05T09:00:00.000Z'
  },
  {
    id: 'perm-audit-read',
    key: 'audit:read',
    name: 'View audit log',
    module: 'Audit',
    description: 'Read security and administration audit events.',
    risk: 'medium',
    updatedAt: '2026-08-07T10:00:00.000Z'
  },
  {
    id: 'perm-orgs-read',
    key: 'organizations:read',
    name: 'View organizations',
    module: 'Organizations',
    description: 'Browse organization hierarchy and metadata.',
    risk: 'low',
    updatedAt: '2026-08-06T12:00:00.000Z'
  }
]

export const ALL_PERMISSION_KEYS = seedPermissions.map((item) => item.key)

let permissions: AdminPermission[] = [...seedPermissions]

export async function listAdminPermissions(): Promise<AdminPermission[]> {
  await delay()
  return [...permissions]
}

export async function getAdminPermission(id: string): Promise<AdminPermission | null> {
  await delay(180)
  return permissions.find((item) => item.id === id) ?? null
}

export function permissionsForRole(roleKey: string): AdminPermission[] {
  switch (roleKey) {
    case 'admin':
      return permissions
    case 'editor':
      return permissions.filter((item) => item.risk !== 'high' || item.module === 'Users')
    case 'viewer':
      return permissions.filter((item) => item.key.endsWith(':read'))
    default:
      return []
  }
}
