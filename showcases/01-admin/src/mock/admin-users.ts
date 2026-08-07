export type AdminUserRole = 'admin' | 'editor' | 'viewer'
export type AdminUserStatus = 'active' | 'inactive'

export interface AdminUser {
  id: string
  username: string
  displayName: string
  email: string
  phone: string
  department: string
  orgId: string
  role: AdminUserRole
  roleIds: string[]
  status: AdminUserStatus
  sortOrder: number
  remark: string
  updatedAt: string
}

export type AdminUserPayload = Omit<AdminUser, 'id' | 'updatedAt'>

export interface UserQuery {
  search?: string
  status?: string
  role?: string
  orgId?: string
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc' | null
}

export interface PagedResult<T> {
  items: T[]
  total: number
}

const LATENCY_MS = 420

function delay(ms = LATENCY_MS) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const seedUsers: AdminUser[] = [
  {
    id: 'user-1',
    username: 'alice',
    displayName: 'Alice Chen',
    email: 'alice@example.com',
    phone: '+86 138 0000 1001',
    department: 'Engineering',
    orgId: 'org-eng',
    role: 'admin',
    roleIds: ['role-admin', 'role-editor'],
    status: 'active',
    sortOrder: 10,
    remark: 'Platform owner',
    updatedAt: '2026-08-07T10:00:00.000Z'
  },
  {
    id: 'user-2',
    username: 'bob',
    displayName: 'Bob Miller',
    email: 'bob@example.com',
    phone: '+86 138 0000 1002',
    department: 'Operations',
    orgId: 'org-ops',
    role: 'editor',
    roleIds: ['role-editor'],
    status: 'active',
    sortOrder: 20,
    remark: '',
    updatedAt: '2026-08-06T14:30:00.000Z'
  },
  {
    id: 'user-3',
    username: 'carol',
    displayName: 'Carol Sun',
    email: 'carol@example.com',
    phone: '+86 138 0000 1003',
    department: 'Support',
    orgId: 'org-support',
    role: 'viewer',
    roleIds: ['role-viewer'],
    status: 'inactive',
    sortOrder: 30,
    remark: 'Seasonal contractor',
    updatedAt: '2026-08-05T09:15:00.000Z'
  },
  {
    id: 'user-4',
    username: 'dave',
    displayName: 'Dave Wu',
    email: 'dave@example.com',
    phone: '+86 138 0000 1004',
    department: 'Engineering',
    orgId: 'org-eng-fe',
    role: 'editor',
    roleIds: ['role-editor'],
    status: 'active',
    sortOrder: 40,
    remark: '',
    updatedAt: '2026-08-04T11:20:00.000Z'
  },
  {
    id: 'user-5',
    username: 'eva',
    displayName: 'Eva Park',
    email: 'eva@example.com',
    phone: '+86 138 0000 1005',
    department: 'Operations',
    orgId: 'org-ops',
    role: 'viewer',
    roleIds: ['role-viewer'],
    status: 'active',
    sortOrder: 50,
    remark: '',
    updatedAt: '2026-08-03T16:45:00.000Z'
  },
  {
    id: 'user-6',
    username: 'frank',
    displayName: 'Frank Li',
    email: 'frank@example.com',
    phone: '+86 138 0000 1006',
    department: 'Support',
    orgId: 'org-support',
    role: 'editor',
    roleIds: ['role-editor', 'role-viewer'],
    status: 'inactive',
    sortOrder: 60,
    remark: 'On leave',
    updatedAt: '2026-08-02T08:00:00.000Z'
  }
]

let users: AdminUser[] = [...seedUsers]
let forceSubmitError = false
let forceListError = false
let forceEmptyList = false

export function setForceSubmitError(value: boolean) {
  forceSubmitError = value
}

export function setForceListError(value: boolean) {
  forceListError = value
}

export function setForceEmptyList(value: boolean) {
  forceEmptyList = value
}

function matchesSearch(user: AdminUser, search: string) {
  const q = search.trim().toLowerCase()
  if (!q) return true
  return [user.username, user.displayName, user.email, user.department].some((v) =>
    v.toLowerCase().includes(q)
  )
}

