import type { BaseProps } from '@amg-webui/types'
import type { BrowserInfo } from '@amg-webui/utils'

export interface BrowserDetectProps extends BaseProps {
  userAgent?: string
  loading?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface BrowserDetectEmits {
  (e: 'detected', info: BrowserInfo): void
  (e: 'refresh'): void
}
