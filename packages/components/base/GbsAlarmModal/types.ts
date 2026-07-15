import type { BaseProps } from '@amg-webui/types'
export interface GbsAlarmModalProps extends BaseProps { open?: boolean; title?: string; description?: string; disabled?: boolean }
export interface GbsAlarmModalEmits { (e: 'update:open', v: boolean): void; (e: 'acknowledge'): void; (e: 'close'): void }
