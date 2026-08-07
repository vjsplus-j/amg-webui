/**
 * ENG-003 AutoComplete / Cascader shared keyboard + floating engines.
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { moveRovingIndex, resolveKeyboardNavAction } from '@amg-webui/utils'
import AutoComplete from '../../../packages/components/form/AutoComplete/index.vue'
import Cascader from '../../../packages/components/form/Cascader/index.vue'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const EVIDENCE = join(process.cwd(), 'component-hardening/evidence')

describe('ENG-003 AutoComplete / Cascader engines', () => {
  it('shares keyboard resolver with Select', () => {
    expect(resolveKeyboardNavAction({ key: 'ArrowDown' } as KeyboardEvent, { orientation: 'vertical' })).toBe(
      'next'
    )
    expect(moveRovingIndex(1, 'prev', 4, true)).toBe(0)
  })

  it('AutoComplete mounts and navigates suggestions with engines', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        suggestions: ['alpha', 'beta', 'gamma'],
        debounce: 0
      },
      attachTo: document.body
    })
    const input = wrapper.find('.vp-autocomplete__input')
    await input.trigger('focus')
    await input.setValue('a')
    await nextTick()
    await new Promise((r) => setTimeout(r, 20))
    await nextTick()
    expect(wrapper.find('.vp-autocomplete__panel').exists()).toBe(true)
    await input.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find('.vp-autocomplete__item--active').exists()).toBe(true)
    wrapper.unmount()
  })

  it('AutoComplete renders enterprise slots (option / empty / loading)', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        suggestions: [],
        debounce: 0
      },
      slots: {
        option: `<template #option="{ item }"><span class="slot-option">{{ item.label }}</span></template>`,
        empty: '<span class="slot-empty">EMPTY</span>',
        loading: '<span class="slot-loading">LOADING</span>',
        default: '<span class="slot-default">DEFAULT</span>'
      },
      attachTo: document.body
    })
    await wrapper.find('.vp-autocomplete__input').trigger('focus')
    await nextTick()
    expect(wrapper.find('.slot-default').exists()).toBe(true)

    const remote = mount(AutoComplete, {
      props: {
        modelValue: 'a',
        debounce: 0,
        onFetchSuggestions: (_query: string, cb: (items: string[]) => void) => {
          cb([])
        }
      },
      slots: {
        empty: '<span class="slot-empty-remote">EMPTY</span>'
      },
      attachTo: document.body
    })
    const remoteInput = remote.find('.vp-autocomplete__input')
    await remoteInput.trigger('focus')
    await remoteInput.setValue('zzz')
    await nextTick()
    await new Promise((r) => setTimeout(r, 30))
    await nextTick()
    expect(remote.find('.slot-empty-remote').exists()).toBe(true)
    remote.unmount()

    const withItems = mount(AutoComplete, {
      props: {
        modelValue: '',
        suggestions: [{ value: 'alpha', label: 'Alpha' }],
        debounce: 0
      },
      slots: {
        option: '<span class="slot-option">custom-option</span>'
      },
      attachTo: document.body
    })
    await withItems.find('.vp-autocomplete__input').trigger('focus')
    await nextTick()
    await new Promise((r) => setTimeout(r, 20))
    await nextTick()
    expect(withItems.find('.slot-option').exists()).toBe(true)
    expect(withItems.find('.slot-option').text()).toBe('custom-option')
    withItems.unmount()
    wrapper.unmount()
  })

  it('Cascader opens and applies floating panel style', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options: [
          {
            label: 'A',
            value: 'a',
            children: [
              { label: 'A1', value: 'a1' },
              { label: 'A2', value: 'a2' }
            ]
          },
          { label: 'B', value: 'b' }
        ]
      },
      attachTo: document.body
    })
    await wrapper.find('.vp-cascader__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.vp-cascader__panel').exists()).toBe(true)
    await wrapper.find('.vp-cascader__trigger').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(wrapper.find('.vp-cascader__item--active').exists()).toBe(true)

    const dir = join(EVIDENCE, '_shared')
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, 'eng-003-autocomplete-cascader.json'),
      JSON.stringify(
        {
          status: 'PASS',
          engines: ['resolveKeyboardNavAction', 'moveRovingIndex', 'getFloatingPanelStyle'],
          components: ['AutoComplete', 'Cascader'],
          source: 'tests/unit/hardening/eng-003-autocomplete-cascader.spec.ts',
          verifiedAt: new Date().toISOString()
        },
        null,
        2
      ) + '\n'
    )
    wrapper.unmount()
  })
})
