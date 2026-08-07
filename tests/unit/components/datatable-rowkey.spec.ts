/**
 * DataTable rowKey resolution — identity-sensitive vs display-only paths.
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

const columns = [{ field: 'name', header: 'Name', sortable: true }]

function rowsWithId(count: number, opts?: { duplicateFirst?: boolean }) {
  const rows = Array.from({ length: count }, (_, i) => ({
    id: `row-${i + 1}`,
    name: `Row ${i + 1}`
  }))
  if (opts?.duplicateFirst && rows.length > 1) {
    rows[1] = { ...rows[0]!, name: 'Dup' }
  }
  return rows
}

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
      ...overrides
    },
    attachTo: document.body
  })
}

describe('DataTable rowKey — display-only (no selection, virtual off)', () => {
  it('uses index fallback keys when rowKey field is missing', async () => {
    const wrapper = mountTable()
    await nextTick()

    const keys = wrapper
      .findAll('tr[data-row-key]')
      .map((row) => row.attributes('data-row-key'))

    expect(keys).toEqual(['0', '1', '2'])
    wrapper.unmount()
  })
})

describe('DataTable rowKey — identity-sensitive (selection enabled)', () => {
  it('does not select rows missing stable rowKey field', async () => {
    const wrapper = mountTable({ selectionMode: 'multiple' })
    await nextTick()

    const rowCheckboxes = wrapper.findAll('tbody input[type="checkbox"]')
    await rowCheckboxes[0]!.trigger('click')
    await nextTick()

    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as unknown[]
    expect(selection ?? []).toEqual([])

    wrapper.unmount()
  })

  it('select-all skips rows without stable keys', async () => {
    const wrapper = mountTable({ selectionMode: 'multiple' })
    await nextTick()

    const selectAll = wrapper.get('thead input[type="checkbox"]')
    await selectAll.setValue(true)
    await nextTick()

    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as unknown[]
    expect(selection ?? []).toEqual([])

    wrapper.unmount()
  })

  it('errors in dev when rows lack rowKey with selection enabled', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mountTable({ selectionMode: 'multiple' })
    await nextTick()

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('[DataTable]')
    )
    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('missing unique "id"'))).toBe(
      true
    )

    wrapper.unmount()
  })

  it('keeps selection stable across sort when rowKey is present', async () => {
    const wrapper = mount(DataTable, {
      props: {
        value: rowsWithId(3),
        columns,
        rowKey: 'id',
        selectionMode: 'multiple',
        virtual: false,
        paginator: false,
        sortField: 'name',
        sortOrder: 'asc'
      },
      attachTo: document.body
    })
    await nextTick()

    const rowCheckboxes = wrapper.findAll('tbody input[type="checkbox"]')
    await rowCheckboxes[0]!.trigger('click')
    await nextTick()

    await wrapper.setProps({ sortOrder: 'desc' })
    await nextTick()

    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as string[]
    expect(selection).toEqual(['row-1'])

    wrapper.unmount()
  })

  it('preserves selection across client pagination when rowKey is present', async () => {
    const wrapper = mount(DataTable, {
      props: {
        value: rowsWithId(5),
        columns,
        rowKey: 'id',
        selectionMode: 'multiple',
        virtual: false,
        paginator: true,
        rows: 2,
        first: 0
      },
      attachTo: document.body
    })
    await nextTick()

    const rowCheckboxes = wrapper.findAll('tbody input[type="checkbox"]')
    await rowCheckboxes[0]!.trigger('click')
    await nextTick()

    await wrapper.setProps({ first: 2 })
    await nextTick()

    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as string[]
    expect(selection).toEqual(['row-1'])

    wrapper.unmount()
  })

  it('selects by custom rowKey field name', async () => {
    const value = [
      { code: 'a', name: 'Alpha' },
      { code: 'b', name: 'Beta' }
    ]
    const wrapper = mount(DataTable, {
      props: {
        value,
        columns,
        rowKey: 'code',
        selectionMode: 'multiple',
        virtual: false
      },
      attachTo: document.body
    })
    await nextTick()

    const rowCheckboxes = wrapper.findAll('tbody input[type="checkbox"]')
    await rowCheckboxes[1]!.trigger('click')
    await nextTick()

    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as string[]
    expect(selection).toEqual(['b'])

    wrapper.unmount()
  })

  it('errors in dev on duplicate rowKey values with selection', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(DataTable, {
      props: {
        value: rowsWithId(3, { duplicateFirst: true }),
        columns,
        rowKey: 'id',
        selectionMode: 'multiple',
        virtual: false
      },
      attachTo: document.body
    })
    await nextTick()

    expect(
      errorSpy.mock.calls.some((call) => String(call[0]).includes('Duplicate row keys'))
    ).toBe(true)

    wrapper.unmount()
  })
})

describe('DataTable rowKey — identity-sensitive (virtual scroll)', () => {
  it('errors in dev when virtual scroll is on and rowKey field is missing', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mountTable({ virtual: true, virtualHeight: 40 })
    await nextTick()

    expect(errorSpy).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('virtualizes rows with stable keys', async () => {
    const wrapper = mount(DataTable, {
      props: {
        value: rowsWithId(50),
        columns,
        rowKey: 'id',
        virtual: true,
        virtualHeight: 40
      },
      attachTo: document.body
    })
    await nextTick()

    const rendered = wrapper.findAll('tr[data-row-key]').length
    expect(rendered).toBeGreaterThan(0)
    expect(rendered).toBeLessThan(50)

    wrapper.unmount()
  })
})

describe('DataTable rowKey — keyboard selection', () => {
  it('keyboard selection emits KeyboardEvent without MouseEvent cast', async () => {
    const wrapper = mount(DataTable, {
      props: {
        value: rowsWithId(2),
        columns,
        rowKey: 'id',
        selectionMode: 'multiple',
        virtual: false
      },
      attachTo: document.body
    })
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

    const selection = wrapper.emitted('update:selection')?.at(-1)?.[0] as string[]
    expect(selection).toEqual(['row-1'])

    wrapper.unmount()
  })
})
