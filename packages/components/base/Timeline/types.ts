import type { InjectionKey } from 'vue'
import type { BaseProps, Severity } from '@amg-webui/types'

export interface TimelineContext {
  pending?: boolean
}

export const TIMELINE_INJECTION_KEY: InjectionKey<TimelineContext> =
  Symbol('vp-timeline')

export interface TimelineProps extends BaseProps {
  pending?: boolean
}

export type TimelineItemPlacement = 'top' | 'bottom'

export interface TimelineItemProps extends BaseProps {
  type?: Severity
  color?: string
  hollow?: boolean
  timestamp?: string
  placement?: TimelineItemPlacement
}
