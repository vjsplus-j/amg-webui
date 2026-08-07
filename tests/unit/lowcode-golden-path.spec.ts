/**
 * LC-012 Golden Path — 19/19 programmatic acceptance (Studio 0.1).
 * Mirrors docs/LOWCODE.md § 19 步验收 without Playwright E2E.
 */
import { describe, expect, it, vi, beforeAll, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, reactive } from 'vue'
import { createCanvasNode } from '@amg-webui/utils'
import { LocaleService } from '@amg-webui/locale'
import {
  SchemaRenderer,
  LOWCODE_BINDINGS_KEY,
  LOWCODE_EVENTS_KEY,
  assertGeneratedSfcShape,
  createEmptyDocument,
  createLowcodeEditor,
  createPageRuntime,
  createStudioRegistry,
  documentToSchema,
  exportDocumentJson,
  generateVueSfc,
  importDocumentJson,
  loadDocumentLocal,
  newNodeId,
  saveDocumentLocal,
  type LowcodeDocument
} from '@amg-webui/lowcode'
import { buildGeneratedSfcFixture } from '../../scripts/lowcode/build-generated-sfc-fixture.mjs'

const GOLDEN_STORAGE_KEY = 'golden-path-test'

beforeAll(() => {
  LocaleService.init()
})

function createStepTracker() {
  const steps = new Map<number, boolean>()
  return {
    mark(step: number, ok: boolean) {
      steps.set(step, ok)
    },
    completed(): number {
      return [...steps.values()].filter(Boolean).length
    },
    total(): number {
      return steps.size
    },
    failed(): number[] {
      return [...steps.entries()].filter(([, ok]) => !ok).map(([id]) => id)
    },
    summary(): string {
      return `${this.completed()}/${this.total()}`
    }
  }
}

function buildGoldenPathDocument(editor: ReturnType<typeof createLowcodeEditor>): {
  doc: LowcodeDocument
  containerId: string
  inputId: string
  buttonId: string
  tableId: string
} {
  const doc = createEmptyDocument('Golden Path')
  const containerId = newNodeId()
  const formId = newNodeId()
  const inputId = newNodeId()
  const buttonId = newNodeId()
  const tableId = newNodeId()

  editor.document.replaceAll([])
  editor.addNode(
    createCanvasNode('Container', 'Page', {
      id: containerId,
      x: 24,
      y: 24,
      w: 960,
      h: 640,
      props: { title: 'Users' }
    })
  )
  editor.addNode(
    createCanvasNode('Form', 'Search Form', {
      id: formId,
      x: 16,
      y: 48,
      w: 560,
      h: 120,
      parentId: containerId,
      props: { title: 'Search' }
    })
  )
  editor.addNode(
    createCanvasNode('InputText', 'Keyword', {
      id: inputId,
      x: 8,
      y: 8,
      w: 280,
      h: 40,
      parentId: formId,
      props: {
        placeholder: 'keyword',
        label: 'Keyword'
      }
    })
  )
  editor.addNode(
    createCanvasNode('Button', 'Search', {
      id: buttonId,
      x: 304,
      y: 8,
      w: 120,
      h: 40,
      parentId: formId,
      props: {
        label: 'Search',
        severity: 'primary',
        [LOWCODE_EVENTS_KEY]: { click: 'onSearch' }
      }
    })
  )
  editor.addNode(
    createCanvasNode('DataTable', 'Users', {
      id: tableId,
      x: 16,
      y: 176,
      w: 920,
      h: 400,
      parentId: containerId,
      props: {
        columns: [
          { field: 'id', header: 'ID', width: '80px' },
          { field: 'name', header: 'Name' }
        ],
        value: [],
        paginator: true,
        rows: 10
      }
    })
  )

  doc.nodes = editor.nodes.value.map((n) => ({ ...n, props: { ...n.props } }))
  doc.dataSources = [
    {
      id: 'queryUsers',
      type: 'mock',
      transform: 'listTotal',
      staticData: {
        list: [
          { id: 1, name: 'Ada Lovelace' },
          { id: 2, name: 'Alan Turing' }
        ],
        total: 2
      }
    }
  ]
  doc.actions = {
    onSearch: [{ type: 'CallApi', dataSourceId: 'queryUsers' }]
  }
  doc.variables = { keyword: '' }

  return { doc, containerId, inputId, buttonId, tableId }
}

