import type { BaseProps } from '@amg-webui/types'
export interface OnvifChannel { id: string; name: string }
export interface OnvifChannelManageProps extends BaseProps { channels?: OnvifChannel[]; disabled?: boolean }
export interface OnvifChannelManageEmits { (e: 'add', name: string): void; (e: 'remove', id: string): void }
