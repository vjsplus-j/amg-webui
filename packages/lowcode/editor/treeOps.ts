import { cloneDeep } from '@amg-webui/utils'
import type { CanvasNodeData } from '@amg-webui/utils'
import { wouldCreateCycle } from '../tree'

export function newNodeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function getChildrenOf(
  nodes: CanvasNodeData[],
  parentId: string | null
): CanvasNodeData[] {
  if (parentId == null) {
    const ids = new Set(nodes.map((n) => n.id))
    return nodes.filter((n) => !n.parentId || !ids.has(n.parentId))
  }
  return nodes.filter((n) => n.parentId === parentId)
}

export function getDescendantIds(nodes: CanvasNodeData[], rootId: string): string[] {
  const result: string[] = []
  const walk = (pid: string) => {
    for (const n of nodes) {
      if (n.parentId === pid) {
        result.push(n.id)
        walk(n.id)
      }
    }
  }
  walk(rootId)
  return result
}

export function getAncestorNodes(nodes: CanvasNodeData[], id: string): CanvasNodeData[] {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const out: CanvasNodeData[] = []
  let cur = byId.get(id)?.parentId ?? null
  const seen = new Set<string>()
  while (cur) {
    if (seen.has(cur)) break
    seen.add(cur)
    const node = byId.get(cur)
    if (!node) break
    out.push(node)
    cur = node.parentId ?? null
  }
  return out
}

export function getSiblingNodes(nodes: CanvasNodeData[], id: string): CanvasNodeData[] {
  const node = nodes.find((n) => n.id === id)
  if (!node) return []
  return getChildrenOf(nodes, node.parentId ?? null).filter((n) => n.id !== id)
}

/** Collect a node and its full subtree (depth-first). */
export function collectSubtree(nodes: CanvasNodeData[], rootId: string): CanvasNodeData[] {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  if (!byId.has(rootId)) return []
  const out: CanvasNodeData[] = []
  const walk = (id: string) => {
    const n = byId.get(id)
    if (!n) return
    out.push(n)
    for (const c of nodes.filter((x) => x.parentId === id)) walk(c.id)
  }
  walk(rootId)
  return out
}

/**
 * Clone a subtree with full ID remap and remapped parentIds.
 * Roots of the clone keep the same parentId as originals (caller may override).
 */
export function cloneSubtree(
  nodes: CanvasNodeData[],
  rootIds: string[],
  options?: { offsetX?: number; offsetY?: number; clearParent?: boolean }
): CanvasNodeData[] {
  const offsetX = options?.offsetX ?? 0
  const offsetY = options?.offsetY ?? 0
  const idMap = new Map<string, string>()
  const collected: CanvasNodeData[] = []
  const seen = new Set<string>()

  for (const rootId of rootIds) {
    for (const n of collectSubtree(nodes, rootId)) {
      if (seen.has(n.id)) continue
      seen.add(n.id)
      collected.push(n)
      idMap.set(n.id, newNodeId())
    }
  }

  const rootSet = new Set(rootIds)
  return collected.map((n) => {
    const next = cloneDeep(n)
    next.id = idMap.get(n.id)!
    if (n.parentId && idMap.has(n.parentId)) {
      next.parentId = idMap.get(n.parentId)!
    } else if (rootSet.has(n.id) && options?.clearParent) {
      next.parentId = null
    }
    if (rootSet.has(n.id)) {
      next.x = n.x + offsetX
      next.y = n.y + offsetY
    }
    return next
  })
}

export function deleteSubtree(nodes: CanvasNodeData[], ids: string[]): CanvasNodeData[] {
  const remove = new Set<string>()
  for (const id of ids) {
    remove.add(id)
    for (const d of getDescendantIds(nodes, id)) remove.add(d)
  }
  return nodes.filter((n) => !remove.has(n.id))
}

export function reparentNode(
  nodes: CanvasNodeData[],
  id: string,
  parentId: string | null
): CanvasNodeData[] | null {
  if (wouldCreateCycle(nodes, id, parentId)) return null
  return nodes.map((n) => (n.id === id ? { ...n, parentId } : n))
}

/** Reorder among siblings: move `id` before `siblingId` (same parent). */
export function moveBefore(
  nodes: CanvasNodeData[],
  id: string,
  siblingId: string
): CanvasNodeData[] {
  return reorderSibling(nodes, id, siblingId, 'before')
}

export function moveAfter(
  nodes: CanvasNodeData[],
  id: string,
  siblingId: string
): CanvasNodeData[] {
  return reorderSibling(nodes, id, siblingId, 'after')
}

function reorderSibling(
  nodes: CanvasNodeData[],
  id: string,
  siblingId: string,
  where: 'before' | 'after'
): CanvasNodeData[] {
  const node = nodes.find((n) => n.id === id)
  const sibling = nodes.find((n) => n.id === siblingId)
  if (!node || !sibling) return nodes
  const parentId = sibling.parentId ?? null
  if ((node.parentId ?? null) !== parentId) {
    const reparented = reparentNode(nodes, id, parentId)
    if (!reparented) return nodes
    nodes = reparented
  }
  const others = nodes.filter((n) => n.id !== id)
  const sibIdx = others.findIndex((n) => n.id === siblingId)
  if (sibIdx < 0) return nodes
  const insertAt = where === 'before' ? sibIdx : sibIdx + 1
  const moved = nodes.find((n) => n.id === id)!
  const next = [...others]
  next.splice(insertAt, 0, { ...moved, parentId })
  return next
}

export function moveInto(
  nodes: CanvasNodeData[],
  id: string,
  parentId: string
): CanvasNodeData[] | null {
  return reparentNode(nodes, id, parentId)
}

export function patchNode(
  nodes: CanvasNodeData[],
  id: string,
  patch: Partial<CanvasNodeData>
): CanvasNodeData[] {
  return nodes.map((n) => {
    if (n.id !== id) return n
    return {
      ...n,
      ...patch,
      props: patch.props ? { ...patch.props } : n.props
    }
  })
}

export function canDrop(ctx: {
  parentType: string | null
  childType: string
  parentIsContainer?: boolean
  accepts?: readonly string[]
  parentRules?: readonly string[]
}): boolean {
  if (ctx.parentType == null) return true
  if (ctx.parentRules?.length && !ctx.parentRules.includes(ctx.parentType)) return false
  if (ctx.accepts?.length) return ctx.accepts.includes(ctx.childType)
  if (ctx.parentIsContainer === false) return false
  return ctx.parentIsContainer === true || ctx.parentIsContainer === undefined
}
