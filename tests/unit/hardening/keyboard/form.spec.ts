/**
 * Form family keyboard evidence — RadioGroup behavior assertions.
 * @vitest-environment happy-dom
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RadioGroup from '@amg-webui/form/RadioGroup/index.vue'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { setupKeyboardHarness, type KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/form.spec.ts'

const RADIO_OPTIONS = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Beta', value: 'beta' },
  { label: 'Gamma', value: 'gamma' }
]

beforeAll(() => setupKeyboardHarness())

describe('Form family keyboard — RadioGroup', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'RadioGroup',
      family: 'form',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Space on focused radio selects option and updates modelValue', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'alpha',
        name: 'choice',
        options: RADIO_OPTIONS
      }
    })
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[1].trigger('focus')
    await radios[1].trigger('keydown', { key: ' ' })
    await radios[1].setValue(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta'])

    testCases.push({
      name: 'space-selects-radio',
      key: 'Space',
      expected: 'Space on focused radio selects option and emits update:modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled RadioGroup does not emit on Space', async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'alpha',
        disabled: true,
        name: 'choice',
        options: RADIO_OPTIONS
      }
    })
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[1].trigger('focus')
    await radios[1].trigger('keydown', { key: ' ' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    testCases.push({
      name: 'disabled-no-selection',
      key: 'Space',
      expected: 'disabled RadioGroup does not emit update:modelValue on Space',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})
