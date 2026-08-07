export interface AdminRole {
  id: string
  code: string
  name: string
  description: string
  permissionIds: string[]
  userCount: number
  status: 'active' | 'inactive'
  updatedAt: string
}

export interface RoleQuery {
  search?: string
  status?: string
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc' | null
}

export interface PagedResult<T> {
  items: T[]
  total: number
}

export const permissionOptions = [
  { label: 'Users read', value: 'users:read' },
  { label: 'Users write', value: 'users:write' },
  { label: 'Roles read', value: 'roles:read' },
  { label: 'Roles write', value: 'roles:write' },
  { label: 'Orgs read', value: 'orgs:read' },
  { label: 'Orgs write', value: 'orgs:write' },
  { label: 'Settings read', value: 'settings:read' },
  { label: 'Settings write', value: 'settings:write' }
]

const LATENCY_MS = 380

function delay(ms = LATENCY_MS) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const seedRoles: AdminRole[] = [
  {
    id: 'role-admin',
    code: 'admin',
    name: 'Administrator',
    description: 'Full platform access',
    permissionIds: permissionOptions.map((p) => String(p.value)),
    userCount: 1,
    status: 'active',
    updatedAt: '2026-08-07T10:00:00.000Z'
  },
  {
    id: 'role-editor',
    code: 'editor',
    name: 'Editor',
    description: 'Create and edit content',
    permissionIds: ['users:read', 'users:write', 'roles:read', 'orgs:read'],
    userCount: 3,
    status: 'active',
    updatedAt: '2026-08-06T12:00:00.000Z'
  },
  {
    id: 'role-viewer',
    code: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    permissionIds: ['users:read', 'roles:read', 'orgs:read', 'settings:read'],
    userCount: 3,
    status: 'active',
    updatedAt: '2026-08-05T08:30:00.000Z'
  },
  {
    id: 'role-auditor',
    code: 'auditor',
    name: 'Auditor',
    description: 'Compliance read access',
    permissionIds: ['users:read', 'roles:read', 'orgs:read'],
    userCount: 0,
    status: 'inactive',
    updatedAt: '2026-08-04T15:00:00.000Z'
  }
]

let roles: AdminRole[] = [...seedRoles]
let forceListError = false
let forceEmptyList = false
let forceSubmitError = false

export function setForceRoleListError(value: boolean) {
  forceListError = value
}

export function setForceRoleEmptyList(value: boolean) {
  forceEmptyList = value
}

export function setForceRoleSubmitError(value: boolean) {
  forceSubmitError = value
}

function matchesSearch(role: AdminRole, search: string) {
  const q = search.trim().toLowerCase()
  if (!q) return true
  return [role.code, role.name, role.description].some((v) => v.toLowerCase().includes(q))
}

function sortRoles(list: AdminRole[], field?: string, order?: 'asc' | 'desc' | null) {
  if (!field || !order) return list
  const sorted = [...list].sort((a, b) => {
    const av = a[field as keyof AdminRole]
    const bv = b[field as keyof AdminRole]
    if (av === bv) return 0
    if (av == null) return 1
    if (bv == null) return -1
    return String(av).localeCompare(String(bv), undefined, { numeric: true })
  })
  return order === 'desc' ? sorted.reverse() : sorted
}

export async function queryAdminRoles(query: RoleQuery = {}): Promise<PagedResult<AdminRole>> {
  await delay()
  if (forceListError) throw new Error('Mock server failed to load roles')
  if (forceEmptyList) return { items: [], total: 0 }

  let list = roles.filter((role) => {
    if (query.status && query.status !== 'all' && role.status !== query.status) return false
    if (!matchesSearch(role, query.search ?? '')) return false
    return true
  })

  list = sortRoles(list, query.sortField, query.sortOrder)
  const total = list.length
  const page = Math.max(1, query.page ?? 1)
  const pageSize = Math.max(1, query.pageSize ?? 10)
  const start = (page - 1) * pageSize
  return { items: list.slice(start, start + pageSize), total }
}

export async function listAdminRoles(): Promise<AdminRole[]> {
  const result = await queryAdminRoles({ page: 1, pageSize: 100 })
  return result.items
}

export async function createAdminRole(
  payload: Omit<AdminRole, 'id' | 'userCount' | 'updatedAt'>
): Promise<AdminRole> {
  await delay()
  if (forceSubmitError) throw new Error('Mock server rejected role create')
  const row: AdminRole = {
    ...payload,
    id: `role-${Date.now()}`,
    userCount: 0,
    updatedAt: new Date().toISOString()
  }
  roles.unshift(row)
  return row
}

export async function updateAdminRole(
  id: string,
  payload: Partial<Omit<AdminRole, 'id' | 'userCount' | 'updatedAt'>>
): Promise<AdminRole> {
  await delay()
  if (forceSubmitError) throw new Error('Mock server rejected role update')
  const index = roles.findIndex((role) => role.id === id)
  if (index < 0) throw new Error(`Role not found: ${id}`)
  const next: AdminRole = {
    ...roles[index],
    ...payload,
    updatedAt: new Date().toISOString()
  }
  roles[index] = next
  return next
}

export async function deleteAdminRoles(ids: string[]): Promise<void> {
  await delay(300)
  if (forceSubmitError) throw new Error('Mock server rejected role delete')
  roles = roles.filter((role) => !ids.includes(role.id))
}

export async function suggestRoleCodes(query: string): Promise<string[]> {
  await delay(180)
  const q = query.trim().toLowerCase()
  if (!q) return []
  return roles.map((r) => r.code).filter((code) => code.includes(q)).slice(0, 6)
}
