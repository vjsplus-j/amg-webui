import { BaseProps } from '@amg-webui/types'

export interface MenuBarItem {
  label: string
  icon?: string
  disabled?: boolean
  divider?: boolean
  children?: MenuBarItem[]
  command?: string
}

export interface MenuBarProps extends BaseProps {
  modelValue?: string
  items?: MenuBarItem[]
}

export interface MenuBarEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'command', command: string, item: MenuBarItem): void
}