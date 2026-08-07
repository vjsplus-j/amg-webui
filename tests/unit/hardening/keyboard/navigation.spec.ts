/**
 * Navigation family keyboard evidence — Tabs arrow/tab behavior.
 * @vitest-environment happy-dom
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Tabs from '@amg-webui/core/Tabs/index.vue'
import TabPane from '@amg-webui/core/TabPane/index.vue'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { setupKeyboardHarness, type KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/navigation.spec.ts'

beforeAll(() => setupKeyboardHarness())

function mountTabs(modelValue = 'a') {
  return mount(Tabs, {
    props: { modelValue },
    slots: {
      default: () => [
        h(TabPane, { name: 'a', label: 'Tab A' }, () => 'Pane A'),
        h(TabPane, { name: 'b', label: 'Tab B' }, () => 'Pane B'),
        h(TabPane, { name: 'c', label: 'Tab C' }, () => 'Pane C')
      ]
    }
  })
}

describe('Navigation family keyboard — Tabs', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Tabs',
      family: 'navigation',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('ArrowRight activates next tab and updates modelValue', async () => {
    const wrapper = mountTabs('a')
    await nextTick()

    const tabs = wrapper.findAll('[role="tab"]')
    await tabs[0].trigger('keydown', { key: 'ArrowRight' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    expect(tabs[1].attributes('aria-selected')).toBe('true')

    testCases.push({
      name: 'arrow-right-activates-tab',
      key: 'ArrowRight',
      expected: 'ArrowRight activates next tab and emits update:modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('ArrowLeft activates previous tab', async () => {
    const wrapper = mountTabs('b')
    await nextTick()

    const tabs = wrapper.findAll('[role="tab"]')
    await tabs[1].trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    expect(tabs[0].attributes('aria-selected')).toBe('true')

    testCases.push({
      name: 'arrow-left-activates-tab',
      key: 'ArrowLeft',
      expected: 'ArrowLeft activates previous tab and emits update:modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})
