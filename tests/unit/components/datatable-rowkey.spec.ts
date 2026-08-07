/**
 * DataTable rowKey resolution + selection with index fallback (unit).
 * @vitest-environment happy-dom
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import DataTable from '@amg-webui/data/DataTable/index.vue'
import { disposeSortWorker } from '@amg-webui/utils/data-display/sortRows'

beforeAll(() => LocaleService.init())

afterEach(() => {
  disposeSortWorker()
  vi.restoreAllMocks()
})

const columns = [{ field: 'name', header: 'Name' }]

function rowsWithoutId(count: number) {
  return Array.from({ length: count }, (_, i) => ({ name: `Row ${i + 1}` }))
}

function mountTable(overrides: Record<string, unknown> = {}) {
  return mount(DataTable, {
    props: {
      value: rowsWithoutId(3),
      columns,
      rowKey: 'id',
      virtual: false,
      paginator: false,
      selectionMode: 'multiple',
      ...overrides
    },
    attachTo: document.body
  })
}

describe('DataTable rowKey resolution', () => {
  it('assigns distinct index fallback keys when rowKey field is missing', async () => {
    const wrapper = mountTable()
    await nextTick()

    const keys = wrapper
      .findAll('tr[data-row-key]')
      .map((row) => row.attributes('data-row-key'))

    expect(keys).toEqual(['0', '1', '2'])
    expect(new Set(keys).size).toBe(3)
    expect(keys.every((key) => key !== '0' || keys.filter((k) => k === '0').length === 1)).toBe(
      true
    )

    wrapper.unmount()
  })

  it('does not collapse selection to a single all-zero key on select-all', async () => {
    const wrapper = mountTable()
    await nextTick()

    const selectAll = wrapper.get('thead input[type="checkbox"]')
    await selectAll.setValue(true)
    await nextTick()

    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as number[]
    expect(selection).toEqual([0, 1, 2])

    wrapper.unmount()
  })

  it('selects individual rows by index fallback without key collision', async () => {
    const wrapper = mountTable()
    await nextTick()

    const rowCheckboxes = wrapper.findAll('tbody input[type="checkbox"]')
    await rowCheckboxes[0]!.trigger('click')
    await rowCheckboxes[2]!.trigger('click')
    await nextTick()

    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as number[]
    expect(selection).toEqual(expect.arrayContaining([0, 2]))
    expect(selection).toHaveLength(2)

    wrapper.unmount()
  })

  it('warns in dev when rows lack rowKey field with selection enabled', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountTable()
    await nextTick()

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[DataTable] Rows missing unique "id" values')
    )

    wrapper.unmount()
  })

  it('keyboard selection emits KeyboardEvent without MouseEvent cast', async () => {
    const wrapper = mountTable()
    await nextTick()

    const grid = wrapper.get('.vp-datatable')
    await grid.trigger('keydown', { key: 'Home' })
    await grid.trigger('keydown', { key: 'Enter' })

    const rowSelectEvents = wrapper.emitted('row-select')
    expect(rowSelectEvents?.length).toBeGreaterThan(0)

    const payload = rowSelectEvents![0]![0] as {
      originalEvent: Event
      checked: boolean
    }
    expect(payload.originalEvent.type).toBe('keydown')
    expect(payload.checked).toBe(true)

    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as number[]
    expect(selection).toEqual([0])

    wrapper.unmount()
  })
})
