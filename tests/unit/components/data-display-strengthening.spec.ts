import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { LocaleService } from '@amg-webui/locale'
import GraphChart from '../../../packages/components/base/GraphChart/index.vue'
import TreeChart from '../../../packages/components/base/TreeChart/index.vue'

beforeAll(() => LocaleService.init())

describe('data display strengthening', () => {
  it('GraphChart has an honest empty state and keyboard-selectable nodes', async () => {
    const empty = mount(GraphChart)
    expect(empty.get('.vp-graph-chart__muted').text().length).toBeGreaterThan(0)

    const wrapper = mount(GraphChart, {
      props: { nodes: [{ id: 'a', label: 'Node A' }], edges: [] }
    })
    await wrapper.get('.vp-graph-chart__node').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ id: 'a' })
  })

  it('TreeChart removes fabricated fallback data and emits selected nodes', async () => {
    const empty = mount(TreeChart)
    expect(empty.find('svg').exists()).toBe(false)

    const wrapper = mount(TreeChart, {
      props: { options: [{ label: 'Root', value: 'root' }] }
    })
    await wrapper.get('.vp-tree-chart__node').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toContain('root')
    expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ label: 'Root' })
  })
})
