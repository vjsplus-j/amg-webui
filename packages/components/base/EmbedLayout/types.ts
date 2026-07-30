import type { BaseProps } from '@amg-webui/types'

/** Named aspect presets or any CSS `aspect-ratio` string */
export type EmbedAspect =
  | '16/9'
  | '4/3'
  | '1/1'
  | '21/9'
  | '3/2'
  | '9/16'
  | (string & {})

export type EmbedObjectFit = 'cover' | 'contain' | 'fill' | 'none'

export interface EmbedLayoutProps extends BaseProps {
  /** CSS aspect-ratio (default `16 / 9`). Ignored when `fill` is true. */
  aspectRatio?: EmbedAspect
  /** Fill parent height instead of locking aspect ratio */
  fill?: boolean
  rounded?: boolean
  bordered?: boolean
  /** How slotted media fits the frame */
  objectFit?: EmbedObjectFit
  /** Accessible label for embedded media */
  label?: string
}

export interface EmbedLayoutEmits {
  (e: 'frame-click', event: MouseEvent): void
}
