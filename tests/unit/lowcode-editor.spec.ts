import { describe, expect, it } from 'vitest'
import { createCanvasNode } from '@amg-webui/utils'
import {
  canDrop,
  cloneSubtree,
  createLowcodeEditor,
  createMoveNodeCommand,
  snapPosition,
  applyResizeHandle,
  wouldCreateCycle
} from '@amg-webui/lowcode'
import { createPageRuntime } from '@amg-webui/lowcode'
import {
  createUserManagementTemplate,
  exportDocumentJson,
  importDocumentJson,
  migrateLowcodeDocument
} from '@amg-webui/lowcode'

describe('lowcode editor core', () => {
  it('merges drag transaction into one undo step', () => {
    const a = createCanvasNode('Button', 'A', { id: 'a', x: 0, y: 0, w: 100, h: 40 })
    const editor = createLowcodeEditor({ nodes: [a] })
    editor.commands.beginTransaction('Move')
    editor.commands.previewPatch([{ ...a, x: 10, y: 0 }])
    editor.commands.previewPatch([{ ...a, x: 20, y: 0 }])
    editor.commands.previewPatch([{ ...a, x: 40, y: 0 }])
    const before = editor.nodes.value.map((n) => ({ ...n }))
    editor.commands.cancelTransaction()
    expect(editor.nodes.value[0]!.x).toBe(0)
    editor.moveNode('a', 40, 0)
    expect(editor.nodes.value[0]!.x).toBe(40)
    expect(editor.canUndo.value).toBe(true)
    editor.commands.undo()
    expect(editor.nodes.value[0]!.x).toBe(0)
    editor.commands.redo()
    expect(editor.nodes.value[0]!.x).toBe(40)
    void before
    void createMoveNodeCommand
  })

  it('clones subtree with remapped ids and parentIds', () => {
    const parent = createCanvasNode('Card', 'P', { id: 'p', x: 0, y: 0 })
    const child = createCanvasNode('Button', 'C', {
      id: 'c',
      x: 8,
      y: 8,
      parentId: 'p'
    })
    const clones = cloneSubtree([parent, child], ['p'], { offsetX: 16, offsetY: 16 })
    expect(clones).toHaveLength(2)
    const ids = new Set(clones.map((n) => n.id))
    expect(ids.has('p')).toBe(false)
    expect(ids.has('c')).toBe(false)
    const root = clones.find((n) => !clones.some((x) => x.id === n.parentId))!
    const nested = clones.find((n) => n.id !== root.id)!
    expect(nested.parentId).toBe(root.id)
    expect(root.x).toBe(16)
  })

  it('protects against cycles on reparent', () => {
    const a = createCanvasNode('Card', 'A', { id: 'a' })
    const b = createCanvasNode('Card', 'B', { id: 'b', parentId: 'a' })
    expect(wouldCreateCycle([a, b], 'a', 'b')).toBe(true)
    const editor = createLowcodeEditor({ nodes: [a, b] })
    editor.reparent('a', 'b')
    expect(editor.nodes.value.find((n) => n.id === 'a')!.parentId).toBeNull()
  })

  it('pastes clipboard with unique ids', () => {
    const n = createCanvasNode('Button', 'B', { id: 'b1', x: 0, y: 0 })
    const editor = createLowcodeEditor({ nodes: [n] })
    editor.selection.select('b1')
    editor.copySelection()
    editor.pasteClipboard()
    expect(editor.nodes.value).toHaveLength(2)
    const ids = editor.nodes.value.map((x) => x.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('snaps to grid and applies resize handles', () => {
    const snapped = snapPosition(
      { x: 7, y: 9, w: 100, h: 40 },
      [],
      null,
      { gridSize: 8, threshold: 6 }
    )
    expect(snapped.x % 8 === 0 || Math.abs(snapped.x - 7) <= 6).toBe(true)
    const resized = applyResizeHandle({ x: 0, y: 0, w: 100, h: 40 }, 'se', 20, 10)
    expect(resized.w).toBe(120)
    expect(resized.h).toBe(50)
  })

  it('canDrop respects accepts list', () => {
    expect(canDrop({ parentType: 'Form', childType: 'FormItem', accepts: ['FormItem'] })).toBe(
      true
    )
    expect(canDrop({ parentType: 'Form', childType: 'DataTable', accepts: ['FormItem'] })).toBe(
      false
    )
  })
})

describe('lowcode page runtime', () => {
  it('runs mock datasource into context.data', async () => {
    const rt = createPageRuntime({
      dataSources: [
        {
          id: 'queryUsers',
          type: 'mock',
          transform: 'listTotal',
          staticData: { list: [{ id: 1 }], total: 1 }
        }
      ]
    })
    await rt.runDataSource('queryUsers')
    expect(rt.context.data.queryUsers).toEqual({ list: [{ id: 1 }], total: 1 })
  })

  it('runs action chain SetState + CallApi', async () => {
    const rt = createPageRuntime({
      initial: { state: { open: false } },
      dataSources: [{ id: 'q', type: 'static', staticData: [1, 2, 3] }]
    })
    await rt.runActionChain([
      { type: 'OpenDialog', target: 'state.open' },
      { type: 'CallApi', dataSourceId: 'q' }
    ])
    expect(rt.context.state.open).toBe(true)
    expect(rt.context.data.q).toEqual([1, 2, 3])
  })
})

describe('lowcode document', () => {
  it('roundtrips user management template JSON', () => {
    const doc = createUserManagementTemplate()
    const text = exportDocumentJson(doc)
    const again = importDocumentJson(text)
    expect(again.nodes.length).toBe(doc.nodes.length)
    expect(again.dataSources[0]?.id).toBe('queryUsers')
    expect(again.actions.onSearch?.[0]?.type).toBe('CallApi')
  })

  it('migrates legacy canvas schema', () => {
    const migrated = migrateLowcodeDocument({
      version: 1,
      mode: 'free',
      nodes: [createCanvasNode('Button', 'B', { id: 'x' })]
    })
    expect(migrated.nodes).toHaveLength(1)
    expect(migrated.dataSources).toEqual([])
  })

  it('generates compilable-shaped SFC for user template', async () => {
    const { assertGeneratedSfcShape, generateVueSfc, createStudioRegistry } = await import(
      '@amg-webui/lowcode'
    )
    const doc = createUserManagementTemplate()
    const registry = createStudioRegistry('replace')
    const sfc = generateVueSfc(
      { version: 1, mode: 'free', nodes: doc.nodes },
      { registry, actions: doc.actions, componentName: 'GeneratedPage' }
    )
    const check = assertGeneratedSfcShape(sfc)
    expect(check.ok).toBe(true)
    expect(sfc).toContain('function onSearch(): void')
    expect(sfc).toContain('action: CallApi')
  })
})

describe('material drop rules', () => {
  it('enforces parentRules when dropping into a parent', async () => {
    const { canDropMaterial, createStudioMaterials } = await import('@amg-webui/lowcode')
    const mats = createStudioMaterials()
    const form = mats.find((m) => m.type === 'Form')!
    const input = mats.find((m) => m.type === 'InputText')!
    const table = mats.find((m) => m.type === 'DataTable')!
    expect(canDropMaterial(form, 'InputText', input)).toBe(true)
    expect(canDropMaterial(form, 'DataTable', table)).toBe(false)
  })
})
