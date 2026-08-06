import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import {
  createComponentRegistry,
  generateVueSfc,
  migrateCanvasSchema,
  validateCanvasSchema,
  wouldCreateCycle
} from '@amg-webui/lowcode'
import { CANVAS_SCHEMA_VERSION, createCanvasNode } from '@amg-webui/utils'

const Stub = defineComponent({
  name: 'StubButton',
  props: { label: { type: String, default: '' } },
  setup(props) {
    return () => h('button', props.label)
  }
})

const StubCard = defineComponent({
  name: 'StubCard',
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
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
})
