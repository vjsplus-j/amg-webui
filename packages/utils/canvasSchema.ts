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
  const base: CanvasNodeData = {
    id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    label,
    x: 0,
    y: 0,
    w: 200,
    h: 80,
    col: 0,
    row: 0,
    colSpan: 8,
    rowSpan: 1,
    props: {},
    zIndex: 1,
    locked: false,
    hidden: false,
    parentId: null
  }
  if (!partial) return base
  const next: CanvasNodeData = { ...base }
  for (const [key, value] of Object.entries(partial) as [keyof CanvasNodeData, CanvasNodeData[keyof CanvasNodeData]][]) {
    if (value !== undefined) {
      ;(next as unknown as Record<string, unknown>)[key] = value
    }
  }
  if (partial.props) next.props = { ...partial.props }
  return next
}

export function normalizeCanvasSchema(input: unknown): CanvasSchema {
  if (!input || typeof input !== 'object') {
    return { version: CANVAS_SCHEMA_VERSION, mode: 'free', nodes: [] }
  }
  const raw = input as Partial<CanvasSchema> & { nodes?: unknown }
  const nodes = Array.isArray(raw.nodes)
    ? raw.nodes
        .filter(
          (n): n is CanvasNodeData =>
            Boolean(n && typeof n === 'object' && 'id' in n && 'type' in n)
        )
        .map((n) => ({
          id: String(n.id),
          type: String(n.type),
          label: typeof n.label === 'string' ? n.label : String(n.type),
          x: Number.isFinite(n.x) ? Number(n.x) : 0,
          y: Number.isFinite(n.y) ? Number(n.y) : 0,
          w: Number.isFinite(n.w) ? Number(n.w) : 200,
          h: Number.isFinite(n.h) ? Number(n.h) : 80,
          col: Number.isFinite(n.col as number) ? Number(n.col) : 0,
          row: Number.isFinite(n.row as number) ? Number(n.row) : 0,
          colSpan: Number.isFinite(n.colSpan as number) ? Number(n.colSpan) : 8,
          rowSpan: Number.isFinite(n.rowSpan as number) ? Number(n.rowSpan) : 1,
          props:
            n.props && typeof n.props === 'object' && !Array.isArray(n.props)
              ? { ...n.props }
              : {},
          locked: Boolean(n.locked),
          hidden: Boolean(n.hidden),
          zIndex: Number.isFinite(n.zIndex as number) ? Number(n.zIndex) : 1,
          parentId: n.parentId ?? null
        }))
    : []
  return {
    version: typeof raw.version === 'number' ? raw.version : CANVAS_SCHEMA_VERSION,
    mode: raw.mode === 'grid' ? 'grid' : 'free',
    nodes
  }
}

/** Serialize schema for CanvasIo export. */
export function serializeCanvasSchema(schema: CanvasSchema): string {
  return JSON.stringify(
    {
      version: schema.version ?? CANVAS_SCHEMA_VERSION,
      mode: schema.mode === 'grid' ? 'grid' : 'free',
      nodes: schema.nodes
    },
    null,
    2
  )
}
