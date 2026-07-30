import type { BaseProps } from '@amg-webui/types'
import type { OnvifDevice } from '../OnvifSearch/types'

export interface OnvifDeviceListProps extends BaseProps {
  devices?: OnvifDevice[]
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface OnvifDeviceListEmits {
  (e: 'select', device: OnvifDevice): void
}
