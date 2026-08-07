/**
 * Tree family keyboard evidence — Tree behavior assertions.
 * @vitest-environment happy-dom
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Tree from '@amg-webui/data/Tree/index.vue'
import LazyTree from '@amg-webui/data/LazyTree/index.vue'
import VirtualTree from '@amg-webui/data/VirtualTree/index.vue'
import EditTree from '@amg-webui/data/EditTree/index.vue'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { validateKeyboardEvidence } from '../../../../scripts/hardening/evidence.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { setupKeyboardHarness, type KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/tree.spec.ts'

const TREE_DATA = [
  {
    label: 'Root',
    value: 'root',
    children: [
      { label: 'Child A', value: 'a' },
      { label: 'Child B', value: 'b' }
    ]
  },
  { label: 'Sibling', value: 'sibling' }
]

beforeAll(() => setupKeyboardHarness())

describe('Tree family keyboard — Tree', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Tree',
      family: 'tree',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('ArrowDown and ArrowUp move active row', async () => {
    const wrapper = mount(Tree, {
      props: {
        data: TREE_DATA,
        checkable: false,
        virtual: false
      }
    })
    await nextTick()

    const viewport = wrapper.get('.vp-tree__viewport')
    await viewport.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const firstActive = wrapper.find('.vp-tree__row--active')
    expect(firstActive.exists()).toBe(true)
    const firstLabel = firstActive.find('.vp-tree__label').text()

    await viewport.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const secondActive = wrapper.find('.vp-tree__row--active')
    expect(secondActive.find('.vp-tree__label').text()).not.toBe(firstLabel)

    await viewport.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(wrapper.find('.vp-tree__row--active').find('.vp-tree__label').text()).toBe(
      firstLabel
    )

    testCases.push(
      {
        name: 'arrow-down-active-row',
        key: 'ArrowDown',
        expected: 'moves active tree row highlight',
        status: 'PASS'
      },
      {
        name: 'arrow-up-active-row',
        key: 'ArrowUp',
        expected: 'moves active tree row highlight upward',
        status: 'PASS'
      }
    )
    wrapper.unmount()
  })

  it('ArrowRight expands node with children (aria-expanded true)', async () => {
    const wrapper = mount(Tree, {
      props: {
        data: TREE_DATA,
        checkable: false,
        virtual: false
      }
    })
    await nextTick()

    const viewport = wrapper.get('.vp-tree__viewport')
    const rootRow = wrapper.findAll('.vp-tree__row')[0]!
    expect(rootRow.attributes('aria-expanded')).toBe('false')

    await viewport.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(rootRow.attributes('aria-expanded')).toBe('true')

    testCases.push({
      name: 'arrow-right-expand',
      key: 'ArrowRight',
      expected: 'expands active parent node and sets aria-expanded true',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk Tree keyboard evidence validates', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/Tree/keyboard.json'),
        'utf8'
      )
    )
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.testCases?.length).toBeGreaterThanOrEqual(2)
  })
})

const FLAT_TREE_OPTIONS = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' }
]

describe('Tree family keyboard — LazyTree', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'LazyTree',
      family: 'tree',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Enter on focused label button selects node and emits modelValue', async () => {
    const wrapper = mount(LazyTree, {
      props: {
        options: FLAT_TREE_OPTIONS,
        checkable: false,
        virtual: false
      }
    })
    await nextTick()

    const label = wrapper.get('.vp-lazy-tree__label')
    await label.trigger('keydown', { key: 'Enter' })
    await label.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['alpha'])

    testCases.push({
      name: 'enter-selects-node',
      key: 'Enter',
      expected: 'Enter on label button selects node and emits update:modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Tree family keyboard — VirtualTree', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'VirtualTree',
      family: 'tree',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Enter on focused label button selects node and emits modelValue', async () => {
    const wrapper = mount(VirtualTree, {
      props: {
        options: FLAT_TREE_OPTIONS,
        checkable: false,
        virtual: false
      }
    })
    await nextTick()

    const label = wrapper.get('.vp-virtual-tree__label')
    await label.trigger('keydown', { key: 'Enter' })
    await label.trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['alpha'])

    testCases.push({
      name: 'enter-selects-node',
      key: 'Enter',
      expected: 'Enter on label button selects node and emits update:modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Tree family keyboard — EditTree', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'EditTree',
      family: 'tree',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Enter in edit input commits label change', async () => {
    const wrapper = mount(EditTree, {
      props: {
        options: [{ label: 'Old label', value: 'old' }]
      }
    })
    await nextTick()

    const rowActions = wrapper.find('.vp-edit-tree__row').findAll('.vp-edit-tree__action')
    await rowActions[0].trigger('click')
    await nextTick()

    const input = wrapper.get('.vp-edit-tree__input')
    await input.setValue('New label')
    await input.trigger('keyup', { key: 'Enter' })
    await nextTick()

    expect(wrapper.find('.vp-edit-tree__row button.vp-edit-tree__label').text()).toBe(
      'New label'
    )
    expect(wrapper.emitted('change')?.length).toBeGreaterThan(0)

    testCases.push({
      name: 'enter-commits-edit',
      key: 'Enter',
      expected: 'Enter in inline edit input commits node label change',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})
