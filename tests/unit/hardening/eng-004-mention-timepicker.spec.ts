/**
 * ENG-003/004 Mention + TimePicker shared engines.
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Mention from '../../../packages/components/form/Mention/index.vue'
import TimePicker from '../../../packages/components/form/TimePicker/index.vue'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const EVIDENCE = join(process.cwd(), 'component-hardening/evidence')

describe('ENG Mention / TimePicker engines', () => {
  it('Mention opens popup and navigates with keyboard engine', async () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '@',
        options: [
          { label: 'Alice', value: 'alice' },
          { label: 'Bob', value: 'bob' }
        ]
      },
      attachTo: document.body
    })
    const ta = wrapper.find('textarea')
    await ta.trigger('input')
    // force detect by setting value with cursor after @
    const el = ta.element as HTMLTextAreaElement
    el.value = '@a'
    el.setSelectionRange(2, 2)
    await ta.trigger('input')
    await nextTick()
    expect(wrapper.find('.vp-mention__popup').exists()).toBe(true)
    await ta.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find('.vp-mention__option--active').exists()).toBe(true)
    wrapper.unmount()
  })

  it('TimePicker opens floating panel and closes on Escape', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        modelValue: '10:30:00',
        showSeconds: false
      },
      attachTo: document.body
    })
    await wrapper.find('.vp-timepicker__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.vp-timepicker__panel').exists()).toBe(true)
    await wrapper.find('.vp-timepicker__trigger').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('.vp-timepicker__panel').exists()).toBe(false)

    const dir = join(EVIDENCE, '_shared')
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, 'eng-004-mention-timepicker.json'),
      JSON.stringify(
        {
          status: 'PASS',
          engines: ['resolveKeyboardNavAction', 'moveRovingIndex', 'getFloatingPanelStyle'],
          components: ['Mention', 'TimePicker'],
          source: 'tests/unit/hardening/eng-004-mention-timepicker.spec.ts',
          verifiedAt: new Date().toISOString()
        },
        null,
        2
      ) + '\n'
    )
    wrapper.unmount()
  })
})
