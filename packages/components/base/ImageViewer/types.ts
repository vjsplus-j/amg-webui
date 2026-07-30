export interface ImageViewerProps {
  visible?: boolean
  urlList: string[]
  initialIndex?: number
  infinite?: boolean
  zoomRate?: number
  minScale?: number
  maxScale?: number
  teleported?: boolean
  class?: string
  style?: Record<string, string>
}

export interface ImageViewerEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'close', event?: Event): void
  (e: 'switch', index: number): void
}
