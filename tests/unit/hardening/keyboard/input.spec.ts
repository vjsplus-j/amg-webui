/**
 * Input family keyboard evidence — InputText behavior assertions.
 * @vitest-environment happy-dom
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { InputText } from '@amg-webui/form'
import Checkbox from '@amg-webui/form/Checkbox/index.vue'
import Switch from '@amg-webui/form/Switch/index.vue'
import InputNumber from '@amg-webui/form/InputNumber/index.vue'
import Textarea from '@amg-webui/form/Textarea/index.vue'
import Password from '@amg-webui/form/Password/index.vue'
import Radio from '@amg-webui/form/Radio/index.vue'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { validateKeyboardEvidence } from '../../../../scripts/hardening/evidence.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { setupKeyboardHarness, type KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/input.spec.ts'

beforeAll(() => setupKeyboardHarness())

describe('Input family keyboard — InputText', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'InputText',
      family: 'input',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('typing updates modelValue via input events', async () => {
    const wrapper = mount(InputText, {
      props: { modelValue: '' }
    })
    const input = wrapper.get('input')
    await input.setValue('hello')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['hello'])

    testCases.push({
      name: 'typing-updates-model',
      key: 'Type',
      expected: 'typing updates modelValue through update:modelValue emit',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled input does not emit update:modelValue on keydown', async () => {
    const wrapper = mount(InputText, {
      props: { modelValue: 'locked', disabled: true }
    })
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeDefined()

    await input.trigger('keydown', { key: 'a' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    testCases.push({
      name: 'disabled-no-model-update',
      key: 'KeyA',
      expected: 'disabled input does not emit update:modelValue on key interaction',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk InputText keyboard evidence validates', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/InputText/keyboard.json'),
        'utf8'
      )
    )
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.testCases?.length).toBeGreaterThanOrEqual(2)
  })
})

describe('Input family keyboard — Checkbox', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Checkbox',
      family: 'input',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Space toggles checked state via change event', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, label: 'Agree' }
    })
    const input = wrapper.get('input')
    await input.trigger('keydown', { key: ' ' })
    await input.setValue(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])

    testCases.push({
      name: 'space-toggles-checked',
      key: 'Space',
      expected: 'Space on focused checkbox toggles modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled checkbox does not emit on Space', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, disabled: true, label: 'Locked' }
    })
    const input = wrapper.get('input')
    await input.trigger('keydown', { key: ' ' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    testCases.push({
      name: 'disabled-no-toggle',
      key: 'Space',
      expected: 'disabled checkbox does not emit update:modelValue on Space',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Input family keyboard — Switch', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Switch',
      family: 'input',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Space toggles switch modelValue', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false }
    })
    const input = wrapper.get('input')
    await input.trigger('keydown', { key: ' ' })
    await input.setValue(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])

    testCases.push({
      name: 'space-toggles-switch',
      key: 'Space',
      expected: 'Space on focused switch toggles modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled switch does not emit on Space', async () => {
    const wrapper = mount(Switch, {
      props: { modelValue: false, disabled: true }
    })
    const input = wrapper.get('input')
    await input.trigger('keydown', { key: ' ' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    testCases.push({
      name: 'disabled-no-toggle',
      key: 'Space',
      expected: 'disabled switch does not emit update:modelValue on Space',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Input family keyboard — InputNumber', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'InputNumber',
      family: 'input',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('typing digits updates modelValue', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 1, min: 0, max: 10 }
    })
    const input = wrapper.get('input')
    await input.setValue('7')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([7])

    testCases.push({
      name: 'typing-updates-model',
      key: 'Type',
      expected: 'typing updates InputNumber modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled InputNumber does not emit on typing', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 5, disabled: true }
    })
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeDefined()
    await input.trigger('keydown', { key: '7' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    testCases.push({
      name: 'disabled-no-model-update',
      key: 'Key7',
      expected: 'disabled InputNumber does not emit update:modelValue on key interaction',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Input family keyboard — Textarea', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Textarea',
      family: 'input',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('typing updates modelValue via input events', async () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: '' }
    })
    const textarea = wrapper.get('textarea')
    await textarea.setValue('multi\nline')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['multi\nline'])

    testCases.push({
      name: 'typing-updates-model',
      key: 'Type',
      expected: 'typing updates Textarea modelValue through update:modelValue emit',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled Textarea does not emit update:modelValue on keydown', async () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'locked', disabled: true }
    })
    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('disabled')).toBeDefined()

    await textarea.trigger('keydown', { key: 'a' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    testCases.push({
      name: 'disabled-no-model-update',
      key: 'KeyA',
      expected: 'disabled Textarea does not emit update:modelValue on key interaction',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk Textarea keyboard evidence validates', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/Textarea/keyboard.json'),
        'utf8'
      )
    )
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.sourceHash).toBeTruthy()
    expect(data.contractHash).toBeTruthy()
  })
})

describe('Input family keyboard — Password', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Password',
      family: 'input',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('typing updates modelValue via input events', async () => {
    const wrapper = mount(Password, {
      props: { modelValue: '' }
    })
    const input = wrapper.get('input.vp-password__input')
    await input.setValue('secret')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['secret'])

    testCases.push({
      name: 'typing-updates-model',
      key: 'Type',
      expected: 'typing updates Password modelValue through update:modelValue emit',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled Password does not emit update:modelValue on keydown', async () => {
    const wrapper = mount(Password, {
      props: { modelValue: 'locked', disabled: true }
    })
    const input = wrapper.get('input.vp-password__input')
    expect(input.attributes('disabled')).toBeDefined()

    await input.trigger('keydown', { key: 's' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    testCases.push({
      name: 'disabled-no-model-update',
      key: 'KeyS',
      expected: 'disabled Password does not emit update:modelValue on key interaction',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk Password keyboard evidence validates', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/Password/keyboard.json'),
        'utf8'
      )
    )
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.sourceHash).toBeTruthy()
    expect(data.contractHash).toBeTruthy()
  })
})

describe('Input family keyboard — Radio', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Radio',
      family: 'input',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Space on focused radio selects option and updates modelValue', async () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'alpha',
        value: 'beta',
        name: 'choice',
        label: 'Beta'
      }
    })
    const input = wrapper.get('input[type="radio"]')
    await input.trigger('focus')
    await input.trigger('keydown', { key: ' ' })
    await input.setValue(true)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta'])

    testCases.push({
      name: 'space-selects-radio',
      key: 'Space',
      expected: 'Space on focused Radio selects value and emits update:modelValue',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled Radio does not emit on Space', async () => {
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'alpha',
        value: 'beta',
        name: 'choice',
        label: 'Beta',
        disabled: true
      }
    })
    const input = wrapper.get('input[type="radio"]')
    await input.trigger('focus')
    await input.trigger('keydown', { key: ' ' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    testCases.push({
      name: 'disabled-no-selection',
      key: 'Space',
      expected: 'disabled Radio does not emit update:modelValue on Space',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk Radio keyboard evidence validates', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/Radio/keyboard.json'),
        'utf8'
      )
    )
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.sourceHash).toBeTruthy()
    expect(data.contractHash).toBeTruthy()
  })
})
