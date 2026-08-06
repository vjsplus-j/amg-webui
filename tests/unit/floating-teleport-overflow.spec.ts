import { afterEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Select from '../../packages/components/base/Select/index.vue'
import DatePicker from '../../packages/components/base/DatePicker/index.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

function clippedHost() {
  const host = document.createElement('div')
  host.className = 'vp-test-clip'
  host.style.cssText =
    'overflow:hidden;height:48px;width:240px;position:relative;'
  document.body.appendChild(host)
  return host
}

describe('floating Teleport overflow contract', () => {
  it('Select panel teleports to body and stays fixed outside clipped host', async () => {
    const host = clippedHost()
    mount(Select, {
      props: {
        options: [
          { label: 'Alpha', value: 'a' },
          { label: 'Beta', value: 'b' }
        ]
      },
      attachTo: host
    })

    host.querySelector<HTMLElement>('.vp-select__trigger')?.click()
    await flushPromises()
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>('.vp-select__panel')
    expect(panel).not.toBeNull()
    expect(host.contains(panel)).toBe(false)
    expect(panel?.parentElement).toBe(document.body)
    expect(panel?.style.position || getComputedStyle(panel!).position).toBe(
      'fixed'
    )
    expect(panel?.style.top || panel?.style.inset).toBeTruthy()

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    )
    await flushPromises()
    expect(document.body.querySelector('.vp-select__panel')).toBeNull()
  })

  it('DatePicker panel teleports to body from an overflow:hidden parent', async () => {
    const host = clippedHost()
    mount(DatePicker, {
      props: { modelValue: null, placeholder: 'Pick' },
      attachTo: host
    })

    host.querySelector<HTMLElement>('.vp-datepicker__trigger')?.click()
    await flushPromises()
    await nextTick()

    const panel = document.body.querySelector<HTMLElement>(
      '.vp-datepicker__panel'
    )
    expect(panel).not.toBeNull()
    expect(host.contains(panel)).toBe(false)
    expect(panel?.parentElement).toBe(document.body)
    expect(panel?.style.position || getComputedStyle(panel!).position).toBe(
      'fixed'
    )
    expect(panel?.style.top || panel?.style.inset).toBeTruthy()
  })
})
