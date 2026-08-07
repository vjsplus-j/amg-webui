import { ref } from 'vue'
import type { CanvasNodeData, CanvasSchema } from '@amg-webui/utils'
import {
  createAddNodeCommand,
  createDeleteNodesCommand,
  createDuplicateCommand,
  createMoveNodeCommand,
  createReplaceAllCommand,
  createReparentCommand,
  createResizeNodeCommand,
  createUpdatePropsCommand
} from './commands'
import { createHistoryStore, createViewportStore } from './history'
import { createClipboardStore, createDocumentStore, createSelectionStore } from './stores'
import {
  cloneSubtree,
  moveAfter as treeMoveAfter,
  moveBefore as treeMoveBefore,
  moveInto as treeMoveInto,
  patchNode
} from './treeOps'
import type {
  AlignAxis,
  Command,
  CommandManager,
  LowcodeEditor,
  LowcodeEditorOptions,
  Rect
} from './types'

export function createLowcodeEditor(options: LowcodeEditorOptions = {}): LowcodeEditor {
  const initialNodes =
    options.nodes ??
    options.schema?.nodes ??
    ([] as CanvasNodeData[])

  const nodes = ref<CanvasNodeData[]>(
    initialNodes.map((n) => ({ ...n, props: { ...n.props } }))
  )
  const mode = ref<'free' | 'grid'>(options.mode ?? options.schema?.mode ?? 'free')
  const readonly = ref(options.readonly ?? false)

  const document = createDocumentStore(nodes, mode, readonly)
  const selection = createSelectionStore(nodes)
  const clipboard = createClipboardStore()
  const viewport = createViewportStore()

  const history = createHistoryStore(
    (next) => document.applyNodes(next),
    () => nodes.value,
    options.historyLimit ?? 100,
    options.onChange
  )

  const getNodes = () => nodes.value
  const setNodes = (next: CanvasNodeData[]) => document.applyNodes(next)

  const commands: CommandManager = {
    execute: (command: Command) => history.push(command),
    undo: () => history.undo(),
    redo: () => history.redo(),
    beginTransaction: (label) => history.beginTransaction(label),
    previewPatch: (n) => history.previewPatch(n),
    commit: (command) => history.commit(command),
    cancelTransaction: () => history.cancelTransaction()
  }

  const addNode = (node: CanvasNodeData) => {
    if (readonly.value) return
    commands.execute(createAddNodeCommand(getNodes, setNodes, node))
    selection.select(node.id)
  }

  const deleteSelection = () => {
    if (readonly.value || !selection.selectedIds.value.length) return
    const ids = [...selection.selectedIds.value]
    commands.execute(createDeleteNodesCommand(getNodes, setNodes, ids))
    selection.clear()
  }

  const updateNode = (id: string, patch: Partial<CanvasNodeData>) => {
    if (readonly.value) return
    commands.execute(createUpdatePropsCommand(getNodes, setNodes, id, patch))
  }

  const moveNode = (id: string, x: number, y: number) => {
    if (readonly.value) return
    commands.execute(createMoveNodeCommand(getNodes, setNodes, id, x, y))
  }

  const resizeNode = (id: string, rect: Rect) => {
    if (readonly.value) return
    commands.execute(createResizeNodeCommand(getNodes, setNodes, id, rect))
  }

  const reparent = (id: string, parentId: string | null) => {
    if (readonly.value) return
    const cmd = createReparentCommand(getNodes, setNodes, id, parentId)
    if (cmd) commands.execute(cmd)
  }

  const duplicateSelection = () => {
    if (readonly.value || !selection.selectedIds.value.length) return
    const ids = [...selection.selectedIds.value]
    const before = getNodes()
    commands.execute(createDuplicateCommand(getNodes, setNodes, ids))
    const after = getNodes()
    const newIds = after.filter((n) => !before.some((b) => b.id === n.id)).map((n) => n.id)
    selection.selectMany(newIds)
  }

  const copySelection = () => {
    const ids = selection.selectedIds.value
    if (!ids.length) return
    const collected: CanvasNodeData[] = []
    const seen = new Set<string>()
    for (const id of ids) {
      for (const n of cloneSubtree(nodes.value, [id], { offsetX: 0, offsetY: 0 })) {
        // cloneSubtree remaps ids — for clipboard we want original structure with later remap on paste
        void n
      }
      // Store originals for paste remap
    }
    // Prefer storing original subtree for paste
    for (const id of ids) {
      const stack = [id]
      while (stack.length) {
        const cur = stack.pop()!
        if (seen.has(cur)) continue
        seen.add(cur)
        const node = nodes.value.find((n) => n.id === cur)
        if (!node) continue
        collected.push({ ...node, props: { ...node.props } })
        for (const c of nodes.value.filter((n) => n.parentId === cur)) stack.push(c.id)
      }
    }
    clipboard.copy(collected)
  }

  const pasteClipboard = () => {
    if (readonly.value || !clipboard.hasContent.value) return
    const raw = clipboard.paste()
    if (!raw.length) return
    const rootIds = raw
      .filter((n) => !n.parentId || !raw.some((x) => x.id === n.parentId))
      .map((n) => n.id)
    const remapped = cloneSubtree(raw, rootIds, { offsetX: 16, offsetY: 16 })
    const before = getNodes()
    commands.execute(createReplaceAllCommand(getNodes, setNodes, [...before, ...remapped]))
    const remappedRoots = remapped.filter(
      (n) => !n.parentId || !remapped.some((x) => x.id === n.parentId)
    )
    selection.selectMany(remappedRoots.map((n) => n.id))
  }

  const moveBefore = (id: string, siblingId: string) => {
    if (readonly.value) return
    const next = treeMoveBefore(getNodes(), id, siblingId)
    commands.execute(createReplaceAllCommand(getNodes, setNodes, next))
  }

  const moveAfter = (id: string, siblingId: string) => {
    if (readonly.value) return
    const next = treeMoveAfter(getNodes(), id, siblingId)
    commands.execute(createReplaceAllCommand(getNodes, setNodes, next))
  }

  const moveInto = (id: string, parentId: string) => {
    if (readonly.value) return
    const next = treeMoveInto(getNodes(), id, parentId)
    if (next) commands.execute(createReplaceAllCommand(getNodes, setNodes, next))
  }

  const alignSelection = (axis: AlignAxis) => {
    const selected = selection.selectedNodes.value
    if (selected.length < 2 || readonly.value) return
    let next = getNodes()
    if (axis === 'left') {
      const minX = Math.min(...selected.map((n) => n.x))
      for (const n of selected) next = patchNode(next, n.id, { x: minX })
    } else if (axis === 'right') {
      const maxR = Math.max(...selected.map((n) => n.x + n.w))
      for (const n of selected) next = patchNode(next, n.id, { x: maxR - n.w })
    } else if (axis === 'center') {
      const cx =
        (Math.min(...selected.map((n) => n.x)) + Math.max(...selected.map((n) => n.x + n.w))) / 2
      for (const n of selected) next = patchNode(next, n.id, { x: cx - n.w / 2 })
    } else if (axis === 'top') {
      const minY = Math.min(...selected.map((n) => n.y))
      for (const n of selected) next = patchNode(next, n.id, { y: minY })
    } else if (axis === 'bottom') {
      const maxB = Math.max(...selected.map((n) => n.y + n.h))
      for (const n of selected) next = patchNode(next, n.id, { y: maxB - n.h })
    } else if (axis === 'middle') {
      const cy =
        (Math.min(...selected.map((n) => n.y)) + Math.max(...selected.map((n) => n.y + n.h))) / 2
      for (const n of selected) next = patchNode(next, n.id, { y: cy - n.h / 2 })
    }
    commands.execute(createReplaceAllCommand(getNodes, setNodes, next))
  }

  const distributeSelection = (axis: 'horizontal' | 'vertical') => {
    const selected = [...selection.selectedNodes.value]
    if (selected.length < 3 || readonly.value) return
    let next = getNodes()
    if (axis === 'horizontal') {
      selected.sort((a, b) => a.x - b.x)
      const first = selected[0]!
      const last = selected[selected.length - 1]!
      const span = last.x - first.x
      const step = span / (selected.length - 1)
      selected.forEach((n, i) => {
        next = patchNode(next, n.id, { x: first.x + step * i })
      })
    } else {
      selected.sort((a, b) => a.y - b.y)
      const first = selected[0]!
      const last = selected[selected.length - 1]!
      const span = last.y - first.y
      const step = span / (selected.length - 1)
      selected.forEach((n, i) => {
        next = patchNode(next, n.id, { y: first.y + step * i })
      })
    }
    commands.execute(createReplaceAllCommand(getNodes, setNodes, next))
  }

  const dispose = () => {
    selection.clear()
    clipboard.clear()
  }

  return {
    document,
    selection,
    history,
    clipboard: {
      hasContent: clipboard.hasContent,
      copy: clipboard.copy,
      paste: clipboard.paste,
      clear: clipboard.clear
    },
    viewport,
    commands,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    nodes,
    selectedIds: selection.selectedIds,
    selectedNodes: selection.selectedNodes,
    addNode,
    deleteSelection,
    updateNode,
    moveNode,
    resizeNode,
    reparent,
    duplicateSelection,
    copySelection,
    pasteClipboard,
    moveBefore,
    moveAfter,
    moveInto,
    alignSelection,
    distributeSelection,
    dispose
  }
}

export function loadSchemaIntoEditor(editor: LowcodeEditor, schema: CanvasSchema): void {
  editor.document.mode.value = schema.mode
  editor.commands.execute(
    createReplaceAllCommand(
      () => editor.nodes.value,
      (n) => editor.document.applyNodes(n),
      schema.nodes
    )
  )
}
