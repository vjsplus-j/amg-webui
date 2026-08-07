import type { BaseProps, DisabledProps } from '@amg-webui/types'
import type { SanitizeHtmlOptions } from '@amg-webui/security'

export interface RichTextProps extends BaseProps, DisabledProps {
  modelValue?: string
  placeholder?: string
  /** Sanitize HTML on read/write (default true). */
  sanitize?: boolean
  /** Passed to sanitizeHtml when sanitize is enabled. */
  sanitizeOptions?: SanitizeHtmlOptions
  /** Max undo stack depth (default 50). */
  historyLimit?: number
  ariaLabel?: string
}

export interface RichTextEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

export type RichTextCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'unorderedList'
  | 'link'
  | 'undo'
  | 'redo'
