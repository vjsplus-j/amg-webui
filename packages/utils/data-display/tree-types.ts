export interface TreeNode {
  label: string
  value?: string | number
  children?: TreeNode[]
  disabled?: boolean
  isLeaf?: boolean
  isFolder?: boolean
  icon?: string
  [key: string]: unknown
}

export interface FlatTreeRow {
  id: string
  node: TreeNode
  depth: number
  hasChildren: boolean
  expanded: boolean
  parentId: string | null
}

export type TreeCheckState = 'checked' | 'unchecked' | 'indeterminate'

export interface LazyLoadContext {
  node: TreeNode
  resolve: (children: TreeNode[]) => void
}

export type TreeLoadFn = (node: TreeNode) => Promise<TreeNode[]> | TreeNode[]

export function nodeKey(node: TreeNode, parentId = 'root'): string {
  return `${parentId}/${String(node.value ?? node.label)}`
}

export function nodeValue(node: TreeNode): string | number {
  return node.value ?? node.label
}

export function normalizeTreeNodes(data: unknown, options?: TreeNode[]): TreeNode[] {
  if (options?.length) return options
  if (Array.isArray(data)) return data as TreeNode[]
  return []
}

export function patchTreeNodeChildren(
  nodes: TreeNode[],
  targetValue: string | number,
  children: TreeNode[]
): TreeNode[] {
  return nodes.map((n) => {
    if (nodeValue(n) === targetValue) {
      return { ...n, children }
    }
    if (n.children?.length) {
      return { ...n, children: patchTreeNodeChildren(n.children, targetValue, children) }
    }
    return n
  })
}

export function findTreeNode(
  nodes: TreeNode[],
  targetValue: string | number
): TreeNode | null {
  for (const n of nodes) {
    if (nodeValue(n) === targetValue) return n
    if (n.children?.length) {
      const found = findTreeNode(n.children, targetValue)
      if (found) return found
    }
  }
  return null
}
