import { describe, expect, it, vi, beforeAll } from 'vitest'
import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { SchemaRenderer } from '@amg-webui/lowcode'
import { LocaleService } from '@amg-webui/locale'
import {
  createComponentRegistry,
  generateVueSfc,
  getByPath,
  isSafePathExpr,
  LOWCODE_BINDINGS_KEY,
  LOWCODE_EVENTS_KEY,
  migrateCanvasSchema,
  resolveNodeRender,
  resolveRuntimeRender,
  setByPath,
  validateCanvasSchema,
  wouldCreateCycle
} from '@amg-webui/lowcode'
import { CANVAS_SCHEMA_VERSION, createCanvasNode } from '@amg-webui/utils'

beforeAll(() => {
  LocaleService.init()
})

const Stub = defineComponent({
  name: 'StubButton',
  props: { label: { type: String, default: '' } },
  emits: ['click'],
  setup(props, { emit }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          onClick: () => emit('click')
        },
        props.label
      )
  }
})

const StubCard = defineComponent({
  name: 'StubCard',
  props: { title: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => h('div', { 'data-title': props.title }, [props.title, slots.default?.()])
  }
})

const StubInput = defineComponent({
  name: 'StubInput',
  props: { modelValue: { type: String, default: '' } },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        value: props.modelValue,
        onInput: (e: Event) =>
          emit('update:modelValue', (e.target as HTMLInputElement).value)
      })
  }
})

