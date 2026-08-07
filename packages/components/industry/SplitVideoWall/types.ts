import type { BaseProps } from '@amg-webui/types'
export type WallLayout = 1 | 4 | 6 | 9 | 16

export interface SplitVideoWallProps extends BaseProps {
  modelValue?: number
  layout?: WallLayout
  selected?: number
  disabled?: boolean
  layouts?: WallLayout[]
  showToolbar?: boolean
  keyboard?: boolean
  aspectRatio?: string
}

export interface SplitVideoWallEmits {
  (e: 'update:modelValue', index: number): void
  (e: 'update:selected', index: number): void
  (e: 'update:layout', layout: WallLayout): void
  (e: 'select', index: number): void
  (e: 'layout-change', layout: WallLayout): void
}
