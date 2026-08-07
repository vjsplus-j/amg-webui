import type { BaseProps } from '@amg-webui/types'

export type PtzCommand =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'upLeft'
  | 'upRight'
  | 'downLeft'
  | 'downRight'
  | 'zoomIn'
  | 'zoomOut'
  | 'focusNear'
  | 'focusFar'
  | 'irisOpen'
  | 'irisClose'
  | 'preset'
  | 'stop'

export interface PtzCommandPayload {
  command: PtzCommand
  speed: number
  preset?: number
  source: 'button' | 'keyboard' | 'preset'
}

export interface PTZControlProps extends BaseProps {
  modelValue?: PtzCommand | null
  disabled?: boolean
  speed?: number
  minSpeed?: number
  maxSpeed?: number
  step?: number
  keyboard?: boolean
  showAdvanced?: boolean
  presets?: number[]
}

export interface PTZControlEmits {
  (e: 'update:modelValue', cmd: PtzCommand | null): void
  (e: 'update:speed', value: number): void
  (e: 'command', cmd: PtzCommand, payload: PtzCommandPayload): void
  (e: 'change', payload: PtzCommandPayload): void
}
