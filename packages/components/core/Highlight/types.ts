import type { BaseProps } from '@amg-webui/types'

export type HighlightVariant = 'mark' | 'underline' | 'background'

export interface HighlightProps extends BaseProps {
  /** Source text to scan */
  text: string
  /** One or more keywords to highlight */
  keyword: string | string[]
  /** Case-insensitive match (default true) */
  ignoreCase?: boolean
  /** Prefer whole-word boundaries (`\b`) when matching */
  matchWholeWord?: boolean
  /** Visual treatment for matches */
  variant?: HighlightVariant
  /** Tighter mark padding for dense search UIs */
  compact?: boolean
  /** Highlight background — prefer CSS Token vars (e.g. var(--warning-100)) */
  color?: string
  /** Highlight foreground — prefer CSS Token vars */
  colorText?: string
  /** Optional accessible label for the highlight region */
  ariaLabel?: string
}

export interface HighlightEmits {
  /** Fired whenever the number of highlighted segments changes */
  (e: 'matchChange', count: number): void
}

export interface HighlightSegment {
  text: string
  highlight: boolean
}
