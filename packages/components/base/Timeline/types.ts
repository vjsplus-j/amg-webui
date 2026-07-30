import type { ComputedRef, InjectionKey } from 'vue'
import type { BaseProps, Severity } from '@amg-webui/types'

export type TimelineMode = 'left' | 'right' | 'alternate'

export interface TimelineContext {
  mode: ComputedRef<TimelineMode>
  pending: ComputedRef<boolean | string>
  reverse: ComputedRef<boolean>
  claimIndex: () => number
}

export const TIMELINE_INJECTION_KEY: InjectionKey<TimelineContext> =
  Symbol('vp-timeline')

export interface TimelineProps extends BaseProps {
  /** Axis alignment — alternate splits nodes left / right */
  mode?: TimelineMode
  /** Trailing pending node — `true` uses default copy, string uses custom label */
  pending?: boolean | string
  /** Reverse visual order of items */
  reverse?: boolean
}

export type TimelineItemTimestampPlacement = 'top' | 'bottom'

export type TimelineItemSide = 'left' | 'right'

export type TimelineItemColor = Severity | (string & {})

export interface TimelineItemProps extends BaseProps {
  /** Semantic severity when `color` is not a custom CSS value */
  type?: Severity
  /** Semantic name (`primary` …) or CSS color / `var(--…)` */
  color?: TimelineItemColor
  hollow?: boolean
  /** Side label shown above body */
  label?: string
  timestamp?: string
  /** Timestamp position relative to body */
  placement?: TimelineItemTimestampPlacement
  /** Alternate-mode side override */
  side?: TimelineItemSide
}

export type TimelineEmits = Record<string, never>

export type TimelineItemEmits = Record<string, never>
