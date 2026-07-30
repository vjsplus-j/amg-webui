import type { BaseProps } from '@amg-webui/types'
export interface VcrBackupTaskItem {
  id: string
  name: string
  progress: number
  status: 'pending' | 'running' | 'done'
}

export interface VcrBackupTaskProps extends BaseProps {
  tasks?: VcrBackupTaskItem[]
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface VcrBackupTaskEmits {
  (e: 'start', id: string): void
}