describe('lowcode golden path (LC-012)', () => {
  beforeEach(() => {
    localStorage.removeItem(`amg-lowcode-studio-doc:${GOLDEN_STORAGE_KEY}`)
  })

  afterEach(() => {
    localStorage.removeItem(`amg-lowcode-studio-doc:${GOLDEN_STORAGE_KEY}`)
  })

  it('completes 19/19 acceptance steps', async () => {
    const tracker = createStepTracker()
    const registry = createStudioRegistry('replace')
    const editor = createLowcodeEditor({ nodes: [], mode: 'free' })

    // 1. Create blank page
    const blank = createEmptyDocument('Golden Path')
    tracker.mark(1, blank.nodes.length === 0 && blank.name === 'Golden Path')

    // 2–10. Drag Container / Form / InputText / bind / Button / DataTable
    const { doc, containerId, inputId, buttonId, tableId } = buildGoldenPathDocument(editor)
    tracker.mark(2, editor.nodes.value.some((n) => n.type === 'Container' && n.id === containerId))
    tracker.mark(3, editor.nodes.value.some((n) => n.type === 'Form'))
    tracker.mark(4, editor.nodes.value.some((n) => n.type === 'InputText' && n.id === inputId))

    // 5. Modify label
    editor.updateNode(inputId, {
      props: {
        ...editor.nodes.value.find((n) => n.id === inputId)!.props,
        label: 'Search keyword'
      }
    })
    const relabeled = editor.nodes.value.find((n) => n.id === inputId)!
    tracker.mark(5, relabeled.props.label === 'Search keyword')

    // 6. Bind state.keyword
    editor.updateNode(inputId, {
      props: {
        ...relabeled.props,
        [LOWCODE_BINDINGS_KEY]: { modelValue: 'state.keyword' }
      }
    })
    const bound = editor.nodes.value.find((n) => n.id === inputId)!
    tracker.mark(
      6,
      (bound.props[LOWCODE_BINDINGS_KEY] as Record<string, string>).modelValue === 'state.keyword'
    )

    // 7–8. Button + click → queryUsers (already in buildGoldenPathDocument)
    const btn = editor.nodes.value.find((n) => n.id === buttonId)!
    tracker.mark(7, btn.type === 'Button')
    tracker.mark(
      8,
      (btn.props[LOWCODE_EVENTS_KEY] as Record<string, string>).click === 'onSearch' &&
        doc.actions.onSearch?.[0]?.type === 'CallApi' &&
        doc.actions.onSearch?.[0]?.dataSourceId === 'queryUsers'
    )

    // 9–10. DataTable + value binding
    editor.updateNode(tableId, {
      props: {
        ...editor.nodes.value.find((n) => n.id === tableId)!.props,
        [LOWCODE_BINDINGS_KEY]: { value: 'data.queryUsers.list' }
      }
    })
    const table = editor.nodes.value.find((n) => n.id === tableId)!
    tracker.mark(9, table.type === 'DataTable')
    tracker.mark(
      10,
      (table.props[LOWCODE_BINDINGS_KEY] as Record<string, string>).value === 'data.queryUsers.list'
    )

    doc.nodes = editor.nodes.value.map((n) => ({ ...n, props: { ...n.props } }))

    const runtime = createPageRuntime({
      initial: {
        state: { keyword: 'ada', createOpen: false, ...doc.variables },
        form: { name: '' },
        data: {}
      },
      dataSources: doc.dataSources
    })
    const handlers = runtime.handlersFromActions(doc.actions)
    const ctx = runtime.context

    // 11. Preview — SchemaRenderer mount
    const previewWrapper = mount(SchemaRenderer, {
      props: {
        schema: documentToSchema(doc),
        registry,
        renderMode: 'component',
        context: ctx,
        handlers
      },
      global: { config: { warnHandler: () => undefined } }
    })
    await nextTick()
    tracker.mark(
      11,
      previewWrapper.find('[data-component="SchemaRenderer"]').exists() ||
        previewWrapper.element.children.length > 0
    )

    // 12. Page works — CallApi populates table data
    await runtime.runActionChain(doc.actions.onSearch ?? [])
    await nextTick()
    tracker.mark(
      12,
      Array.isArray(runtime.context.data.queryUsers?.list) &&
        (runtime.context.data.queryUsers.list as unknown[]).length === 2
    )

    // 13. Save
    saveDocumentLocal(doc, GOLDEN_STORAGE_KEY)
    tracker.mark(13, localStorage.getItem(`amg-lowcode-studio-doc:${GOLDEN_STORAGE_KEY}`) != null)

    // 14–15. Refresh + restore
    const restored = loadDocumentLocal(GOLDEN_STORAGE_KEY)
    tracker.mark(14, restored != null)
    tracker.mark(
      15,
      restored != null &&
        restored.nodes.length === doc.nodes.length &&
        restored.dataSources[0]?.id === 'queryUsers' &&
        restored.actions.onSearch?.[0]?.type === 'CallApi'
    )

    // 16–17. Export / Import JSON
    const exported = exportDocumentJson(doc)
    const imported = importDocumentJson(exported)
    tracker.mark(16, exported.includes('"queryUsers"') && exported.includes('"Container"'))
    tracker.mark(
      17,
      imported.nodes.length === doc.nodes.length && imported.actions.onSearch?.[0]?.dataSourceId === 'queryUsers'
    )

    // 18. Generate Vue SFC
    const sfc = generateVueSfc(documentToSchema(doc), {
      registry,
      componentName: 'GeneratedPage',
      actions: doc.actions,
      dataSources: doc.dataSources,
      initialContext: {
        state: { keyword: '', createOpen: false, ...doc.variables },
        form: { name: '' }
      }
    })
    tracker.mark(
      18,
      sfc.includes('<script setup') &&
        sfc.includes('createPageRuntime') &&
        sfc.includes('function onSearch')
    )

    // 19. Generated Vue compiles (@vue/compiler-sfc) and Vite-builds
    const shape = assertGeneratedSfcShape(sfc)
    const build = buildGeneratedSfcFixture(sfc)
    tracker.mark(19, shape.ok && build.ok)
    if (!build.ok) {
      expect(build.issues, build.issues.join('; ')).toEqual([])
    }

    expect(tracker.failed(), `failed steps: ${tracker.failed().join(', ')}`).toEqual([])
    expect(tracker.completed(), shape.issues.join('; ')).toBe(19)
    expect(tracker.summary()).toBe('19/19')
  })

  it('documents golden path step labels (19 total)', () => {
    const labels = Array.from({ length: 19 }, (_, i) => i + 1)
    expect(labels).toHaveLength(19)
    expect(labels[0]).toBe(1)
    expect(labels[18]).toBe(19)
  })
})

