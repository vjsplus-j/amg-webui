import type { BaseProps } from '@amg-webui/types'

export type ImageFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'

export interface ImageProps extends BaseProps {
  src: string
  alt?: string
  fit?: ImageFit
  lazy?: boolean
  preview?: boolean
  previewSrc?: string
  previewSrcList?: string[]
  initialIndex?: number
  width?: string
  height?: string
  fallback?: string
  placeholder?: string
  disabled?: boolean
}

export interface ImageEmits {
  (e: 'load', event: Event): void
  (e: 'error', event: Event): void
  (e: 'click', event: MouseEvent): void
  (e: 'switch', index: number): void
}
