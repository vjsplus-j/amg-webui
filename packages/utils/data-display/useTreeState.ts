import { computed, ref, watch, type Ref } from 'vue'
import { type FlatTreeRow, type TreeNode, nodeKey } from './tree-types'

export function flattenVisibleTree(
  nodes: TreeNode[],
  expanded: Set<string>,
  parentId = 'root',
  depth = 0
): FlatTreeRow[] {
  const rows: FlatTreeRow[] = []
  for (const node of nodes) {
    const id = nodeKey(node, parentId)
    const hasChildren = Boolean(node.children?.length) && !node.isLeaf
    const expandedState = expanded.has(id)
    rows.push({ id, node, depth, hasChildren, expanded: expandedState, parentId })
    if (hasChildren && expandedState) {
      rows.push(...flattenVisibleTree(node.children!, expanded, id, depth + 1))
    }
  }
  return rows
}

export function collectDescendantValues(node: TreeNode): (string | number)[] {
  const vals: (string | number)[] = []
  const walk = (n: TreeNode) => {
    vals.push(n.value ?? n.label)
    n.children?.forEach(walk)
  }
  walk(node)
  return vals
}

export function filterTreeNodes(nodes: TreeNode[], query: string): TreeNode[] {
  const q = query.trim().toLowerCase()
  if (!q) return nodes
  const walk = (list: TreeNode[]): TreeNode[] =>
    list
      .map((n) => {
        const kids = n.children ? walk(n.children) : []
        const selfMatch = n.label.toLowerCase().includes(q)
        if (selfMatch || kids.length) return { ...n, children: kids.length ? kids : n.children }
        return null
      })
      .filter(Boolean) as TreeNode[]
  return walk(nodes)
}

type TreeEmit = (event: 'update:modelValue' | 'change', value: unknown) => void

export function useTreeState(
  roots: Ref<TreeNode[]>,
  modelValue: Ref<unknown>,
  emit: TreeEmit,
  opts?: { checkable?: boolean; defaultExpandAll?: boolean }
) {
  const expandedSet = ref<Set<string>>(new Set())
  const searchQuery = ref('')
  const activeId = ref<string | null>(null)

  if (opts?.defaultExpandAll) {
    const all = new Set<string>()
    const walk = (nodes: TreeNode[], parentId = 'root') => {
      for (const n of nodes) {
        const id = nodeKey(n, parentId)
        if (n.children?.length) {
          all.add(id)
          walk(n.children, id)
        }
      }
    }
    watch(roots, (r) => { walk(r); expandedSet.value = all }, { immediate: true })
  }

  const checkedSet = ref<Set<string | number>>(
    new Set(Array.isArray(modelValue.value) ? (modelValue.value as (string | number)[]) : [])
  )

  watch(
    () => modelValue.value,
    (v) => {
      checkedSet.value = new Set(Array.isArray(v) ? (v as (string | number)[]) : [])
    }
  )

  const filteredRoots = computed(() => filterTreeNodes(roots.value, searchQuery.value))

  const flatRows = computed(() => flattenVisibleTree(filteredRoots.value, expandedSet.value))

  function toggleExpand(id: string) {
    const next = new Set(expandedSet.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expandedSet.value = next
  }

  function setChecked(val: string | number, on: boolean) {
    const next = new Set(checkedSet.value)
    if (on) next.add(val)
    else next.delete(val)
    checkedSet.value = next
    const arr = [...next]
    emit('update:modelValue', arr)
    emit('change', arr)
  }

  function toggleCheck(node: TreeNode) {
    const val = node.value ?? node.label
    setChecked(val, !checkedSet.value.has(val))
  }

  function selectNode(id: string, node: TreeNode) {
    activeId.value = id
    const val = node.value ?? node.label
    emit('update:modelValue', val)
    emit('change', val)
  }

  function expandAll() {
    const all = new Set<string>()
    const walk = (nodes: TreeNode[], parentId = 'root') => {
      for (const n of nodes) {
        const id = nodeKey(n, parentId)
        if (n.children?.length) {
          all.add(id)
          walk(n.children, id)
        }
      }
    }
    walk(roots.value)
    expandedSet.value = all
  }

  function collapseAll() {
    expandedSet.value = new Set()
  }

  return {
    expandedSet,
    searchQuery,
    activeId,
    filteredRoots,
    flatRows,
    checkedSet,
    toggleExpand,
    setChecked,
    toggleCheck,
    selectNode,
    expandAll,
    collapseAll
  }
}
