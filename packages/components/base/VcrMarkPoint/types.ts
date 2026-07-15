import type { BaseProps } from '@amg-webui/types'
export interface VcrMark { id: string; time: number; label: string }
export interface VcrMarkPointProps extends BaseProps { marks?: VcrMark[]; disabled?: boolean }
export interface VcrMarkPointEmits { (e: 'add', mark: Omit<VcrMark, 'id'>): void; (e: 'select', id: string): void; (e: 'remove', id: string): void }
