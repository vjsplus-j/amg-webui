import type { CanvasNodeData } from '@amg-webui/utils'

export interface CanvasTreeNode extends CanvasNodeData {
  children: CanvasTreeNode[]
}

/** Roots = nodes with null/missing/unknown parentId. */
export function getRootNodes(nodes: CanvasNodeData[]): CanvasNodeData[] {
  const ids = new Set(nodes.map((n) => n.id))
  return nodes.filter((n) => !n.parentId || !ids.has(n.parentId))
}

export function getChildNodes(nodes: CanvasNodeData[], parentId: string): CanvasNodeData[] {
  return nodes.filter((n) => n.parentId === parentId)
}

/** Build a forest from flat nodes (cycle-safe: orphan cycles become roots). */
export function buildCanvasTree(nodes: CanvasNodeData[]): CanvasTreeNode[] {
  const map = new Map<string, CanvasTreeNode>()
  for (const n of nodes) {
    map.set(n.id, { ...n, children: [] })
  }
  const roots: CanvasTreeNode[] = []
  const visiting = new Set<string>()

  function attach(id: string): boolean {
    if (visiting.has(id)) return false
    visiting.add(id)
    const node = map.get(id)
    if (!node) return false
    const parentId = node.parentId
    if (!parentId || !map.has(parentId) || parentId === id) {
      visiting.delete(id)
      return true
    }
    const parent = map.get(parentId)!
    if (!parent.children.some((c) => c.id === id)) parent.children.push(node)
    visiting.delete(id)
    return false
  }

  for (const n of nodes) {
    const isRoot = attach(n.id)
    if (isRoot) {
      const node = map.get(n.id)!
      if (!roots.some((r) => r.id === node.id)) roots.push(node)
    }
  }

  // Ensure every node not under a root is still listed (orphans)
  const inTree = new Set<string>()
  const walk = (list: CanvasTreeNode[]) => {
    for (const n of list) {
      inTree.add(n.id)
      walk(n.children)
    }
  }
  walk(roots)
  for (const n of map.values()) {
    if (!inTree.has(n.id)) roots.push(n)
  }

  return roots
}

/** Bounding box of root nodes only (nested x/y are parent-local, not canvas-absolute). */
export function rootContentBounds(
  nodes: CanvasNodeData[],
  fallback: { width: number; height: number } = { width: 1, height: 1 }
): { width: number; height: number } {
  const roots = getRootNodes(nodes.filter((n) => !n.hidden))
  if (!roots.length) return { ...fallback }
  let width = fallback.width
  let height = fallback.height
  for (const n of roots) {
    width = Math.max(width, n.x + n.w)
    height = Math.max(height, n.y + n.h)
  }
  return { width, height }
}

/** Detect whether assigning parentId would create a cycle. */
export function wouldCreateCycle(
  nodes: CanvasNodeData[],
  nodeId: string,
  parentId: string | null
): boolean {
  if (!parentId) return false
  if (parentId === nodeId) return true
  const byId = new Map(nodes.map((n) => [n.id, n]))
  let cur: string | null | undefined = parentId
  const seen = new Set<string>()
  while (cur) {
    if (cur === nodeId) return true
    if (seen.has(cur)) return true
    seen.add(cur)
    cur = byId.get(cur)?.parentId ?? null
  }
  return false
}