describe('lowcode golden path preview interaction', () => {
  it('binding + handler chain updates context in preview mode', async () => {
    const registry = createStudioRegistry('replace')
    const ctx = reactive({ state: { keyword: 'test' }, form: {}, data: {} as Record<string, unknown> })
    const onSearch = vi.fn(async () => {
      ctx.data.queryUsers = { list: [{ id: 1, name: 'Ada' }], total: 1 }
    })

    const input = createCanvasNode('InputText', 'Keyword', {
      x: 0,
      y: 0,
      w: 200,
      h: 40,
      props: {
        [LOWCODE_BINDINGS_KEY]: { modelValue: 'state.keyword' }
      }
    })
    const btn = createCanvasNode('Button', 'Go', {
      x: 220,
      y: 0,
      w: 80,
      h: 40,
      props: {
        label: 'Go',
        [LOWCODE_EVENTS_KEY]: { click: 'onSearch' }
      }
    })

    const wrapper = mount(SchemaRenderer, {
      props: {
        nodes: [input, btn],
        mode: 'free',
        registry,
        renderMode: 'component',
        context: ctx,
        handlers: { onSearch }
      },
      global: { config: { warnHandler: () => undefined } }
    })

    await nextTick()
    const field = wrapper.find('input')
    expect((field.element as HTMLInputElement).value).toBe('test')
    await field.setValue('updated')
    expect(ctx.state.keyword).toBe('updated')
    await wrapper.find('button').trigger('click')
    expect(onSearch).toHaveBeenCalled()
  })
})
