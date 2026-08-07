import type { BaseProps } from '@amg-webui/types'

export interface ContextMenuItem {
  label: string
  icon?: string
  disabled?: boolean
  divider?: boolean
  children?: ContextMenuItem[]
  command?: string
}

export interface ContextMenuProps extends BaseProps {
  modelValue?: boolean
  items?: ContextMenuItem[]
  /** External element that opens the menu on contextmenu. When omitted, the default slot host listens. */
  target?: HTMLElement | null
}

export interface ContextMenuEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'show'): void
  (e: 'hide'): void
  (e: 'command', command: string, item: ContextMenuItem): void
}
