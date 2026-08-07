/**
 * Select engine wiring + DataTable coarse benchmark evidence.
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { moveRovingIndex, resolveKeyboardNavAction, useSelectionModel } from '@amg-webui/utils'
import Select from '../../../packages/components/form/Select/index.vue'
import DataTable from '../../../packages/components/data/DataTable/index.vue'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const EVIDENCE = join(process.cwd(), 'component-hardening/evidence')

describe('ENG-002 Select shared engines', () => {
  it('wires selection model + keyboard resolver', () => {
    const model = ref<string | undefined>('a')
    const selection = useSelectionModel({
      modelValue: model,
      emitChange: (v) => {
        model.value = v as string | undefined
      }
    })
    expect(selection.isSelected('a')).toBe(true)
    selection.select('b')
    expect(model.value).toBe('b')

    const ev = { key: 'ArrowDown' } as KeyboardEvent
    expect(resolveKeyboardNavAction(ev, { orientation: 'vertical' })).toBe('next')
    expect(moveRovingIndex(0, 'next', 3, true)).toBe(1)
  })

  it('Select mounts and opens with floating panel style', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: undefined,
        options: [
          { label: 'Alpha', value: 'alpha' },
          { label: 'Beta', value: 'beta' }
        ]
      },
      attachTo: document.body
    })
    await wrapper.find('.vp-select__trigger').trigger('click')
    await nextTick()
    // Panel is Teleport-to-body (fixed floating coords).
    expect(document.body.querySelector('.vp-select__panel')).toBeTruthy()

    const exposed = wrapper.vm as unknown as {
      focus: () => void
      blur: () => void
      open: () => void
      close: () => void
      clear: () => void
    }
    expect(typeof exposed.focus).toBe('function')
    expect(typeof exposed.open).toBe('function')
    expect(typeof exposed.close).toBe('function')
    expect(typeof exposed.clear).toBe('function')
    exposed.close()
    await nextTick()
    expect(document.body.querySelector('.vp-select__panel')).toBeNull()
    wrapper.unmount()
  })
})

describe('PERF-001 DataTable coarse benchmark', () => {
  it('renders 2k rows under budget and writes evidence', async () => {
    const rows = Array.from({ length: 2000 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`
    }))
    const columns = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' }
    ]
    const t0 = performance.now()
    const wrapper = mount(DataTable, {
      props: {
        value: rows,
        columns,
        rowKey: 'id'
      }
    })
    await nextTick()
    const ms = performance.now() - t0
    expect(wrapper.html().length).toBeGreaterThan(0)
    // Coarse gate — CI machines vary; fail only on extreme regression
    expect(ms).toBeLessThan(5000)

    const dir = join(EVIDENCE, 'DataTable')
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, 'perf.json'),
      JSON.stringify(
        {
          status: 'PASS',
          detail: `mount 2000 rows in ${Math.round(ms)}ms`,
          metric: { rows: 2000, mountMs: Math.round(ms), budgetMs: 5000 },
          source: 'tests/unit/hardening/select-engines-perf.spec.ts'
        },
        null,
        2
      ) + '\n'
    )
    wrapper.unmount()
  })
})
