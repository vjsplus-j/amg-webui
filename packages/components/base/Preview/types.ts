import type { BaseProps } from '@amg-webui/types'

export interface PreviewProps extends BaseProps {
  zoom?: number
  fullscreen?: boolean
}

export interface PreviewEmits {
  (e: 'zoom-change', value: number): void
}
