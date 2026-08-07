import type { CascaderOption } from 'amg-webui'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'

export interface AdminOrganization {
  id: string
  name: string
  code: string
  parentId: string | null
  leader: string
  status: 'active' | 'inactive'
  sortOrder: number
  updatedAt: string
}

const LATENCY_MS = 360

function delay(ms = LATENCY_MS) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

const seedOrgs: AdminOrganization[] = [
  {
    id: 'org-root',
    name: 'AMG Group',
    code: 'amg',
    parentId: null,
    leader: 'Alice Chen',
    status: 'active',
    sortOrder: 0,
    updatedAt: '2026-08-07T10:00:00.000Z'
  },
  {
    id: 'org-eng',
    name: 'Engineering',
    code: 'eng',
    parentId: 'org-root',
    leader: 'Dave Wu',
    status: 'active',
    sortOrder: 10,
    updatedAt: '2026-08-07T09:00:00.000Z'
  },
  {
    id: 'org-eng-fe',
    name: 'Frontend',
    code: 'eng-fe',
    parentId: 'org-eng',
    leader: 'Dave Wu',
    status: 'active',
    sortOrder: 11,
    updatedAt: '2026-08-06T14:00:00.000Z'
  },
  {
    id: 'org-eng-be',
    name: 'Backend',
    code: 'eng-be',
    parentId: 'org-eng',
    leader: 'Alice Chen',
    status: 'active',
    sortOrder: 12,
    updatedAt: '2026-08-06T13:00:00.000Z'
  },
  {
    id: 'org-ops',
    name: 'Operations',
    code: 'ops',
    parentId: 'org-root',
    leader: 'Bob Miller',
    status: 'active',
    sortOrder: 20,
    updatedAt: '2026-08-05T11:00:00.000Z'
  },
  {
    id: 'org-support',
    name: 'Support',
    code: 'support',
    parentId: 'org-root',
    leader: 'Carol Sun',
    status: 'active',
    sortOrder: 30,
    updatedAt: '2026-08-04T10:00:00.000Z'
  }
]

let orgs: AdminOrganization[] = [...seedOrgs]
let forceListError = false
let forceSubmitError = false

export function setForceOrgListError(value: boolean) {
  forceListError = value
}

export function setForceOrgSubmitError(value: boolean) {
  forceSubmitError = value
}

export async function listAdminOrganizations(): Promise<AdminOrganization[]> {
  await delay()
  if (forceListError) throw new Error('Mock server failed to load organizations')
  return [...orgs].sort((a, b) => a.sortOrder - b.sortOrder)
}

function buildChildren(parentId: string | null): TreeNode[] {
  return orgs
    .filter((org) => org.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((org) => ({
      label: org.name,
      value: org.id,
      children: buildChildren(org.id)
    }))
}

export async function getOrganizationTree(): Promise<TreeNode[]> {
  const list = await listAdminOrganizations()
  orgs = list
  return buildChildren(null)
}

function buildCascaderChildren(parentId: string | null): CascaderOption[] {
  return orgs
    .filter((org) => org.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((org) => ({
      label: org.name,
      value: org.id,
      children: buildCascaderChildren(org.id)
    }))
}

export async function getOrganizationCascaderOptions(): Promise<CascaderOption[]> {
  await listAdminOrganizations()
  return buildCascaderChildren(null)
}

export function getOrganizationTreeSelectOptions() {
  return orgs
    .filter((org) => org.parentId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((org) => toTreeSelectOption(org.id))

  function toTreeSelectOption(id: string) {
    const org = orgs.find((o) => o.id === id)!
    const children = orgs
      .filter((o) => o.parentId === id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((child) => toTreeSelectOption(child.id))
    return {
      label: org.name,
      value: org.id,
      children: children.length ? children : undefined
    }
  }
}

export async function createAdminOrganization(
  payload: Omit<AdminOrganization, 'id' | 'updatedAt'>
): Promise<AdminOrganization> {
  await delay()
  if (forceSubmitError) throw new Error('Mock server rejected organization create')
  const row: AdminOrganization = {
    ...payload,
    id: `org-${Date.now()}`,
    updatedAt: new Date().toISOString()
  }
  orgs.push(row)
  return row
}

export async function updateAdminOrganization(
  id: string,
  payload: Partial<Omit<AdminOrganization, 'id' | 'updatedAt'>>
): Promise<AdminOrganization> {
  await delay()
  if (forceSubmitError) throw new Error('Mock server rejected organization update')
  const index = orgs.findIndex((org) => org.id === id)
  if (index < 0) throw new Error(`Organization not found: ${id}`)
  const next: AdminOrganization = {
    ...orgs[index],
    ...payload,
    updatedAt: new Date().toISOString()
  }
  orgs[index] = next
  return next
}

export async function deleteAdminOrganization(id: string): Promise<void> {
  await delay(300)
  if (forceSubmitError) throw new Error('Mock server rejected organization delete')
  const hasChildren = orgs.some((org) => org.parentId === id)
  if (hasChildren) throw new Error('Cannot delete organization with child nodes')
  orgs = orgs.filter((org) => org.id !== id)
}

export function findOrganizationName(id: string | null | undefined): string {
  if (!id) return '—'
  return orgs.find((org) => org.id === id)?.name ?? id
}
