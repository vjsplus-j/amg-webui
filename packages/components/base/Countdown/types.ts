import type { BaseProps } from '@amg-webui/types'

export interface CountdownProps extends BaseProps {
  value: number | Date
  format?: string
  millisecond?: boolean
}

export interface CountdownEmits {
  (e: 'finish'): void
  (e: 'tick', remainingMs: number): void
}
