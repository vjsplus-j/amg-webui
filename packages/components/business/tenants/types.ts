import type { BizAccess, BizCrudAdapter, BizPageQuery } from '../_shared'

export type BizTenantStatus = 'active' | 'trial' | 'suspended' | 'archived'
export type BizTenantPlan = 'free' | 'pro' | 'enterprise'

export interface BizTenantUsage {
  users: number
  orders: number
  storageGb?: number
}

export interface BizTenant {
  id: string
  name: string
  slug: string
  plan: BizTenantPlan
  status: BizTenantStatus
  members: number
  region?: string
  domain?: string
  createdAt: string
  /** Isolation counters for the context / detail panel */
  usage?: BizTenantUsage
}

export type BizTenantCreate = Omit<BizTenant, 'id' | 'createdAt' | 'usage'> & {
  usage?: BizTenantUsage
}

export interface BizTenantsProps {
  tenants?: BizTenant[]
  loading?: boolean
  error?: string | null
  title?: string
  access?: BizAccess
  adapter?: BizCrudAdapter<BizTenant, BizTenantCreate, BizTenant>
  page?: number
  pageSize?: number
  total?: number
  /** Controlled active tenant (switcher). */
  activeTenantId?: string | null
}

export interface BizTenantsEmits {
  (e: 'create', tenant: BizTenantCreate): void
  (e: 'update', tenant: BizTenant): void
  (e: 'delete', id: string): void
  (e: 'switch', tenant: BizTenant): void
  (e: 'suspend', id: string): void
  (e: 'activate', id: string): void
  (e: 'view', tenant: BizTenant): void
  (e: 'refresh'): void
  (e: 'page-change', query: BizPageQuery): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
  (e: 'update:activeTenantId', id: string | null): void
}
