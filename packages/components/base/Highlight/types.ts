import type { BaseProps } from '@amg-webui/types'

export interface HighlightProps extends BaseProps {
  /** Source text to scan */
  text: string
  /** One or more keywords to highlight */
  keyword: string | string[]
  /** Case-insensitive match (default true) */
  ignoreCase?: boolean
  /** Highlight background — prefer CSS Token vars (e.g. var(--warning-100)) */
  color?: string
  /** Highlight foreground — prefer CSS Token vars */
  colorText?: string
}

export interface HighlightSegment {
  text: string
  highlight: boolean
}
