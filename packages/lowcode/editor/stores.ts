import { computed, ref, type Ref } from 'vue'
import { CANVAS_SCHEMA_VERSION, type CanvasNodeData, type CanvasSchema } from '@amg-webui/utils'
import {
  getAncestorNodes,
  getChildrenOf,
  getDescendantIds,
  getSiblingNodes
} from './treeOps'
import type { DocumentStore } from './types'

export function createDocumentStore(
  nodesRef: Ref<CanvasNodeData[]>,
  mode: Ref<'free' | 'grid'>,
  readonly: Ref<boolean>
): DocumentStore {
  const getNode = (id: string) => nodesRef.value.find((n) => n.id === id)

  return {
    nodes: nodesRef,
    mode,
    readonly,
    getNode,
    getChildren: (parentId) => getChildrenOf(nodesRef.value, parentId),
    getDescendants: (id) => {
      const ids = new Set(getDescendantIds(nodesRef.value, id))
      return nodesRef.value.filter((n) => ids.has(n.id))
    },
    getAncestors: (id) => getAncestorNodes(nodesRef.value, id),
    getSiblings: (id) => getSiblingNodes(nodesRef.value, id),
    replaceAll: (nodes) => {
      nodesRef.value = nodes.map((n) => ({ ...n, props: { ...n.props } }))
    },
    applyNodes: (nodes) => {
      nodesRef.value = nodes.map((n) => ({ ...n, props: { ...n.props } }))
    },
    toSchema: (): CanvasSchema => ({
      version: CANVAS_SCHEMA_VERSION,
      mode: mode.value,
      nodes: nodesRef.value.map((n) => ({ ...n, props: { ...n.props } }))
    })
  }
}

export function createSelectionStore(nodesRef: Ref<CanvasNodeData[]>) {
  const selectedIds = ref<string[]>([])
  const hoveredId = ref<string | null>(null)

  const selectedNodes = computed(() =>
    nodesRef.value.filter((n) => selectedIds.value.includes(n.id))
  )

  return {
    selectedIds,
    hoveredId,
    selectedNodes,
    select: (id: string, multi = false) => {
      if (multi) {
        const set = new Set(selectedIds.value)
        if (set.has(id)) set.delete(id)
        else set.add(id)
        selectedIds.value = [...set]
      } else {
        selectedIds.value = [id]
      }
    },
    selectMany: (ids: string[]) => {
      selectedIds.value = [...new Set(ids)]
    },
    selectAll: () => {
      selectedIds.value = nodesRef.value.filter((n) => !n.hidden).map((n) => n.id)
    },
    clear: () => {
      selectedIds.value = []
    },
    setHover: (id: string | null) => {
      hoveredId.value = id
    },
    isSelected: (id: string) => selectedIds.value.includes(id)
  }
}

export function createClipboardStore() {
  const buffer = ref<CanvasNodeData[]>([])
  return {
    hasContent: computed(() => buffer.value.length > 0),
    copy: (nodes: CanvasNodeData[]) => {
      buffer.value = nodes.map((n) => ({ ...n, props: { ...n.props } }))
    },
    paste: () => buffer.value.map((n) => ({ ...n, props: { ...n.props } })),
    clear: () => {
      buffer.value = []
    },
    /** Internal raw for subtree paste. */
    _raw: buffer
  }
}
