import type { BaseProps } from '@amg-webui/types'
export interface VcrStorageVolume { id: string; name: string; used: number; total: number }
export interface VcrStorageDashboardProps extends BaseProps { volumes?: VcrStorageVolume[]; disabled?: boolean }
export interface VcrStorageDashboardEmits { (e: 'refresh'): void }
