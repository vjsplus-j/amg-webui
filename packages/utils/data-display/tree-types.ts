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

export function nodeKey(node: TreeNode, parentId = 'root'): string {
  return `${parentId}/${String(node.value ?? node.label)}`
}

export function normalizeTreeNodes(data: unknown, options?: TreeNode[]): TreeNode[] {
  if (options?.length) return options
  if (Array.isArray(data)) return data as TreeNode[]
  return []
}
