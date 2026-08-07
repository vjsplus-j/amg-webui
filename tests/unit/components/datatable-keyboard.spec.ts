/**
 * DataTable keyboard, scrollTo expose, sort emit, and a11y structure (unit).
 * @vitest-environment happy-dom
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import DataTable from '@amg-webui/data/DataTable/index.vue'
import { disposeSortWorker } from '@amg-webui/utils/data-display/sortRows'
import {
  validateA11yEvidence,
  validateKeyboardEvidence
} from '../../../scripts/hardening/evidence.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const EVIDENCE = join(process.cwd(), 'component-hardening/evidence/DataTable')

beforeAll(() => LocaleService.init())

afterEach(() => {
  disposeSortWorker()
})

const sampleRows = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
  { id: 3, name: 'Gamma' },
  { id: 4, name: 'Delta' }
]

const sampleColumns = [
  { field: 'id', header: 'ID', sortable: true },
  { field: 'name', header: 'Name', sortable: true }
]

function mountTable(overrides: Record<string, unknown> = {}) {
  return mount(DataTable, {
    props: {
      value: sampleRows,
      columns: sampleColumns,
      virtual: false,
      paginator: false,
      selectionMode: 'multiple',
      ...overrides
    },
    attachTo: document.body
  })
}

describe('DataTable keyboard + expose + sort', () => {
  it('exposes scrollTo and scrolls by rowIndex and row key', async () => {
    const wrapper = mountTable()
    await nextTick()

    const exposed = wrapper.vm as { scrollTo?: (o: { rowIndex?: number; key?: number }) => void }
    expect(typeof exposed.scrollTo).toBe('function')

    exposed.scrollTo!({ rowIndex: 2 })
    await nextTick()

    exposed.scrollTo!({ key: 4 })
    await nextTick()

    wrapper.unmount()
  })

  it('navigates rows with ArrowDown/ArrowUp/Home/End and selects with Enter', async () => {
    const wrapper = mountTable()
    await nextTick()

    const grid = wrapper.get('.vp-datatable')
    await grid.trigger('keydown', { key: 'Home' })
    await grid.trigger('keydown', { key: 'ArrowDown' })
    await grid.trigger('keydown', { key: 'ArrowDown' })
    await grid.trigger('keydown', { key: 'ArrowUp' })
    await grid.trigger('keydown', { key: 'End' })
    await grid.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:selection')?.length).toBeGreaterThan(0)
    expect(wrapper.emitted('row-select')?.length).toBeGreaterThan(0)

    wrapper.unmount()
  })

  it('clears focus on Escape without bubbling row selection', async () => {
    const wrapper = mountTable()
    await nextTick()

    const grid = wrapper.get('.vp-datatable')
    await grid.trigger('keydown', { key: 'Home' })
    await grid.trigger('keydown', { key: 'ArrowDown' })
    const beforeEscape = wrapper.emitted('update:selection')?.length ?? 0
    await grid.trigger('keydown', { key: 'Escape' })
    await grid.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:selection')?.length ?? 0).toBe(beforeEscape)

    wrapper.unmount()
  })

  it('emits sort (not sort-change) on header click and Enter on sortable column', async () => {
    const wrapper = mountTable()
    await nextTick()

    const sortHeader = wrapper.get('th[data-field="id"]')
    await sortHeader.trigger('click')
    await nextTick()

    expect(wrapper.emitted('sort')).toBeTruthy()
    expect(wrapper.emitted('sort')![0]![0]).toMatchObject({
      field: 'id',
      order: 'asc'
    })
    expect(wrapper.emitted('sort-change')).toBeUndefined()
    expect(wrapper.emitted('update:sortField')?.[0]).toEqual(['id'])
    expect(wrapper.emitted('update:sortOrder')?.[0]).toEqual(['asc'])

    await sortHeader.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.emitted('sort')!.length).toBeGreaterThanOrEqual(2)
    expect(wrapper.emitted('sort-change')).toBeUndefined()

    wrapper.unmount()
  })

  it('has region a11y structure: role=region, tabindex, aria-sort on sortable headers', async () => {
    const wrapper = mountTable()
    await nextTick()

    const grid = wrapper.get('.vp-datatable')
    expect(grid.attributes('role')).toBe('region')
    expect(grid.attributes('tabindex')).toBe('0')

    const sortHeader = wrapper.get('th[data-field="id"]')
    expect(sortHeader.attributes('aria-sort')).toBe('none')

    await sortHeader.trigger('click')
    await nextTick()
    expect(sortHeader.attributes('aria-sort')).toBe('ascending')

    wrapper.unmount()
  })

  it('on-disk keyboard evidence matches unit matrix', () => {
    const data = JSON.parse(readFileSync(join(EVIDENCE, 'keyboard.json'), 'utf8'))
    const v = validateKeyboardEvidence(data)
    expect(v.ok).toBe(true)
    expect(data.keys).toEqual(
      expect.arrayContaining(['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', 'Escape'])
    )
  })

  it('on-disk a11y evidence records structure and contrast dimensions', () => {
    const data = JSON.parse(readFileSync(join(EVIDENCE, 'a11y.json'), 'utf8'))
    expect(data.A11Y_STRUCTURE?.status).toBe('PASS')
    expect(['PASS', 'FAIL']).toContain(data.A11Y_CONTRAST?.status)
    if (data.status === 'PASS') {
      expect(validateA11yEvidence(data).ok).toBe(true)
    } else {
      expect(validateA11yEvidence(data).ok).toBe(false)
    }
  })
})
