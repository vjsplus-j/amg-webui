import type { BaseProps } from '@amg-webui/types'
export interface OnvifRecordPlanProps extends BaseProps {
  slots?: boolean[]
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface OnvifRecordPlanEmits {
  (e: 'update:slots', v: boolean[]): void
  (e: 'toggle', index: number, on: boolean): void
}
