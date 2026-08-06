import type { BizAccess, BizCrudAdapter, BizPageQuery } from '../_shared'

export interface BizUser {
  id: string | number
  name: string
  email: string
  phone?: string
  role: string
  status: 'active' | 'disabled' | string
  avatar?: string
  permissions?: string[]
}

export type BizUserCreate = Omit<BizUser, 'id'>

export interface BizUsersProps {
  /** Controlled list (used when adapter is omitted). */
  users?: BizUser[]
  loading?: boolean
  error?: string | null
  title?: string
  roles?: { value: string; label: string }[]
  /** Available permission codes for the ACL editor. */
  permissionOptions?: { value: string; label: string }[]
  access?: BizAccess
  adapter?: BizCrudAdapter<BizUser, BizUserCreate, BizUser>
  page?: number
  pageSize?: number
  total?: number
  currencyEmpty?: boolean
}

export interface BizUsersEmits {
  (e: 'create', user: BizUserCreate): void
  (e: 'update', user: BizUser): void
  (e: 'delete', id: BizUser['id']): void
  (e: 'refresh'): void
  (e: 'view', user: BizUser): void
  (e: 'page-change', query: BizPageQuery): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}
