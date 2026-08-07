/**
 * Performance CI gates — virtualization must keep DOM << dataset.
 * @vitest-environment happy-dom
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import DataTable from '@amg-webui/data/DataTable/index.vue'
import Tree from '@amg-webui/data/Tree/index.vue'
import VirtualTree from '@amg-webui/data/VirtualTree/index.vue'
import Select from '@amg-webui/form/Select/index.vue'
import { disposeSortWorker } from '@amg-webui/utils/data-display/sortRows'
import { PERF_BUDGETS, assertBudget } from '../../../scripts/perf/run-perf-gates.mjs'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

beforeAll(() => LocaleService.init())
afterEach(() => disposeSortWorker())

const results: Record<string, Record<string, number>> = {}

describe('Performance gates', () => {
  it(
    'DataTable 10k virtualizes under budget',
    async () => {
      const rows = Array.from({ length: 10_000 }, (_, i) => ({
        id: i + 1,
        name: `row-${i + 1}`
      }))
      const t0 = performance.now()
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
      await new Promise((r) => setTimeout(r, 30))
      const mountMs = performance.now() - t0
      const bodyRows = wrapper.element.querySelectorAll('.vp-datatable__body tbody tr').length
      results.dataTable10k = { maxBodyRows: bodyRows, maxMountMs: mountMs }
      const check = assertBudget('dataTable10k', results.dataTable10k, PERF_BUDGETS.dataTable10k)
      expect(check.fails, check.fails.join('; ')).toEqual([])
      wrapper.unmount()
    },
    20_000
  )

  it(
    'DataTable 100k virtualizes under budget',
    async () => {
      const rows = Array.from({ length: 100_000 }, (_, i) => ({
        id: i + 1,
        name: `row-${i + 1}`
      }))
      const t0 = performance.now()
      const wrapper = mount(DataTable, {
        props: {
          value: rows,
          columns: [
            { field: 'id', header: 'ID' },
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
      await new Promise((r) => setTimeout(r, 50))
      const mountMs = performance.now() - t0
      const bodyRows = wrapper.element.querySelectorAll('.vp-datatable__body tbody tr').length
      results.dataTable100k = { maxBodyRows: bodyRows, maxMountMs: mountMs }
      const check = assertBudget(
        'dataTable100k',
        results.dataTable100k,
        PERF_BUDGETS.dataTable100k
      )
      expect(check.fails, check.fails.join('; ')).toEqual([])
      wrapper.unmount()
    },
    30_000
  )

  it(
    'Tree 10k virtualizes under budget',
    async () => {
      const options = Array.from({ length: 10_000 }, (_, i) => ({
        label: `n-${i}`,
        value: `n-${i}`
      }))
      const t0 = performance.now()
      const wrapper = mount(Tree, {
        props: {
          options,
          virtual: true,
          virtualHeight: 40
        },
        attachTo: document.body
      })
      await nextTick()
      await new Promise((r) => setTimeout(r, 30))
      const mountMs = performance.now() - t0
      const nodes = wrapper.element.querySelectorAll('[role="treeitem"]').length
      results.tree10k = { maxVisibleNodes: nodes, maxMountMs: mountMs }
      const check = assertBudget('tree10k', results.tree10k, PERF_BUDGETS.tree10k)
      expect(check.fails, check.fails.join('; ')).toEqual([])
      wrapper.unmount()
    },
    20_000
  )

  it(
    'Select 10k virtualizes under budget',
    async () => {
      const options = Array.from({ length: 10_000 }, (_, i) => ({
        label: `opt-${i + 1}`,
        value: i + 1
      }))
      const t0 = performance.now()
      const wrapper = mount(Select, {
        props: {
          options,
          virtual: true,
          placeholder: 'Choose'
        },
        attachTo: document.body
      })
      await nextTick()
      await wrapper.find('.vp-select__trigger').trigger('click')
      await nextTick()
      await new Promise((r) => setTimeout(r, 30))
      const mountMs = performance.now() - t0
      const domOptions = document.body.querySelectorAll('.vp-select__option').length
      results.select10k = { maxDomOptions: domOptions, maxMountMs: mountMs }
      const check = assertBudget('select10k', results.select10k, PERF_BUDGETS.select10k)
      expect(check.fails, check.fails.join('; ')).toEqual([])
      wrapper.unmount()
      document.body.querySelectorAll('.vp-select__panel').forEach((el) => el.remove())
    },
    20_000
  )

  it(
    'VirtualTree 100k (VirtualList engine) virtualizes under budget',
    async () => {
      const options = Array.from({ length: 100_000 }, (_, i) => ({
        label: `n-${i}`,
        value: `n-${i}`
      }))
      const t0 = performance.now()
      const wrapper = mount(VirtualTree, {
        props: {
          options,
          virtual: true,
          checkable: false,
          defaultExpandAll: true
        },
        attachTo: document.body
      })
      await nextTick()
      await new Promise((r) => setTimeout(r, 50))
      const mountMs = performance.now() - t0
      const nodes = wrapper.element.querySelectorAll('[role="treeitem"]').length
      results.virtualList100k = { maxDomItems: nodes, maxMountMs: mountMs }
      const check = assertBudget(
        'virtualList100k',
        results.virtualList100k,
        PERF_BUDGETS.virtualList100k
      )
      expect(check.fails, check.fails.join('; ')).toEqual([])
      wrapper.unmount()
    },
    30_000
  )

  afterAll(() => {
    mkdirSync(join(process.cwd(), 'component-hardening/reports'), { recursive: true })
    writeFileSync(
      join(process.cwd(), 'component-hardening/reports/perf-gate-results.json'),
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          budgets: PERF_BUDGETS,
          results,
          source: 'tests/unit/perf/perf-gates.spec.ts'
        },
        null,
        2
      ) + '\n'
    )
  })
})
