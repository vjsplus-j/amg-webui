import type { BaseProps } from '@amg-webui/types'

export interface CollapsePanel {
  key: string
  title: string
  content?: string
  disabled?: boolean
}

export interface CollapseProps extends BaseProps {
  /** Controlled open keys */
  modelValue?: string | string[]
  /** Panel list (slot per key still supported) */
  panels?: CollapsePanel[]
  /** Only one panel open at a time (default true) */
  accordion?: boolean
  disabled?: boolean
  /** Optional section heading above panels */
  title?: string
  bordered?: boolean
  /** Ghost — no card chrome */
  ghost?: boolean
}

export interface CollapseEmits {
  (e: 'update:modelValue', value: string | string[]): void
  (e: 'change', value: string | string[]): void
  (e: 'expand', payload: { key: string; activeKeys: string | string[] }): void
  (e: 'collapse', payload: { key: string; activeKeys: string | string[] }): void
}
