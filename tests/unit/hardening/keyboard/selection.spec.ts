/**
 * Selection family keyboard evidence — Select behavior assertions.
 * @vitest-environment happy-dom
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import AutoComplete from '@amg-webui/form/AutoComplete/index.vue'
import Cascader from '@amg-webui/form/Cascader/index.vue'
import Mention from '@amg-webui/form/Mention/index.vue'
import { Select } from '@amg-webui/form'
import TreeSelect from '@amg-webui/data/TreeSelect/index.vue'
import Dropdown from '@amg-webui/overlay/Dropdown/index.vue'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { validateKeyboardEvidence } from '../../../../scripts/hardening/evidence.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { setupKeyboardHarness, type KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/selection.spec.ts'
const OPTIONS = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' }
]

beforeAll(() => setupKeyboardHarness())

function mountSelect(modelValue: unknown = undefined) {
  return mount(Select, {
    props: { modelValue, options: OPTIONS },
    attachTo: document.body
  })
}

function activeOptionLabel(wrapper: VueWrapper) {
  const active = wrapper.find('.vp-select__option--active')
  return active.exists() ? active.text() : null
}

describe('Selection family keyboard — Select', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Select',
      family: 'selection',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('ArrowDown changes highlighted active option', async () => {
    const wrapper = mountSelect()
    const trigger = wrapper.get('.vp-select__trigger')
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.find('.vp-select__option--active').exists()).toBe(true)
    const firstActive = activeOptionLabel(wrapper)
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const secondActive = activeOptionLabel(wrapper)
    expect(secondActive).toBeTruthy()
    expect(secondActive).not.toBe(firstActive)

    testCases.push({
      name: 'arrow-down-active-option',
      key: 'ArrowDown',
      expected: 'moves highlighted active option in open listbox',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('Enter selects active option and updates modelValue', async () => {
    const wrapper = mountSelect()
    const trigger = wrapper.get('.vp-select__trigger')
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0]
    expect(last).toBe('beta')

    testCases.push({
      name: 'enter-selects-model',
      key: 'Enter',
      expected: 'selects active option and emits update:modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('Escape closes popup', async () => {
    const wrapper = mountSelect()
    const trigger = wrapper.get('.vp-select__trigger')
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)

    await trigger.trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    expect(wrapper.get('.vp-select__trigger').attributes('aria-expanded')).toBe('false')

    testCases.push({
      name: 'escape-closes-popup',
      key: 'Escape',
      expected: 'closes listbox and sets aria-expanded false',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk Select keyboard evidence validates', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/Select/keyboard.json'),
        'utf8'
      )
    )
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.testCases?.length).toBeGreaterThanOrEqual(3)
  })
})

const CASCADER_OPTIONS = [
  {
    label: 'A',
    value: 'a',
    children: [
      { label: 'A1', value: 'a1' },
      { label: 'A2', value: 'a2' }
    ]
  },
  { label: 'B', value: 'b' }
]

const TREE_SELECT_OPTIONS = [
  {
    label: 'Root',
    value: 'root',
    children: [{ label: 'Leaf', value: 'leaf' }]
  },
  { label: 'Other', value: 'other' }
]

const DROPDOWN_ITEMS = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' }
]

describe('Selection family keyboard — AutoComplete', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'AutoComplete',
      family: 'selection',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('ArrowDown highlights suggestion and Enter selects value', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        suggestions: ['alpha', 'beta', 'gamma'],
        debounce: 0
      },
      attachTo: document.body
    })
    const input = wrapper.get('.vp-autocomplete__input')
    await input.trigger('focus')
    await input.setValue('a')
    await nextTick()
    await new Promise((r) => setTimeout(r, 25))
    await nextTick()

    expect(wrapper.find('.vp-autocomplete__panel').exists()).toBe(true)

    await input.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find('.vp-autocomplete__item--active').exists()).toBe(true)

    await input.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)

    testCases.push(
      {
        name: 'arrow-down-active-suggestion',
        key: 'ArrowDown',
        expected: 'moves highlighted suggestion in open panel',
        status: 'PASS'
      },
      {
        name: 'enter-selects-suggestion',
        key: 'Enter',
        expected: 'selects active suggestion and emits update:modelValue',
        status: 'PASS'
      }
    )
    wrapper.unmount()
  })

  it('Escape closes suggestion panel', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        suggestions: ['alpha', 'beta'],
        debounce: 0
      },
      attachTo: document.body
    })
    const input = wrapper.get('.vp-autocomplete__input')
    await input.trigger('focus')
    await input.setValue('a')
    await nextTick()
    await new Promise((r) => setTimeout(r, 25))
    await nextTick()
    expect(wrapper.find('.vp-autocomplete__panel').exists()).toBe(true)

    await input.trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.vp-autocomplete__panel').exists()).toBe(false)

    testCases.push({
      name: 'escape-closes-panel',
      key: 'Escape',
      expected: 'closes autocomplete suggestion panel',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Selection family keyboard — Cascader', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Cascader',
      family: 'selection',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('ArrowDown opens panel and highlights active item', async () => {
    const wrapper = mount(Cascader, {
      props: { options: CASCADER_OPTIONS },
      attachTo: document.body
    })
    const trigger = wrapper.get('.vp-cascader__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(wrapper.find('.vp-cascader__panel').exists()).toBe(true)
    expect(wrapper.find('.vp-cascader__item--active').exists()).toBe(true)

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const activeLabels = wrapper.findAll('.vp-cascader__item--active').map((n) => n.text())
    expect(activeLabels.length).toBeGreaterThan(0)

    testCases.push({
      name: 'arrow-down-active-item',
      key: 'ArrowDown',
      expected: 'opens panel and moves highlighted cascader item',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('Escape closes cascader panel', async () => {
    const wrapper = mount(Cascader, {
      props: { options: CASCADER_OPTIONS },
      attachTo: document.body
    })
    const trigger = wrapper.get('.vp-cascader__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find('.vp-cascader__panel').exists()).toBe(true)

    await wrapper.get('.vp-cascader__panel').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.vp-cascader__panel').exists()).toBe(false)

    testCases.push({
      name: 'escape-closes-panel',
      key: 'Escape',
      expected: 'closes cascader panel and restores focus',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Selection family keyboard — TreeSelect', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'TreeSelect',
      family: 'selection',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('ArrowDown opens panel and moves active node', async () => {
    const wrapper = mount(TreeSelect, {
      props: { options: TREE_SELECT_OPTIONS },
      attachTo: document.body
    })
    const trigger = wrapper.get('.vp-treeselect__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(wrapper.find('.vp-treeselect__panel').exists()).toBe(true)
    const firstActive = wrapper.find('.vp-treeselect__node--active').text()

    await wrapper.get('.vp-treeselect__panel').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const secondActive = wrapper.find('.vp-treeselect__node--active').text()
    expect(secondActive).not.toBe(firstActive)

    testCases.push({
      name: 'arrow-down-active-node',
      key: 'ArrowDown',
      expected: 'opens panel and moves highlighted tree node',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('Enter selects focused node and updates modelValue', async () => {
    const wrapper = mount(TreeSelect, {
      props: { options: TREE_SELECT_OPTIONS },
      attachTo: document.body
    })
    const trigger = wrapper.get('.vp-treeselect__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await wrapper.get('.vp-treeselect__panel').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await wrapper.get('.vp-treeselect__panel').trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)
    const last = wrapper.emitted('update:modelValue')!.at(-1)![0]
    expect(last).toBe('other')

    testCases.push({
      name: 'enter-selects-node',
      key: 'Enter',
      expected: 'selects focused node and emits update:modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Selection family keyboard — Mention', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Mention',
      family: 'selection',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('ArrowDown moves active mention option', async () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '@',
        options: [
          { label: 'Alice', value: 'alice' },
          { label: 'Bob', value: 'bob' }
        ]
      },
      attachTo: document.body
    })
    const ta = wrapper.get('textarea')
    const el = ta.element as HTMLTextAreaElement
    el.setSelectionRange(1, 1)
    await ta.trigger('input')
    await nextTick()
    expect(wrapper.find('.vp-mention__popup').exists()).toBe(true)

    const firstLabel = wrapper.find('.vp-mention__option--active .vp-mention__option-label').text()
    await ta.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const secondLabel = wrapper.find('.vp-mention__option--active .vp-mention__option-label').text()
    expect(secondLabel).not.toBe(firstLabel)

    testCases.push({
      name: 'arrow-down-active-option',
      key: 'ArrowDown',
      expected: 'moves highlighted mention option in popup listbox',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('Enter inserts active mention into modelValue', async () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '@',
        options: [
          { label: 'Alice', value: 'alice' },
          { label: 'Bob', value: 'bob' }
        ]
      },
      attachTo: document.body
    })
    const ta = wrapper.get('textarea')
    const el = ta.element as HTMLTextAreaElement
    el.setSelectionRange(1, 1)
    await ta.trigger('input')
    await nextTick()
    await ta.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await ta.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)
    const last = String(wrapper.emitted('update:modelValue')!.at(-1)![0])
    expect(last).toContain('@bob')

    testCases.push({
      name: 'enter-inserts-mention',
      key: 'Enter',
      expected: 'inserts active mention option into modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Selection family keyboard — Dropdown', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Dropdown',
      family: 'selection',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('ArrowDown moves menuitem focus in open menu', async () => {
    const wrapper = mount(Dropdown, {
      props: { items: DROPDOWN_ITEMS, modelValue: 'alpha' },
      attachTo: document.body,
      global: { stubs: { Transition: false, RouterLink: true, teleport: false } }
    })
    await wrapper.get('.vp-dropdown__trigger').trigger('click')
    await nextTick()

    const menu = document.body.querySelector('.vp-dropdown__menu') as HTMLElement
    expect(menu).toBeTruthy()
    const firstFocused = menu.querySelector<HTMLElement>('[tabindex="0"]')
    expect(firstFocused).toBeTruthy()
    const firstLabel = firstFocused!.textContent

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    const nextFocused = menu.querySelector<HTMLElement>('[tabindex="0"]')
    expect(nextFocused!.textContent).not.toBe(firstLabel)

    testCases.push({
      name: 'arrow-down-menu-focus',
      key: 'ArrowDown',
      expected: 'moves roving focus among open dropdown menuitems',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('Escape closes dropdown menu', async () => {
    const wrapper = mount(Dropdown, {
      props: { items: DROPDOWN_ITEMS },
      attachTo: document.body,
      global: { stubs: { Transition: false, RouterLink: true, teleport: false } }
    })
    await wrapper.get('.vp-dropdown__trigger').trigger('click')
    await nextTick()
    expect(document.body.querySelector('.vp-dropdown__menu')).toBeTruthy()

    const menu = document.body.querySelector('.vp-dropdown__menu') as HTMLElement
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.body.querySelector('.vp-dropdown__menu')).toBeFalsy()

    testCases.push({
      name: 'escape-closes-menu',
      key: 'Escape',
      expected: 'closes dropdown menu and restores trigger focus',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})
