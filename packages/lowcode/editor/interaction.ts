import type { CanvasNodeData } from '@amg-webui/utils'
import type { GuideLine, Rect, ResizeHandle } from './types'

export interface SnapResult {
  x: number
  y: number
  guides: GuideLine[]
}

export interface SnapOptions {
  gridSize?: number
  threshold?: number
  enableGrid?: boolean
  enableEdges?: boolean
  enableCenters?: boolean
}

const DEFAULT_THRESHOLD = 6

export function snapPosition(
  rect: Rect,
  others: CanvasNodeData[],
  parent?: Rect | null,
  options: SnapOptions = {}
): SnapResult {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD
  const gridSize = options.gridSize ?? 8
  let x = rect.x
  let y = rect.y
  const guides: GuideLine[] = []

  if (options.enableGrid !== false) {
    const gx = Math.round(x / gridSize) * gridSize
    const gy = Math.round(y / gridSize) * gridSize
    if (Math.abs(gx - x) <= threshold) x = gx
    if (Math.abs(gy - y) <= threshold) y = gy
  }

  const targets: { v: number[]; h: number[] } = { v: [], h: [] }

  if (parent && options.enableEdges !== false) {
    targets.v.push(parent.x, parent.x + parent.w / 2, parent.x + parent.w)
    targets.h.push(parent.y, parent.y + parent.h / 2, parent.y + parent.h)
  }

  for (const o of others) {
    if (options.enableEdges !== false) {
      targets.v.push(o.x, o.x + o.w)
      targets.h.push(o.y, o.y + o.h)
    }
    if (options.enableCenters !== false) {
      targets.v.push(o.x + o.w / 2)
      targets.h.push(o.y + o.h / 2)
    }
  }

  const left = x
  const cx = x + rect.w / 2
  const right = x + rect.w
  const top = y
  const cy = y + rect.h / 2
  const bottom = y + rect.h

  let bestVX: { delta: number; guide: number } | null = null
  for (const t of targets.v) {
    for (const edge of [left, cx, right]) {
      const d = t - edge
      if (Math.abs(d) <= threshold && (!bestVX || Math.abs(d) < Math.abs(bestVX.delta))) {
        bestVX = { delta: d, guide: t }
      }
    }
  }
  if (bestVX) {
    x += bestVX.delta
    guides.push({ orientation: 'v', position: bestVX.guide })
  }

  let bestHY: { delta: number; guide: number } | null = null
  for (const t of targets.h) {
    for (const edge of [top, cy, bottom]) {
      const d = t - edge
      if (Math.abs(d) <= threshold && (!bestHY || Math.abs(d) < Math.abs(bestHY.delta))) {
        bestHY = { delta: d, guide: t }
      }
    }
  }
  if (bestHY) {
    y += bestHY.delta
    guides.push({ orientation: 'h', position: bestHY.guide })
  }

  // Distance indicators between nearest sibling edges
  for (const o of others) {
    const gapY = Math.abs(y - (o.y + o.h))
    if (gapY > 0 && gapY < 80 && Math.abs(x + rect.w / 2 - (o.x + o.w / 2)) < Math.max(rect.w, o.w)) {
      guides.push({
        orientation: 'v',
        position: x + rect.w / 2,
        distance: Math.round(y - (o.y + o.h))
      })
      break
    }
  }

  return { x, y, guides }
}

export function applyResizeHandle(
  start: Rect,
  handle: ResizeHandle,
  dx: number,
  dy: number,
  opts?: {
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    lockAspect?: boolean
    center?: boolean
  }
): Rect {
  const minW = opts?.minWidth ?? 24
  const minH = opts?.minHeight ?? 24
  const maxW = opts?.maxWidth ?? 10000
  const maxH = opts?.maxHeight ?? 10000
  let { x, y, w, h } = start

  const aspect = start.w / Math.max(start.h, 1)

  const applyW = (nw: number, fromLeft: boolean) => {
    nw = Math.min(maxW, Math.max(minW, nw))
    if (fromLeft) x = start.x + start.w - nw
    w = nw
  }
  const applyH = (nh: number, fromTop: boolean) => {
    nh = Math.min(maxH, Math.max(minH, nh))
    if (fromTop) y = start.y + start.h - nh
    h = nh
  }

  if (handle.includes('e')) applyW(start.w + dx, false)
  if (handle.includes('w')) applyW(start.w - dx, true)
  if (handle.includes('s')) applyH(start.h + dy, false)
  if (handle.includes('n')) applyH(start.h - dy, true)

  if (opts?.lockAspect) {
    if (handle === 'e' || handle === 'w') {
      h = Math.min(maxH, Math.max(minH, w / aspect))
      if (opts.center) y = start.y + (start.h - h) / 2
    } else if (handle === 'n' || handle === 's') {
      w = Math.min(maxW, Math.max(minW, h * aspect))
      if (opts.center) x = start.x + (start.w - w) / 2
    } else {
      h = Math.min(maxH, Math.max(minH, w / aspect))
      if (handle.includes('n')) y = start.y + start.h - h
    }
  }

  if (opts?.center && !opts.lockAspect) {
    if (handle.includes('e') || handle.includes('w')) {
      const nw = w
      x = start.x + (start.w - nw) / 2
      w = nw
    }
    if (handle.includes('n') || handle.includes('s')) {
      const nh = h
      y = start.y + (start.h - nh) / 2
      h = nh
    }
  }

  return { x, y, w, h }
}

export function hitTestNodes(
  nodes: CanvasNodeData[],
  canvasX: number,
  canvasY: number
): CanvasNodeData | null {
  const visible = nodes.filter((n) => !n.hidden)
  // Top-most by zIndex then array order
  const sorted = [...visible].sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
  for (let i = sorted.length - 1; i >= 0; i--) {
    const n = sorted[i]!
    if (
      canvasX >= n.x &&
      canvasX <= n.x + n.w &&
      canvasY >= n.y &&
      canvasY <= n.y + n.h
    ) {
      return n
    }
  }
  return null
}

export function nodesInMarquee(nodes: CanvasNodeData[], box: Rect): string[] {
  const x2 = box.x + box.w
  const y2 = box.y + box.h
  return nodes
    .filter((n) => !n.hidden && !n.locked)
    .filter((n) => {
      const nx2 = n.x + n.w
      const ny2 = n.y + n.h
      return n.x < x2 && nx2 > box.x && n.y < y2 && ny2 > box.y
    })
    .map((n) => n.id)
}
