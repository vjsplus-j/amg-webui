import type { BaseProps } from '@amg-webui/types'
import type { OnvifDevice } from '../OnvifSearch/types'
export interface OnvifDeviceListProps extends BaseProps { devices?: OnvifDevice[]; disabled?: boolean }
export interface OnvifDeviceListEmits { (e: 'select', device: OnvifDevice): void }