function sortUsers(list: AdminUser[], field?: string, order?: 'asc' | 'desc' | null) {
  if (!field || !order) return list
  const sorted = [...list].sort((a, b) => {
    const av = a[field as keyof AdminUser]
    const bv = b[field as keyof AdminUser]
    if (av === bv) return 0
    if (av == null) return 1
    if (bv == null) return -1
    return String(av).localeCompare(String(bv), undefined, { numeric: true })
  })
  return order === 'desc' ? sorted.reverse() : sorted
}

export async function queryAdminUsers(query: UserQuery = {}): Promise<PagedResult<AdminUser>> {
  await delay()
  if (forceListError) throw new Error('Mock server failed to load users')
  if (forceEmptyList) return { items: [], total: 0 }

  let list = users.filter((user) => {
    if (query.status && query.status !== 'all' && user.status !== query.status) return false
    if (query.role && query.role !== 'all' && user.role !== query.role) return false
    if (query.orgId && query.orgId !== 'all' && user.orgId !== query.orgId) return false
    if (!matchesSearch(user, query.search ?? '')) return false
    return true
  })

  list = sortUsers(list, query.sortField, query.sortOrder)
  const total = list.length
  const page = Math.max(1, query.page ?? 1)
  const pageSize = Math.max(1, query.pageSize ?? 10)
  const start = (page - 1) * pageSize
  const items = list.slice(start, start + pageSize)
  return { items, total }
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const result = await queryAdminUsers({ page: 1, pageSize: 1000 })
  return result.items
}

export async function getAdminUser(id: string): Promise<AdminUser | null> {
  await delay()
  return users.find((user) => user.id === id) ?? null
}

export async function createAdminUser(payload: AdminUserPayload): Promise<AdminUser> {
  await delay()
  if (forceSubmitError) throw new Error('Mock server rejected create request')
  const row: AdminUser = {
    ...payload,
    id: `user-${Date.now()}`,
    updatedAt: new Date().toISOString()
  }
  users.unshift(row)
  return row
}

export async function updateAdminUser(
  id: string,
  payload: Partial<AdminUserPayload>
): Promise<AdminUser> {
  await delay()
  if (forceSubmitError) throw new Error('Mock server rejected update request')
  const index = users.findIndex((user) => user.id === id)
  if (index < 0) throw new Error(`User not found: ${id}`)
  const next: AdminUser = {
    ...users[index],
    ...payload,
    updatedAt: new Date().toISOString()
  }
  users[index] = next
  return next
}

export async function deleteAdminUsers(ids: string[]): Promise<void> {
  await delay(300)
  if (forceSubmitError) throw new Error('Mock server rejected delete request')
  users = users.filter((user) => !ids.includes(user.id))
}

/** Async validation demo — reserved system username. */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  await delay(280)
  const normalized = username.trim().toLowerCase()
  if (!normalized) return true
  if (normalized === 'root' || normalized === 'system') return false
  return !users.some((user) => user.username.toLowerCase() === normalized)
}

export async function suggestUsernames(query: string): Promise<string[]> {
  await delay(200)
  const q = query.trim().toLowerCase()
  if (!q) return []
  const pool = users.map((u) => u.username).filter((name) => name.toLowerCase().includes(q))
  return [...new Set(pool)].slice(0, 8)
}

export interface LoginPayload {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResult {
  ok: boolean
  error?: string
  username?: string
  permissions?: string[]
}

const ADMIN_PERMISSIONS = [
  'users:read',
  'users:write',
  'roles:read',
  'roles:write',
  'settings:read',
  'settings:write',
  'audit:read',
  'organizations:read'
]

const VIEWER_PERMISSIONS = ['users:read', 'roles:read', 'organizations:read']

export async function mockLogin(payload: LoginPayload): Promise<LoginResult> {
  await delay(500)
  const username = payload.username.trim()
  const password = payload.password
  if (!username || !password) {
    return { ok: false, error: 'Username and password are required' }
  }
  if (username === 'admin' && password === 'admin123') {
    return { ok: true, username: 'admin', permissions: ADMIN_PERMISSIONS }
  }
  if (username === 'user' && password === 'user123') {
    return { ok: true, username: 'user', permissions: VIEWER_PERMISSIONS }
  }
  return { ok: false, error: 'Invalid username or password' }
}
