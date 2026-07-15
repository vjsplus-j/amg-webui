import type { BaseProps } from '@amg-webui/types'
export type WallLayout = 1 | 4 | 9
export interface SplitVideoWallProps extends BaseProps { layout?: WallLayout; selected?: number; disabled?: boolean }
export interface SplitVideoWallEmits {
  (e: 'update:selected', index: number): void
  (e: 'select', index: number): void
  (e: 'layout-change', layout: WallLayout): void
}
