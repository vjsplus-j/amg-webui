/**
 * BATCH-01-FORM-INPUT — disabled model guards, Form integration, keyboard gaps.
 * Does not write Stable/evidence JSON (see keyboard/*.spec.ts for keyboard evidence).
 * @vitest-environment happy-dom
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick, reactive, ref } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import { Button } from '@amg-webui/core'
import {
  Checkbox,
  Form,
  FormItem,
  InputNumber,
  InputText,
  Password,
  Radio,
  RadioGroup,
  Switch,
  Textarea
} from '@amg-webui/form'
import { setupKeyboardHarness } from './keyboard/_shared'

beforeAll(() => {
  LocaleService.init()
  setupKeyboardHarness()
})

describe('BATCH-01 disabled must not mutate modelValue', () => {
  it('InputText', async () => {
    const model = ref('locked')
    const wrapper = mount(InputText, {
      props: {
        modelValue: 'locked',
        disabled: true,
        'onUpdate:modelValue': (v: string) => {
          model.value = v
        }
      }
    })
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeDefined()
    await input.setValue('changed')
    await input.trigger('keydown', { key: 'a' })
    await nextTick()
    expect(model.value).toBe('locked')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('Textarea', async () => {
    const model = ref('locked')
    const wrapper = mount(Textarea, {
      props: {
        modelValue: 'locked',
        disabled: true,
        'onUpdate:modelValue': (v: string) => {
          model.value = v
        }
      }
    })
    const area = wrapper.get('textarea')
    expect(area.attributes('disabled')).toBeDefined()
    await area.setValue('changed')
    await nextTick()
    expect(model.value).toBe('locked')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('InputNumber — typing and step controls', async () => {
    const model = ref(5)
    const wrapper = mount(InputNumber, {
      props: {
        modelValue: 5,
        disabled: true,
        min: 0,
        max: 10,
        'onUpdate:modelValue': (v: number | null) => {
          model.value = v as number
        }
      }
    })
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeDefined()
    await input.setValue('9')
    await nextTick()
    expect(model.value).toBe(5)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    const buttons = wrapper.findAll('button')
    if (buttons.length >= 2) {
      await buttons[0].trigger('click')
      await buttons[1].trigger('click')
      await nextTick()
      expect(model.value).toBe(5)
    }
    wrapper.unmount()
  })

  it('Password', async () => {
    const model = ref('secret')
    const wrapper = mount(Password, {
      props: {
        modelValue: 'secret',
        disabled: true,
        'onUpdate:modelValue': (v: string) => {
          model.value = v
        }
      }
    })
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeDefined()
    await input.setValue('hacked')
    await nextTick()
    expect(model.value).toBe('secret')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('Checkbox', async () => {
    const model = ref(false)
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false,
        disabled: true,
        label: 'Locked',
        'onUpdate:modelValue': (v: boolean) => {
          model.value = v
        }
      }
    })
    const input = wrapper.get('input')
    await input.setValue(true)
    await input.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(model.value).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('Radio standalone', async () => {
    const model = ref('alpha')
    const wrapper = mount(Radio, {
      props: {
        modelValue: 'alpha',
        value: 'beta',
        label: 'Beta',
        disabled: true,
        'onUpdate:modelValue': (v: string) => {
          model.value = v
        }
      }
    })
    const input = wrapper.get('input')
    await input.setValue(true)
    await nextTick()
    expect(model.value).toBe('alpha')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('RadioGroup', async () => {
    const model = ref('alpha')
    const wrapper = mount(RadioGroup, {
      props: {
        modelValue: 'alpha',
        disabled: true,
        name: 'choice',
        options: [
          { label: 'Alpha', value: 'alpha' },
          { label: 'Beta', value: 'beta' }
        ],
        'onUpdate:modelValue': (v: string) => {
          model.value = v
        }
      }
    })
    const radios = wrapper.findAll('input[type="radio"]')
    await radios[1].setValue(true)
    await radios[1].trigger('keydown', { key: ' ' })
    await nextTick()
    expect(model.value).toBe('alpha')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('Switch', async () => {
    const model = ref(false)
    const wrapper = mount(Switch, {
      props: {
        modelValue: false,
        disabled: true,
        'onUpdate:modelValue': (v: boolean) => {
          model.value = v
        }
      }
    })
    const input = wrapper.get('input')
    await input.setValue(true)
    await input.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(model.value).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('BATCH-01 Form + FormItem integration smoke', () => {
  it('wires label, control id, validation, and model updates', async () => {
    const model = reactive({ email: '' })
    const wrapper = mount(Form, {
      props: {
        model,
        rules: { email: { required: true } }
      },
      slots: {
        default: () =>
          h(FormItem, { label: 'Email', prop: 'email' }, () =>
            h(InputText, {
              modelValue: model.email,
              'onUpdate:modelValue': (v: string) => {
                model.email = v
              }
            })
          )
      },
      attachTo: document.body
    })

    const label = wrapper.find('.vp-form-item__label')
    const input = wrapper.get('input')
    const labelFor = label.attributes('for')
    expect(labelFor).toBeTruthy()
    expect(input.attributes('id')).toBe(labelFor)

    const formVm = wrapper.vm as unknown as { validate: () => Promise<boolean> }
    expect(await formVm.validate()).toBe(false)
    await flushPromises()
    expect(wrapper.find('.vp-form-item__error').exists()).toBe(true)
    expect(input.attributes('aria-invalid')).toBe('true')

    await input.setValue('user@example.com')
    await nextTick()
    expect(model.email).toBe('user@example.com')
    expect(await formVm.validate()).toBe(true)
    await flushPromises()
    expect(wrapper.find('.vp-form-item__error').exists()).toBe(false)

    wrapper.unmount()
  })

  it('Form disabled propagates to nested InputText', async () => {
    const model = reactive({ name: 'AMG' })
    const wrapper = mount(Form, {
      props: { model, disabled: true },
      slots: {
        default: () =>
          h(FormItem, { label: 'Name', prop: 'name' }, () =>
            h(InputText, {
              modelValue: model.name,
              'onUpdate:modelValue': (v: string) => {
                model.name = v
              }
            })
          )
      }
    })

    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeDefined()
    await input.setValue('changed')
    await nextTick()
    expect(model.name).toBe('AMG')
    expect(wrapper.find('.vp-form-item--disabled').exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('BATCH-01 keyboard — components lacking family keyboard specs', () => {
  it('Textarea typing updates modelValue', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: '' } })
    await wrapper.get('textarea').setValue('multi\nline')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['multi\nline'])
    wrapper.unmount()
  })

  it('Password typing updates modelValue', async () => {
    const wrapper = mount(Password, { props: { modelValue: '' } })
    await wrapper.get('input').setValue('p@ss')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['p@ss'])
    wrapper.unmount()
  })

  it('Radio standalone selects on change', async () => {
    const wrapper = mount(Radio, {
      props: { modelValue: 'alpha', value: 'beta', label: 'Beta' }
    })
    const input = wrapper.get('input')
    await input.setValue(true)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['beta'])
    wrapper.unmount()
  })

  it('Button click emits when enabled; disabled blocks click', async () => {
    const enabled = mount(Button, { props: { label: 'Go' } })
    await enabled.get('button').trigger('click')
    expect(enabled.emitted('click')?.length).toBe(1)
    enabled.unmount()

    const disabled = mount(Button, { props: { label: 'Stop', disabled: true } })
    const btn = disabled.get('button')
    expect(btn.attributes('disabled')).toBeDefined()
    await btn.trigger('click')
    expect(disabled.emitted('click')).toBeUndefined()
    disabled.unmount()
  })
})

describe('BATCH-01 enabled model updates (smoke)', () => {
  it('InputText emits on input', async () => {
    const wrapper = mount(InputText, { props: { modelValue: '' } })
    await wrapper.get('input').setValue('hello')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['hello'])
    wrapper.unmount()
  })
})
