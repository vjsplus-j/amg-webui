import type { BaseProps } from '@amg-webui/types'
export type VcrSpeed = 0.5 | 1 | 2 | 4 | 8
export interface VcrSpeedControlProps extends BaseProps { modelValue?: VcrSpeed; disabled?: boolean }
export interface VcrSpeedControlEmits { (e: 'update:modelValue', v: VcrSpeed): void; (e: 'change', v: VcrSpeed): void }
