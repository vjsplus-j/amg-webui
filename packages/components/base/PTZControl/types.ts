import type { BaseProps } from '@amg-webui/types'
export type PtzCommand = 'up' | 'down' | 'left' | 'right' | 'zoomIn' | 'zoomOut' | 'stop'
export interface PTZControlProps extends BaseProps { disabled?: boolean }
export interface PTZControlEmits { (e: 'command', cmd: PtzCommand): void }
