import type { BaseProps } from '@amg-webui/types'

export interface UserInfoCardProps extends BaseProps {
  name?: string
  role?: string
  department?: string
  email?: string
  avatar?: string
  status?: 'online' | 'offline' | 'busy'
}

export interface UserInfoCardEmits {
  (e: 'edit'): void
  (e: 'action', action: string): void
}
