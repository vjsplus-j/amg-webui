import type { BaseProps } from '@amg-webui/types'

export interface WatermarkProps extends BaseProps {
  content?: string | string[]
  gap?: [number, number]
  rotate?: number
  fontSize?: number
  opacity?: number
  zIndex?: number
  image?: string
}
