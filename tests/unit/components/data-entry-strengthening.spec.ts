import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { LocaleService } from '@amg-webui/locale'
import InputNumber from '../../../packages/components/base/InputNumber/index.vue'
import RangeInput from '../../../packages/components/base/RangeInput/index.vue'
import TimePicker from '../../../packages/components/base/TimePicker/index.vue'
import InputCaptcha from '../../../packages/components/base/InputCaptcha/index.vue'
import SmsCode from '../../../packages/components/base/SmsCode/index.vue'
import Transfer from '../../../packages/components/base/Transfer/index.vue'

beforeAll(() => LocaleService.init())

describe('data entry strengthening', () => {
  it('InputNumber exposes correct controls and respects numeric boundaries', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 1, min: 1, max: 2 } })
    const buttons = wrapper.findAll('button')

    expect(buttons[0]!.attributes('disabled')).toBeDefined()
    expect(buttons[0]!.attributes('aria-hidden')).toBeUndefined()
    await buttons[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('RangeInput reuses InputNumber and normalizes crossed values', async () => {
    const wrapper = mount(RangeInput, {
      props: { modelValue: { min: 2, max: 8 } }
    })

    expect(wrapper.findAll('.vp-inputnumber')).toHaveLength(2)
    await wrapper.findAll('input')[0]!.setValue('10')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ min: 8, max: 10 }])
  })

  it('TimePicker opens an accessible panel, applies steps and clears value', async () => {
    const wrapper = mount(TimePicker, {
      props: { modelValue: '12:30:00', minuteStep: 15, clearable: true }
    })

    await wrapper.get('.vp-timepicker__trigger').trigger('click')
    expect(wrapper.get('.vp-timepicker__panel').attributes('role')).toBe('listbox')
    expect(wrapper.findAll('.vp-timepicker__column')[1]!.findAll('button')).toHaveLength(4)
    await wrapper.get('.vp-timepicker__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('InputCaptcha supports deterministic generation and case-insensitive verify', async () => {
    const wrapper = mount(InputCaptcha, {
      props: { generator: () => 'AB12', length: 4, showRefreshButton: false }
    })
    await wrapper.get('input').setValue('ab12')
    expect(wrapper.emitted('generated')?.[0]).toEqual(['AB12'])
    expect(wrapper.emitted('verify')?.at(-1)).toEqual([true])
    expect(wrapper.findAll('.vp-button')).toHaveLength(0)
  })

  it('SmsCode waits for the async send guard and reports failures', async () => {
    const error = new Error('network')
    const wrapper = mount(SmsCode, {
      props: { beforeSend: () => Promise.reject(error) }
    })
    await wrapper.get('button').trigger('click')
    await Promise.resolve()
    expect(wrapper.emitted('send')).toBeUndefined()
    expect(wrapper.emitted('send-error')?.[0]).toEqual([error])
  })

  it('Transfer renders real directional controls instead of placeholder glyphs', () => {
    const wrapper = mount(Transfer, {
      props: { data: [{ key: 'a', label: 'A' }] }
    })
    expect(wrapper.findAll('.vp-transfer__action')).toHaveLength(2)
    expect(wrapper.text()).not.toContain('?')
  })
})
