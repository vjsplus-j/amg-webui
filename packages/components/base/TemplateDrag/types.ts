import type { BaseProps } from '@amg-webui/types'
import type { CanvasSchema } from '@amg-webui/utils'

export interface CanvasTemplate {
  id: string
  name: string
  schema: CanvasSchema
}

export interface TemplateDragProps extends BaseProps {
  templates?: CanvasTemplate[]
}

export interface TemplateDragEmits {
  (e: 'apply', template: CanvasTemplate): void
}
