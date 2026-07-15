export interface BizUser {
  id: string | number
  name: string
  email: string
  phone?: string
  role: string
  status: 'active' | 'disabled' | string
}

export interface BizUsersProps {
  users: BizUser[]
  loading?: boolean
  title?: string
  roles?: { value: string; label: string }[]
}

export interface BizUsersEmits {
  (e: 'create', user: Omit<BizUser, 'id'>): void
  (e: 'update', user: BizUser): void
  (e: 'delete', id: BizUser['id']): void
  (e: 'refresh'): void
}
