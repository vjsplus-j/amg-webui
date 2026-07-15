import type { BaseProps } from '@amg-webui/types'
export interface OnvifUrlFormProps extends BaseProps { modelValue?: string; disabled?: boolean }
export interface OnvifUrlFormEmits { (e: 'update:modelValue', v: string): void; (e: 'test', url: string): void; (e: 'invalid'): void }
