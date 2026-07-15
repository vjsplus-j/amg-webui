import type { BaseProps } from '@amg-webui/types'
export interface VcrClipCutProps extends BaseProps { start?: number; end?: number; disabled?: boolean }
export interface VcrClipCutEmits { (e: 'update:start', v: number): void; (e: 'update:end', v: number): void; (e: 'cut', range: { start: number; end: number }): void }
