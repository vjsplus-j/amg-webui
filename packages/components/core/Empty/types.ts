import type { BaseProps, Size } from '@amg-webui/types'

export type EmptyImageSize = Size | number | string

export interface EmptyProps extends BaseProps {
  /** Description under the illustration (defaults to `common.noData`) */
  description?: string
  /** Optional title above the description */
  title?: string
  /** Custom illustration URL; falls back to built-in SVG on `@error` */
  image?: string
  /** Accessible label for the custom image */
  imageAlt?: string
  /** Illustration size — Size token, CSS length, or number mapped to spacing scale */
  imageSize?: EmptyImageSize
  /** Inline styles applied to the image / placeholder host */
  imageStyle?: Record<string, string>
}

export interface EmptyEmits {
  /** Fired when a custom `image` fails to load (before SVG fallback) */
  (e: 'imageError', event: Event): void
}
