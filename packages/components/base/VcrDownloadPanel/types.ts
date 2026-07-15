import type { BaseProps } from '@amg-webui/types'
export interface VcrDownloadItem { id: string; name: string; progress: number; status: 'pending' | 'running' | 'done' }
export interface VcrDownloadPanelProps extends BaseProps { items?: VcrDownloadItem[]; disabled?: boolean }
export interface VcrDownloadPanelEmits { (e: 'download', id: string): void; (e: 'cancel', id: string): void }
