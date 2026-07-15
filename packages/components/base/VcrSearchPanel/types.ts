import type { BaseProps } from '@amg-webui/types'
export interface VcrSearchPanelProps extends BaseProps { date?: string; device?: string; disabled?: boolean; loading?: boolean }
export interface VcrSearchPanelEmits { (e: 'update:date', v: string): void; (e: 'update:device', v: string): void; (e: 'search'): void }
