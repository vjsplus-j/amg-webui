/**
 * Upload family keyboard evidence — Upload dropzone Enter/Space behavior.
 * @vitest-environment happy-dom
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Upload from '@amg-webui/form/Upload/index.vue'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { setupKeyboardHarness, type KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/upload.spec.ts'

beforeAll(() => setupKeyboardHarness())

describe('Upload family keyboard — Upload', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Upload',
      family: 'upload',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Enter on dropzone opens file picker', async () => {
    const wrapper = mount(Upload, {
      props: { drag: true, modelValue: [] }
    })
    const fileInput = wrapper.get('input[type="file"]').element as HTMLInputElement
    let pickerOpened = false
    fileInput.addEventListener('click', () => {
      pickerOpened = true
    })

    await wrapper.get('.vp-upload__drop').trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(pickerOpened).toBe(true)

    testCases.push({
      name: 'enter-opens-picker',
      key: 'Enter',
      expected: 'Enter on dropzone invokes hidden file input click',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled dropzone does not open picker on Space', async () => {
    const wrapper = mount(Upload, {
      props: { drag: true, disabled: true, modelValue: [] }
    })
    const fileInput = wrapper.get('input[type="file"]').element as HTMLInputElement
    let pickerOpened = false
    fileInput.addEventListener('click', () => {
      pickerOpened = true
    })

    await wrapper.get('.vp-upload__drop').trigger('keydown', { key: ' ' })
    await nextTick()

    expect(pickerOpened).toBe(false)

    testCases.push({
      name: 'disabled-no-picker',
      key: 'Space',
      expected: 'disabled dropzone does not open file picker on Space',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})
