import {
  CANVAS_SCHEMA_VERSION,
  type CanvasNodeData,
  type CanvasSchema
} from '@amg-webui/utils'
import type { DataSourceDef, LowcodeAction } from '../runtime'

export const LOWCODE_DOCUMENT_VERSION = 1

export interface LowcodeDocument {
  id: string
  name: string
  version: number
  schemaVersion: number
  page: {
    mode: 'free' | 'grid'
    breakpoint?: 'pc' | 'tablet' | 'mobile'
  }
  nodes: CanvasNodeData[]
  variables: Record<string, unknown>
  dataSources: DataSourceDef[]
  actions: Record<string, LowcodeAction[]>
  theme?: string
  permissions?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export function createEmptyDocument(name = 'Untitled'): LowcodeDocument {
  const now = new Date().toISOString()
  return {
    id: `doc-${Date.now().toString(36)}`,
    name,
    version: LOWCODE_DOCUMENT_VERSION,
    schemaVersion: CANVAS_SCHEMA_VERSION,
    page: { mode: 'free', breakpoint: 'pc' },
    nodes: [],
    variables: {},
    dataSources: [],
    actions: {},
    theme: undefined,
    permissions: {},
    createdAt: now,
    updatedAt: now
  }
}

export function documentToSchema(doc: LowcodeDocument): CanvasSchema {
  return {
    version: doc.schemaVersion || CANVAS_SCHEMA_VERSION,
    mode: doc.page.mode,
    nodes: doc.nodes
  }
}
