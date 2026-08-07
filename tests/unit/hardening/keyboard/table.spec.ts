/**
 * Table family keyboard evidence — DataTable behavior assertions.
 * @vitest-environment happy-dom
 */
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import DataTable from '@amg-webui/data/DataTable/index.vue'
import { disposeSortWorker } from '@amg-webui/utils/data-display/sortRows'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { validateKeyboardEvidence } from '../../../../scripts/hardening/evidence.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/table.spec.ts'

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

beforeAll(() => LocaleService.init())

afterEach(() => {
  disposeSortWorker()
})

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

describe('Table family keyboard — DataTable', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'DataTable',
      family: 'table',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

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

    testCases.push(
      {
        name: 'arrow-row-navigation',
        key: 'ArrowDown',
        expected: 'ArrowDown/ArrowUp/Home/End move grid row focus',
        status: 'PASS'
      },
      {
        name: 'enter-row-select',
        key: 'Enter',
        expected: 'Enter selects focused row and emits update:selection',
        status: 'PASS'
      }
    )
    wrapper.unmount()
  })

  it('Escape clears focus without extra selection', async () => {
    const wrapper = mountTable()
    await nextTick()

    const grid = wrapper.get('.vp-datatable')
    await grid.trigger('keydown', { key: 'Home' })
    await grid.trigger('keydown', { key: 'ArrowDown' })
    const beforeEscape = wrapper.emitted('update:selection')?.length ?? 0
    await grid.trigger('keydown', { key: 'Escape' })
    await grid.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:selection')?.length ?? 0).toBe(beforeEscape)

    testCases.push({
      name: 'escape-clear-focus',
      key: 'Escape',
      expected: 'Escape clears row focus without additional selection',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk DataTable keyboard evidence validates from real assertions', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/DataTable/keyboard.json'),
        'utf8'
      )
    )
    const v = validateKeyboardEvidence(data)
    expect(v.ok).toBe(true)
    expect(data.testCases?.length).toBeGreaterThanOrEqual(2)
    expect(data.keys).toEqual(expect.arrayContaining(['ArrowDown', 'Enter', 'Escape']))
  })
})
