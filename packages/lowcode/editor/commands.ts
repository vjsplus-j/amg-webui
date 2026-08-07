import type { CanvasNodeData } from '@amg-webui/utils'
import type { Command, Rect } from './types'
import { deleteSubtree, patchNode, reparentNode, cloneSubtree } from './treeOps'

let commandSeq = 0
function cid(prefix: string): string {
  commandSeq += 1
  return `${prefix}-${commandSeq}`
}

export function createSnapshotCommand(
  label: string,
  _getNodes: () => CanvasNodeData[],
  setNodes: (nodes: CanvasNodeData[]) => void,
  before: CanvasNodeData[],
  after: CanvasNodeData[]
): Command {
  return {
    id: cid('snap'),
    label,
    execute() {
      setNodes(after)
    },
    undo() {
      setNodes(before)
    },
    redo() {
      setNodes(after)
    }
  }
}

export function createAddNodeCommand(
  getNodes: () => CanvasNodeData[],
  setNodes: (nodes: CanvasNodeData[]) => void,
  node: CanvasNodeData
): Command {
  const before = getNodes().map((n) => ({ ...n, props: { ...n.props } }))
  const after = [...before, { ...node, props: { ...node.props } }]
  return createSnapshotCommand('AddNode', getNodes, setNodes, before, after)
}

export function createDeleteNodesCommand(
  getNodes: () => CanvasNodeData[],
  setNodes: (nodes: CanvasNodeData[]) => void,
  ids: string[]
): Command {
  const before = getNodes().map((n) => ({ ...n, props: { ...n.props } }))
  const after = deleteSubtree(before, ids)
  return createSnapshotCommand('DeleteNode', getNodes, setNodes, before, after)
}

export function createMoveNodeCommand(
  getNodes: () => CanvasNodeData[],
  setNodes: (nodes: CanvasNodeData[]) => void,
  id: string,
  x: number,
  y: number
): Command {
  const before = getNodes().map((n) => ({ ...n, props: { ...n.props } }))
  const after = patchNode(before, id, { x, y })
  return createSnapshotCommand('MoveNode', getNodes, setNodes, before, after)
}

export function createResizeNodeCommand(
  getNodes: () => CanvasNodeData[],
  setNodes: (nodes: CanvasNodeData[]) => void,
  id: string,
  rect: Rect
): Command {
  const before = getNodes().map((n) => ({ ...n, props: { ...n.props } }))
  const after = patchNode(before, id, { x: rect.x, y: rect.y, w: rect.w, h: rect.h })
  return createSnapshotCommand('ResizeNode', getNodes, setNodes, before, after)
}

export function createUpdatePropsCommand(
  getNodes: () => CanvasNodeData[],
  setNodes: (nodes: CanvasNodeData[]) => void,
  id: string,
  patch: Partial<CanvasNodeData>
): Command {
  const before = getNodes().map((n) => ({ ...n, props: { ...n.props } }))
  const after = patchNode(before, id, patch)
  return createSnapshotCommand('UpdateProps', getNodes, setNodes, before, after)
}

export function createReparentCommand(
  getNodes: () => CanvasNodeData[],
  setNodes: (nodes: CanvasNodeData[]) => void,
  id: string,
  parentId: string | null
): Command | null {
  const before = getNodes().map((n) => ({ ...n, props: { ...n.props } }))
  const after = reparentNode(before, id, parentId)
  if (!after) return null
  return createSnapshotCommand('ReparentNode', getNodes, setNodes, before, after)
}

export function createDuplicateCommand(
  getNodes: () => CanvasNodeData[],
  setNodes: (nodes: CanvasNodeData[]) => void,
  ids: string[],
  offset = 16
): Command {
  const before = getNodes().map((n) => ({ ...n, props: { ...n.props } }))
  const clones = cloneSubtree(before, ids, { offsetX: offset, offsetY: offset })
  const after = [...before, ...clones]
  return createSnapshotCommand('DuplicateNode', getNodes, setNodes, before, after)
}

export function createBatchCommand(label: string, commands: Command[]): Command {
  return {
    id: cid('batch'),
    label,
    execute() {
      for (const c of commands) c.execute()
    },
    undo() {
      for (let i = commands.length - 1; i >= 0; i--) commands[i]!.undo()
    },
    redo() {
      for (const c of commands) c.redo()
    }
  }
}

export function createReplaceAllCommand(
  getNodes: () => CanvasNodeData[],
  setNodes: (nodes: CanvasNodeData[]) => void,
  next: CanvasNodeData[]
): Command {
  const before = getNodes().map((n) => ({ ...n, props: { ...n.props } }))
  const after = next.map((n) => ({ ...n, props: { ...n.props } }))
  return createSnapshotCommand('ReplaceAll', getNodes, setNodes, before, after)
}
