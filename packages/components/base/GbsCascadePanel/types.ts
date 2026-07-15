import type { BaseProps } from '@amg-webui/types'
export interface GbsCascadePanelProps extends BaseProps { upstream?: string; downstream?: string; disabled?: boolean }
export interface GbsCascadePanelEmits { (e: 'update:upstream', v: string): void; (e: 'update:downstream', v: string): void; (e: 'save'): void }
