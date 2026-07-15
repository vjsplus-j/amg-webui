import type { BaseProps } from '@amg-webui/types'

export interface BrowserDetectProps extends BaseProps {
  userAgent?: string
}

export interface BrowserDetectEmits {
  (e: 'detected', info: { browser: string; version: string; os: string; device: string; mobile: boolean }): void
}
