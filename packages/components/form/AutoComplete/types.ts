import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export type AutoCompleteSuggestion = string | { value: string; label?: string }

export interface AutoCompleteProps extends BaseProps, DisabledProps {
  modelValue?: string
  id?: string
  name?: string
  invalid?: boolean
  suggestions?: AutoCompleteSuggestion[]
  placeholder?: string
  debounce?: number
  size?: Size
  fluid?: boolean
  ariaLabel?: string
}

export interface AutoCompleteEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'fetchSuggestions', query: string, cb: (items: AutoCompleteSuggestion[]) => void): void
  (e: 'select', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

export interface AutoCompleteSlots {
  /** Trailing auxiliary content beside the control */
  default?(props: Record<string, never>): unknown
  /** Custom suggestion row in the dropdown */
  option?(props: { item: { value: string; label: string }; index: number }): unknown
  /** Empty state when no suggestions match */
  empty?(props: Record<string, never>): unknown
  /** Loading indicator while remote suggestions load */
  loading?(props: Record<string, never>): unknown
}

export interface AutoCompleteExpose {
  focus: () => void
  blur: () => void
  open: () => void
  close: () => void
  clear: () => void
}
