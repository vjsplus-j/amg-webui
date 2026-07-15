import type { BaseProps } from '@amg-webui/types'
export interface VideoVolumeProps extends BaseProps { modelValue?: number; muted?: boolean; disabled?: boolean }
export interface VideoVolumeEmits { (e: 'update:modelValue', v: number): void; (e: 'update:muted', v: boolean): void; (e: 'change', v: number): void }
