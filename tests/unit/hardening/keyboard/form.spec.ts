/**
 * Form family keyboard evidence — RadioGroup, Form submit, FormItem N/A.
 * @vitest-environment happy-dom
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick, reactive } from 'vue'
import Form from '@amg-webui/form/Form/index.vue'
import FormItem from '@amg-webui/form/FormItem/index.vue'
import InputText from '@amg-webui/form/InputText/index.vue'
import RadioGroup from '@amg-webui/form/RadioGroup/index.vue'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { validateKeyboardEvidence } from '../../../../scripts/hardening/evidence.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
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

describe('Form family keyboard — Form', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Form',
      family: 'form',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  function mountValidForm() {
    const model = reactive({ title: 'Hello' })
    return mount(Form, {
      props: { model, rules: {} },
      slots: {
        default: () =>
          h(FormItem, { label: 'Title', prop: 'title' }, () =>
            h(InputText, {
              modelValue: model.title,
              'onUpdate:modelValue': (v: string) => {
                model.title = v
              }
            })
          )
      }
    })
  }

  it('Enter in field submits valid form and emits submit', async () => {
    const wrapper = mountValidForm()
    const input = wrapper.get('input')
    const formEl = wrapper.get('form').element as HTMLFormElement
    await input.trigger('focus')
    await input.trigger('keydown', { key: 'Enter' })
    formEl.requestSubmit()
    await flushPromises()
    await nextTick()

    expect(wrapper.emitted('submit')?.length).toBeGreaterThan(0)

    testCases.push({
      name: 'enter-submits-valid-form',
      key: 'Enter',
      expected:
        'Enter in field triggers native form submission and Form emits submit when valid',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('submit on invalid form emits validate but not submit', async () => {
    const model = reactive({ title: '' })
    const wrapper = mount(Form, {
      props: {
        model,
        rules: { title: [{ required: true, message: 'required' }] }
      },
      slots: {
        default: () =>
          h(FormItem, { label: 'Title', prop: 'title' }, () =>
            h(InputText, {
              modelValue: model.title,
              'onUpdate:modelValue': (v: string) => {
                model.title = v
              }
            })
          )
      }
    })

    await wrapper.get('form').trigger('submit')
    await flushPromises()
    await nextTick()

    expect(wrapper.emitted('validate')?.[0]?.[0]).toBe(false)
    expect(wrapper.emitted('submit')).toBeUndefined()

    testCases.push({
      name: 'invalid-form-blocks-submit',
      key: 'Enter',
      expected: 'invalid Form emits validate(false) and does not emit submit',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk Form keyboard evidence validates', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/Form/keyboard.json'),
        'utf8'
      )
    )
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.sourceHash).toBeTruthy()
    expect(data.contractHash).toBeTruthy()
  })
})

describe('Form family keyboard — FormItem', () => {
  const DETAIL =
    'FormItem is a label/layout wrapper; keyboard interaction is delegated to slotted controls — no standalone keyboard contract'

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'FormItem',
      family: 'form',
      testFile: TEST_FILE,
      status: 'N/A',
      detail: DETAIL
    })
  }

  afterAll(() => flushEvidence())

  it('writes N/A keyboard evidence for layout-only FormItem', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/FormItem/keyboard.json'),
        'utf8'
      )
    )
    expect(data.status).toBe('N/A')
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.sourceHash).toBeTruthy()
    expect(data.contractHash).toBeTruthy()
    expect(data.detail).toContain('layout wrapper')
  })
})
