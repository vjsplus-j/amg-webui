import type { BaseProps } from '@amg-webui/types'
import type { AvatarShape, AvatarSize } from '../Avatar/types'

export interface AvatarGroupProps extends BaseProps {
  /** Max visible avatars before +N overflow (default 3; component > global) */
  max?: number
  /** Cascades to child Avatars when they omit size */
  size?: AvatarSize
  /** Cascades to child Avatars when they omit shape */
  shape?: AvatarShape
  /**
   * Cascades appearance to children: neon = dashed track + lightboard marquee.
   */
  variant?: 'default' | 'neon'
  /** Negative margin for stack overlap (token preferred) */
  overlap?: string
  /** Custom overflow / members tooltip (default: joined member labels) */
  maxTooltip?: string
  /** Disable all children + overflow interactions */
  disabled?: boolean
}

/** Object/tuple form — Vite compiler-sfc cannot resolve call-signature emit interfaces from this file */
export type AvatarGroupEmits = {
  overflowClick: [event: MouseEvent]
}

export interface AvatarGroupSlots {
  default?(props: Record<string, never>): unknown
  /** Custom overflow tooltip body */
  overflowTooltip?(props: { overflowCount: number; labels: string[] }): unknown
}
