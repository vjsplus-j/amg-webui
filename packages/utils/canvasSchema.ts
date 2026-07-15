export interface CanvasNodeData {
  id: string
  type: string
  label: string
  x: number
  y: number
  w: number
  h: number
  col?: number
  row?: number
  colSpan?: number
  rowSpan?: number
  props: Record<string, unknown>
  locked?: boolean
  hidden?: boolean
  zIndex?: number
  parentId?: string | null
}

export interface CanvasMaterialItem {
  type: string
  label: string
  group?: string
  defaultProps?: Record<string, unknown>
  defaultSize?: { w: number; h: number }
}

export interface CanvasSchema {
  version: number
  mode: 'free' | 'grid'
  nodes: CanvasNodeData[]
}

export const CANVAS_SCHEMA_VERSION = 1

export function createCanvasNode(
  type: string,
  label: string,
  partial?: Partial<CanvasNodeData>
): CanvasNodeData {
  return {
    id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    label,
    x: partial?.x ?? 0,
    y: partial?.y ?? 0,
    w: partial?.w ?? 200,
    h: partial?.h ?? 80,
    col: partial?.col ?? 0,
    row: partial?.row ?? 0,
    colSpan: partial?.colSpan ?? 8,
    rowSpan: partial?.rowSpan ?? 1,
    props: partial?.props ?? {},
    zIndex: partial?.zIndex ?? 1,
    locked: partial?.locked ?? false,
    hidden: partial?.hidden ?? false,
    parentId: partial?.parentId ?? null,
    ...partial
  }
}

export function normalizeCanvasSchema(input: unknown): CanvasSchema {
  if (!input || typeof input !== 'object') {
    return { version: CANVAS_SCHEMA_VERSION, mode: 'free', nodes: [] }
  }
  const raw = input as Partial<CanvasSchema>
  const nodes = Array.isArray(raw.nodes)
    ? raw.nodes.filter((n) => n && typeof n === 'object' && 'id' in n) as CanvasNodeData[]
    : []
  return {
    version: typeof raw.version === 'number' ? raw.version : CANVAS_SCHEMA_VERSION,
    mode: raw.mode === 'grid' ? 'grid' : 'free',
    nodes
  }
}