describe('lowcode schema engine', () => {
  it('registers materials and validates types', () => {
    const registry = createComponentRegistry([
      {
        type: 'Button',
        label: 'Button',
        component: Stub,
        defaultProps: { label: 'OK' },
        propsSchema: { label: { type: 'string', required: true } }
      }
    ])
    expect(registry.toMaterials()).toHaveLength(1)

    const ok = validateCanvasSchema(
      {
        version: CANVAS_SCHEMA_VERSION,
        mode: 'free',
        nodes: [createCanvasNode('Button', 'Button', { props: { label: 'A' } })]
      },
      { registry, checkRequiredProps: true }
    )
    expect(ok.ok).toBe(true)

    const bad = validateCanvasSchema(
      {
        version: 1,
        mode: 'free',
        nodes: [createCanvasNode('Missing', 'x', { props: {} })]
      },
      { registry }
    )
    expect(bad.ok).toBe(false)
    expect(bad.issues.some((i) => i.code === 'unknown-type')).toBe(true)
  })

  it('migrates and generates vue sfc', () => {
    const registry = createComponentRegistry([
      { type: 'Button', label: 'Button', component: Stub, exportName: 'Button' }
    ])
    const migrated = migrateCanvasSchema({
      mode: 'free',
      nodes: [{ id: '1', type: 'Button', label: 'B', x: 0, y: 0, w: 10, h: 10 }]
    })
    expect(migrated.version).toBe(CANVAS_SCHEMA_VERSION)
    expect(migrated.nodes[0]?.props).toEqual({})

    const sfc = generateVueSfc(
      {
        version: 1,
        mode: 'free',
        nodes: [createCanvasNode('Button', 'Button', { props: { label: 'Go' }, x: 8, y: 8 })]
      },
      { registry }
    )
    expect(sfc).toContain('<script setup')
    expect(sfc).toContain('Button')
    expect(sfc).toContain('label="Go"')
    expect(sfc).not.toContain('eval(')
  })

  it('detects parentId cycles and nests codegen', () => {
    const parent = createCanvasNode('Card', 'Card', { id: 'p', props: {} })
    const child = createCanvasNode('Button', 'Button', {
      id: 'c',
      parentId: 'p',
      props: { label: 'In' }
    })
    const nodes = [parent, child]
    expect(wouldCreateCycle(nodes, 'p', 'c')).toBe(true)
    expect(wouldCreateCycle(nodes, 'c', null)).toBe(false)

    const registry = createComponentRegistry([
      { type: 'Card', label: 'Card', component: StubCard, isContainer: true, events: ['click'] },
      { type: 'Button', label: 'Button', component: Stub, exportName: 'Button' }
    ])
    const sfc = generateVueSfc({ version: 1, mode: 'free', nodes }, { registry })
    expect(sfc).toContain('vp-generated-container')
    expect(sfc).toContain('onCardClick')
    expect(sfc).toContain('label="In"')
  })

  it('rejects duplicate ids, missing parents, cycles, sizes, props, bindings, events', () => {
    const registry = createComponentRegistry([
      {
        type: 'Button',
        label: 'Button',
        component: Stub,
        propsSchema: {
          label: { type: 'string', required: true },
          severity: { type: 'enum', enum: ['primary', 'danger'] }
        },
        events: ['click']
      }
    ])

    const dup = createCanvasNode('Button', 'A', { id: 'same', props: { label: 'A' } })
    const dup2 = createCanvasNode('Button', 'B', { id: 'same', props: { label: 'B' } })
    expect(
      validateCanvasSchema(
        { version: 1, mode: 'free', nodes: [dup, dup2] },
        { registry }
      ).issues.some((i) => i.code === 'duplicate-id')
    ).toBe(true)

    const orphan = createCanvasNode('Button', 'O', {
      parentId: 'missing',
      props: { label: 'O' }
    })
    expect(
      validateCanvasSchema(
        { version: 1, mode: 'free', nodes: [orphan] },
        { registry }
      ).issues.some((i) => i.code === 'missing-parent')
    ).toBe(true)

    const a = createCanvasNode('Button', 'A', { id: 'a', parentId: 'b', props: { label: 'A' } })
    const b = createCanvasNode('Button', 'B', { id: 'b', parentId: 'a', props: { label: 'B' } })
    expect(
      validateCanvasSchema({ version: 1, mode: 'free', nodes: [a, b] }, { registry }).issues.some(
        (i) => i.code === 'cycle'
      )
    ).toBe(true)

    const tiny = createCanvasNode('Button', 'T', { w: 0, h: -1, props: { label: 'T' } })
    const sizeIssues = validateCanvasSchema(
      { version: 1, mode: 'free', nodes: [tiny] },
      { registry }
    ).issues
    expect(sizeIssues.some((i) => i.code === 'invalid-size')).toBe(true)

    const badProp = createCanvasNode('Button', 'P', {
      props: { label: 1 as unknown as string, severity: 'nope' }
    })
    const propIssues = validateCanvasSchema(
      { version: 1, mode: 'free', nodes: [badProp] },
      { registry }
    ).issues
    expect(propIssues.some((i) => i.code === 'invalid-prop-type')).toBe(true)
    expect(propIssues.some((i) => i.code === 'invalid-enum')).toBe(true)

    const badBind = createCanvasNode('Button', 'Bind', {
      props: {
        label: 'x',
        [LOWCODE_BINDINGS_KEY]: { label: 'foo()' },
        [LOWCODE_EVENTS_KEY]: { click: 'bad-handler!', hover: 'onHover' }
      }
    })
    const bindIssues = validateCanvasSchema(
      { version: 1, mode: 'free', nodes: [badBind] },
      { registry }
    ).issues
    expect(bindIssues.some((i) => i.code === 'invalid-binding')).toBe(true)
    expect(bindIssues.some((i) => i.code === 'invalid-handler')).toBe(true)
    expect(bindIssues.some((i) => i.code === 'invalid-event')).toBe(true)

    const many = Array.from({ length: 3 }, (_, i) =>
      createCanvasNode('Button', `n${i}`, { id: `n${i}`, props: { label: 'x' } })
    )
    expect(
      validateCanvasSchema(
        { version: 1, mode: 'free', nodes: many },
        { registry, maxNodes: 2 }
      ).issues.some((i) => i.code === 'too-many-nodes')
    ).toBe(true)
  })

  it('throws on registry type conflict by default', () => {
    const registry = createComponentRegistry([
      { type: 'Button', label: 'Button', component: Stub }
    ])
    expect(() =>
      registry.register({ type: 'Button', label: 'Other', component: StubCard })
    ).toThrow(/already registered/)

    const soft = createComponentRegistry(
      [{ type: 'Button', label: 'Button', component: Stub }],
      { onConflict: 'skip' }
    )
    const skipped = soft.register({ type: 'Button', label: 'Other', component: StubCard })
    expect(skipped.skipped).toEqual(['Button'])
    expect(soft.get('Button')?.label).toBe('Button')

    const replace = createComponentRegistry(
      [{ type: 'Button', label: 'Button', component: Stub }],
      { onConflict: 'replace' }
    )
    const replaced = replace.register({ type: 'Button', label: 'Other', component: StubCard })
    expect(replaced.replaced).toEqual(['Button'])
    expect(replace.get('Button')?.label).toBe('Other')
  })

  it('whitelists path expressions and get/set without eval', () => {
    expect(isSafePathExpr('form.name')).toBe(true)
    expect(isSafePathExpr('count')).toBe(true)
    expect(isSafePathExpr('a.b.c')).toBe(true)
    expect(isSafePathExpr('foo()')).toBe(false)
    expect(isSafePathExpr('a[0]')).toBe(false)
    expect(isSafePathExpr('a + b')).toBe(false)
    expect(isSafePathExpr('__proto__.x')).toBe(false)

    const ctx = { form: { name: 'Ada' }, count: 1 }
    expect(getByPath(ctx, 'form.name')).toBe('Ada')
    expect(setByPath(ctx, 'form.name', 'Bob')).toBe(true)
    expect(ctx.form.name).toBe('Bob')
    expect(setByPath(ctx, 'missing.x', 1)).toBe(false)
  })

  it('resolveNodeRender strips meta keys; resolveRuntimeRender binds context + events', () => {
    const registry = createComponentRegistry([
      {
        type: 'InputText',
        label: 'Input',
        component: StubInput,
        events: ['update:modelValue']
      },
      { type: 'Button', label: 'Button', component: Stub, events: ['click'] }
    ])
    const ctx = reactive({ form: { title: 'Hello' } })
    const onClick = vi.fn()
    const node = createCanvasNode('InputText', 'Input', {
      props: {
        placeholder: 'x',
        [LOWCODE_BINDINGS_KEY]: { modelValue: 'form.title' },
        [LOWCODE_EVENTS_KEY]: { click: 'onButtonClick' }
      }
    })

    const staticRender = resolveNodeRender(node, registry)
    expect(staticRender.props).not.toHaveProperty(LOWCODE_BINDINGS_KEY)
    expect(staticRender.props).not.toHaveProperty(LOWCODE_EVENTS_KEY)
    expect(staticRender.props.placeholder).toBe('x')

    const runtime = resolveRuntimeRender(node, {
      registry,
      context: ctx,
      handlers: { onButtonClick: onClick }
    })
    expect(runtime.props.modelValue).toBe('Hello')
    expect(runtime.props).not.toHaveProperty(LOWCODE_BINDINGS_KEY)
    runtime.on['update:modelValue']?.('World')
    expect(ctx.form.title).toBe('World')

    const btn = createCanvasNode('Button', 'Button', {
      props: {
        label: 'Go',
        [LOWCODE_EVENTS_KEY]: { click: 'onButtonClick' }
      }
    })
    const btnRuntime = resolveRuntimeRender(btn, {
      registry,
      handlers: { onButtonClick: onClick }
    })
    btnRuntime.on.click?.()
    expect(onClick).toHaveBeenCalled()
  })

  it('codegen and runtime share binding/event names', () => {
    const registry = createComponentRegistry([
      { type: 'Button', label: 'Button', component: Stub, exportName: 'Button', events: ['click'] },
      { type: 'InputText', label: 'Input', component: StubInput, exportName: 'InputText' }
    ])
    const nodes = [
      createCanvasNode('InputText', 'Input', {
        props: {
          [LOWCODE_BINDINGS_KEY]: { modelValue: 'form.title' }
        }
      }),
      createCanvasNode('Button', 'Button', {
        props: {
          label: 'Save',
          [LOWCODE_EVENTS_KEY]: { click: 'onSave' }
        }
      })
    ]
    const sfc = generateVueSfc({ version: 1, mode: 'free', nodes }, { registry })
    expect(sfc).toContain('v-model="form.title"')
    expect(sfc).toContain('@click="onSave"')
    expect(sfc).toContain('function onSave')

    const ctx = reactive({ form: { title: 'T' } })
    const onSave = vi.fn()
    const inputRuntime = resolveRuntimeRender(nodes[0]!, {
      registry,
      context: ctx
    })
    expect(inputRuntime.props.modelValue).toBe('T')
    const btnRuntime = resolveRuntimeRender(nodes[1]!, {
      registry,
      handlers: { onSave }
    })
    btnRuntime.on.click?.()
    expect(onSave).toHaveBeenCalled()
  })
})

