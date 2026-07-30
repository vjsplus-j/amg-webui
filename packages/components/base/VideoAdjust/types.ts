import type { BaseProps } from '@amg-webui/types'
export interface VideoAdjustProps extends BaseProps {
  brightness?: number
  contrast?: number
  saturation?: number
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface VideoAdjustEmits {
  (e: 'update:brightness', v: number): void
  (e: 'update:contrast', v: number): void
  (e: 'update:saturation', v: number): void
  (e: 'change', payload: { brightness: number; contrast: number; saturation: number }): void
}
