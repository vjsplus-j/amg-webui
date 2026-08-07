import { beforeAll, describe, expect, it, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { LocaleService } from '@amg-webui/locale'
import DataTable from '@amg-webui/data/DataTable/index.vue'
import { disposeSortWorker } from '@amg-webui/utils/data-display/sortRows'

beforeAll(() => LocaleService.init())

describe('DataTable virtual + sort contract', () => {
  afterEach(() => {
    disposeSortWorker()
  })

  it('virtualizes a 10k row set (DOM rows << data length)', async () => {
    const rows = Array.from({ length: 10_000 }, (_, i) => ({
      id: i + 1,
      name: `row-${i + 1}`
    }))
    const wrapper = mount(DataTable, {
      props: {
        value: rows,
        columns: [
          { field: 'id', header: 'ID', sortable: true },
          { field: 'name', header: 'Name', sortable: true }
        ],
        virtual: true,
        virtualHeight: 40,
        rowHeight: 32,
        paginator: false
      },
      attachTo: document.body
    })
    await nextTick()
    await new Promise((r) => setTimeout(r, 50))

    const bodyRows = wrapper.element.querySelectorAll('.vp-datatable__body tbody tr')
    expect(bodyRows.length).toBeGreaterThan(0)
    expect(bodyRows.length).toBeLessThan(500)
    expect(bodyRows.length).toBeLessThan(rows.length / 5)

    wrapper.unmount()
  })

  it('sorts via header click and keeps virtual window', async () => {
    const rows = Array.from({ length: 200 }, (_, i) => ({
      id: 200 - i,
      name: `n-${200 - i}`
    }))
    const wrapper = mount(DataTable, {
      props: {
        value: rows,
        columns: [
          { field: 'id', header: 'ID', sortable: true },
          { field: 'name', header: 'Name' }
        ],
        virtual: true,
        virtualHeight: 40,
        rowHeight: 32,
        paginator: false
      },
      attachTo: document.body
    })
    await nextTick()

    const sortHeader = wrapper.find('th[data-field="id"]')
    await sortHeader.trigger('click')
    await nextTick()
    await new Promise((r) => setTimeout(r, 80))

    expect(wrapper.emitted('sort')).toBeTruthy()
    expect(wrapper.emitted('sort-change')).toBeUndefined()

    const bodyRows = wrapper.element.querySelectorAll('.vp-datatable__body tbody tr')
    expect(bodyRows.length).toBeGreaterThan(0)
    expect(bodyRows.length).toBeLessThan(120)

    wrapper.unmount()
  })
})