describe('SchemaRenderer recursion + runtime bindings', () => {
  it('renders three-level parentId trees', async () => {
    const registry = createComponentRegistry([
      { type: 'Card', label: 'Card', component: StubCard, isContainer: true },
      { type: 'Button', label: 'Button', component: Stub }
    ])
    const container = createCanvasNode('Card', 'Outer', {
      id: 'c1',
      props: { title: 'Outer' },
      x: 0,
      y: 0,
      w: 300,
      h: 200
    })
    const mid = createCanvasNode('Card', 'Mid', {
      id: 'c2',
      parentId: 'c1',
      props: { title: 'Mid' },
      w: 200,
      h: 120
    })
    const leaf = createCanvasNode('Button', 'Leaf', {
      id: 'b1',
      parentId: 'c2',
      props: { label: 'Deep' },
      w: 80,
      h: 32
    })

    const wrapper = mount(SchemaRenderer, {
      props: {
        schema: {
          version: CANVAS_SCHEMA_VERSION,
          mode: 'free',
          nodes: [container, mid, leaf]
        },
        registry,
        renderMode: 'component'
      },
      global: { config: { warnHandler: () => undefined } }
    })

    await nextTick()
    expect(wrapper.text()).toContain('Outer')
    expect(wrapper.text()).toContain('Mid')
    expect(wrapper.text()).toContain('Deep')
    expect(wrapper.findAll('button').some((b) => b.text() === 'Deep')).toBe(true)
  })

  it('applies context bindings and handlers at runtime', async () => {
    const registry = createComponentRegistry([
      { type: 'InputText', label: 'Input', component: StubInput },
      { type: 'Button', label: 'Button', component: Stub, events: ['click'] }
    ])
    const ctx = reactive({ form: { title: 'Bound' } })
    const onSave = vi.fn()
    const input = createCanvasNode('InputText', 'Input', {
      props: {
        [LOWCODE_BINDINGS_KEY]: { modelValue: 'form.title' }
      },
      x: 0,
      y: 0,
      w: 160,
      h: 40
    })
    const btn = createCanvasNode('Button', 'Button', {
      props: {
        label: 'Save',
        [LOWCODE_EVENTS_KEY]: { click: 'onSave' }
      },
      x: 180,
      y: 0,
      w: 80,
      h: 40
    })

    const wrapper = mount(SchemaRenderer, {
      props: {
        nodes: [input, btn],
        mode: 'free',
        registry,
        renderMode: 'component',
        context: ctx,
        handlers: { onSave }
      },
      global: { config: { warnHandler: () => undefined } }
    })

    await nextTick()
    const field = wrapper.find('input')
    expect((field.element as HTMLInputElement).value).toBe('Bound')
    await field.setValue('Updated')
    expect(ctx.form.title).toBe('Updated')

    await wrapper.find('button').trigger('click')
    expect(onSave).toHaveBeenCalled()
  })
})
