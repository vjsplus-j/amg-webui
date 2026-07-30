import type { BaseProps } from '@amg-webui/types'
import type { CanvasMaterialItem } from '@amg-webui/utils'

export interface DragMaterialProps extends BaseProps {
  materials?: CanvasMaterialItem[]
  filter?: string
  searchable?: boolean
}

export interface DragMaterialEmits {
  (e: 'drag-start', material: CanvasMaterialItem): void
  (e: 'search', query: string): void
  (e: 'pick', material: CanvasMaterialItem): void
}
