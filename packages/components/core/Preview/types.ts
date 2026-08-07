import type { BaseProps } from '@amg-webui/types'

export interface PreviewProps extends BaseProps {
  modelValue?: number
  zoom?: number
  minZoom?: number
  maxZoom?: number
  step?: number
  fullscreen?: boolean
  disabled?: boolean
  keyboard?: boolean
  rotatable?: boolean
  showToolbar?: boolean
}

export interface PreviewEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'update:zoom', value: number): void
  (e: 'update:fullscreen', value: boolean): void
  (e: 'zoom-change', value: number): void
  (e: 'fullscreen-change', value: boolean): void
  (e: 'rotate', value: number): void
  (e: 'reset'): void
  (e: 'change', payload: { zoom: number; fullscreen: boolean; rotation: number }): void
}
