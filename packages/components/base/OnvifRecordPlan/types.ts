import type { BaseProps } from '@amg-webui/types'
export interface OnvifRecordPlanProps extends BaseProps { slots?: boolean[]; disabled?: boolean }
export interface OnvifRecordPlanEmits { (e: 'update:slots', v: boolean[]): void; (e: 'toggle', index: number, on: boolean): void }
