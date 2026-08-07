/**
 * Datetime family keyboard evidence — TimePicker behavior assertions.
 * @vitest-environment happy-dom
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TimePicker from '@amg-webui/form/TimePicker/index.vue'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { setupKeyboardHarness, type KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/datetime.spec.ts'

beforeAll(() => setupKeyboardHarness())

describe('Datetime family keyboard — TimePicker', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'TimePicker',
      family: 'datetime',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('ArrowDown opens panel and ArrowDown changes hour selection', async () => {
    const wrapper = mount(TimePicker, {
      props: { modelValue: '10:00:00', showSeconds: false, minuteStep: 15 },
      attachTo: document.body
    })
    const trigger = wrapper.get('.vp-timepicker__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()

    expect(wrapper.find('.vp-timepicker__panel').exists()).toBe(true)
    const hourBefore = wrapper.find('.vp-timepicker__column').find('.vp-timepicker__item--selected').text()

    await wrapper.get('.vp-timepicker__panel').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const hourAfter = wrapper.find('.vp-timepicker__column').find('.vp-timepicker__item--selected').text()
    expect(hourAfter).not.toBe(hourBefore)

    testCases.push({
      name: 'arrow-down-hour-selection',
      key: 'ArrowDown',
      expected: 'ArrowDown opens panel and moves hour selection in column',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('Escape closes TimePicker panel', async () => {
    const wrapper = mount(TimePicker, {
      props: { modelValue: '10:30:00', showSeconds: false },
      attachTo: document.body
    })
    await wrapper.get('.vp-timepicker__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.vp-timepicker__panel').exists()).toBe(true)

    await wrapper.get('.vp-timepicker__trigger').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.vp-timepicker__panel').exists()).toBe(false)

    testCases.push({
      name: 'escape-closes-panel',
      key: 'Escape',
      expected: 'Escape closes TimePicker panel',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})
