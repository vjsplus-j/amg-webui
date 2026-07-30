import type { BaseProps } from '@amg-webui/types'

export type ScaleLayoutFit = 'manual' | 'contain' | 'cover' | 'width' | 'height'
export type ScaleLayoutOrigin = 'top-left' | 'center'

export interface ScaleLayoutProps extends BaseProps {
  /** Manual scale when fit is `manual` (also clamps auto scale display) */
  scale?: number
  /** Design canvas width in px (required for auto fit) */
  width?: number
  /** Design canvas height in px (required for auto fit) */
  height?: number
  /**
   * How design size maps into the host:
   * - manual: use `scale`
   * - contain: fit inside (no crop; may letterbox)
   * - cover: fill host (may crop)
   * - width / height: lock one axis
   */
  fit?: ScaleLayoutFit
  origin?: ScaleLayoutOrigin
  /** Root fills parent width/height (default true) */
  fill?: boolean
}

export type ScaleLayoutEmits = Record<string, never>
