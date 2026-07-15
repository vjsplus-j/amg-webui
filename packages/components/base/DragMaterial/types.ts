import type { BaseProps } from '@amg-webui/types'
import type { CanvasMaterialItem } from '@amg-webui/utils'

export interface DragMaterialProps extends BaseProps {
  materials?: CanvasMaterialItem[]
  filter?: string
}

export interface DragMaterialEmits {
  (e: 'drag-start', material: CanvasMaterialItem): void
}
