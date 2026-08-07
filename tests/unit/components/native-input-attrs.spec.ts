import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import InputText from '@amg-webui/form/InputText/index.vue'
import Textarea from '@amg-webui/form/Textarea/index.vue'

beforeAll(() => {
  LocaleService.init()
})

describe('useNativeInputAttrs forwarding', () => {
  it('forwards undeclared native attrs that InputText does not bind explicitly', async () => {
    const wrapper = mount(InputText, {
      props: { modelValue: '42' },
      attrs: {
        pattern: '[0-9]+',
        inputmode: 'numeric',
        minlength: 2,
        'aria-labelledby': 'phone-label',
        'aria-disabled': 'true',
        'data-testid': 'phone-input'
      }
    })
    await nextTick()

    const input = wrapper.get('input').element as HTMLInputElement
    expect(input.getAttribute('pattern')).toBe('[0-9]+')
    expect(input.getAttribute('inputmode')).toBe('numeric')
    expect(input.getAttribute('minlength')).toBe('2')
    expect(input.getAttribute('aria-labelledby')).toBe('phone-label')
    expect(input.getAttribute('aria-disabled')).toBe('true')
    expect(input.getAttribute('data-testid')).toBe('phone-input')
    // Declared props still win on the native control (not the wrapper host).
    expect(input.value).toBe('42')
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.element.getAttribute('pattern')).toBeNull()
  })

  it('honors explicit exclude list without a drifting default blacklist', async () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: 'hi' },
      attrs: {
        spellcheck: 'false',
        wrap: 'hard',
        'data-host-only': '1'
      }
    })
    await nextTick()

    const el = wrapper.get('textarea').element as HTMLTextAreaElement
    expect(el.getAttribute('spellcheck')).toBe('false')
    expect(el.getAttribute('wrap')).toBe('hard')
    expect(el.getAttribute('data-host-only')).toBe('1')
  })
})
