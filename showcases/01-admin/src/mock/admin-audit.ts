export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'export'
export type AuditResult = 'success' | 'failure'
export type AuditRisk = 'low' | 'medium' | 'high'

export interface AdminAuditEntry {
  id: string
  actor: string
  action: AuditAction
  resource: string
  resourceId: string
  detail: string
  ip: string
  risk: AuditRisk
  result: AuditResult
  createdAt: string
}

export interface AuditQuery {
  search?: string
  action?: string
  page?: number
  pageSize?: number
}

export interface PagedResult<T> {
  items: T[]
  total: number
}

const LATENCY_MS = 380

function delay(ms = LATENCY_MS) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const seedLogs: AdminAuditEntry[] = [
  {
    id: 'audit-1',
    actor: 'alice',
    action: 'login',
    resource: 'session',
    resourceId: 'sess-1001',
    detail: 'Successful login from trusted network',
    ip: '192.168.1.42',
    risk: 'low',
    result: 'success',
    createdAt: '2026-08-08T01:15:00.000Z'
  },
  {
    id: 'audit-2',
    actor: 'bob',
    action: 'update',
    resource: 'user',
    resourceId: 'user-2',
    detail: 'Updated role assignment',
    ip: '10.0.0.18',
    risk: 'medium',
    result: 'success',
    createdAt: '2026-08-07T22:40:00.000Z'
  },
  {
    id: 'audit-3',
    actor: 'alice',
    action: 'delete',
    resource: 'role',
    resourceId: 'role-legacy',
    detail: 'Removed deprecated role',
    ip: '192.168.1.42',
    risk: 'high',
    result: 'success',
    createdAt: '2026-08-07T18:05:00.000Z'
  },
  {
    id: 'audit-4',
    actor: 'carol',
    action: 'export',
    resource: 'users',
    resourceId: 'export-8842',
    detail: 'Exported user directory CSV',
    ip: '172.16.0.9',
    risk: 'medium',
    result: 'success',
    createdAt: '2026-08-07T16:20:00.000Z'
  },
  {
    id: 'audit-5',
    actor: 'system',
    action: 'login',
    resource: 'session',
    resourceId: 'sess-0999',
    detail: 'Failed login attempt — invalid password',
    ip: '203.0.113.44',
    risk: 'high',
    result: 'failure',
    createdAt: '2026-08-07T14:00:00.000Z'
  }
]

let logs: AdminAuditEntry[] = [...seedLogs]
let forceListError = false
let forceEmptyList = false

export function setForceAuditListError(value: boolean) {
  forceListError = value
}

export function setForceAuditEmptyList(value: boolean) {
  forceEmptyList = value
}

/** Alias used by AuditPage showcase controls. */
export function setForceAuditError(value: boolean) {
  setForceAuditListError(value)
}

/** Alias used by AuditPage showcase controls. */
export function setForceAuditEmpty(value: boolean) {
  setForceAuditEmptyList(value)
}

export async function queryAuditLogs(query: AuditQuery = {}): Promise<PagedResult<AdminAuditEntry>> {
  await delay()
  if (forceListError) throw new Error('Mock audit service unavailable')
  if (forceEmptyList) return { items: [], total: 0 }

  const search = query.search?.trim().toLowerCase() ?? ''
  const action = query.action ?? 'all'
  let filtered = [...logs]

  if (search) {
    filtered = filtered.filter(
      (row) =>
        row.actor.toLowerCase().includes(search) ||
        row.resource.toLowerCase().includes(search) ||
        row.detail.toLowerCase().includes(search)
    )
  }
  if (action !== 'all') {
    filtered = filtered.filter((row) => row.action === action)
  }

  const page = Math.max(1, query.page ?? 1)
  const pageSize = Math.max(1, query.pageSize ?? 10)
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return { items, total: filtered.length }
}

/** Flat list for AuditPage table. */
export async function queryAdminAudit(): Promise<AdminAuditEntry[]> {
  const result = await queryAuditLogs({ page: 1, pageSize: 100 })
  return result.items
}
