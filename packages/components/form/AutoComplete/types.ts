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
