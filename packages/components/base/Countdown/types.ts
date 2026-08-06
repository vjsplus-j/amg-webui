import type { BaseProps } from '@amg-webui/types'

export interface CountdownProps extends BaseProps {
  modelValue?: number
  value: number | Date
  format?: string
  millisecond?: boolean
  autoStart?: boolean
  paused?: boolean
  interval?: number
  prefix?: string
  suffix?: string
  showControls?: boolean
}

export interface CountdownEmits {
  (e: 'update:modelValue', remainingMs: number): void
  (e: 'finish'): void
  (e: 'tick', remainingMs: number): void
  (e: 'start', remainingMs: number): void
  (e: 'pause', remainingMs: number): void
  (e: 'resume', remainingMs: number): void
  (e: 'reset', remainingMs: number): void
}
