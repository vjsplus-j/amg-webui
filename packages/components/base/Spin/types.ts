import type { BaseProps, Size } from '@amg-webui/types'

export type SpinSize = Size

export interface SpinProps extends BaseProps {
  /** Show spinner overlay (default true) */
  spinning?: boolean
  /** Tip under the spinner */
  tip?: string
  size?: SpinSize
  /** Delay before showing spinner (ms) — reduces flash */
  delay?: number
  /** Full-bleed overlay when wrapping slotted content */
  fullscreen?: boolean
}
