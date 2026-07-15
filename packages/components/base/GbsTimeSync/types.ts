import type { BaseProps } from '@amg-webui/types'
export interface GbsTimeSyncProps extends BaseProps { server?: string; disabled?: boolean; syncing?: boolean }
export interface GbsTimeSyncEmits { (e: 'sync'): void; (e: 'update:server', v: string): void }
