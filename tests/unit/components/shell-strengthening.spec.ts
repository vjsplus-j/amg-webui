import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { LocaleService } from '@amg-webui/locale'
import { TelemetryService } from '@amg-webui/telemetry'
import CategoryNav from '../../../packages/components/base/CategoryNav/index.vue'
import FooterNav from '../../../packages/components/base/FooterNav/index.vue'
import IndexNav from '../../../packages/components/base/IndexNav/index.vue'
import MessageBoxHost from '../../../packages/components/base/MessageBox/MessageBoxHost.vue'
import { MessageBox } from '../../../packages/components/base/MessageBox/service'
import MiniNav from '../../../packages/components/base/MiniNav/index.vue'
import QuickNav from '../../../packages/components/base/QuickNav/index.vue'
import TabPane from '../../../packages/components/base/TabPane/index.vue'
import Tabs from '../../../packages/components/base/Tabs/index.vue'
import TelemetryProvider from '../../../packages/components/base/TelemetryProvider/index.vue'
import VerticalStepNav from '../../../packages/components/base/VerticalStepNav/index.vue'

beforeAll(() => {
  LocaleService.init()
})

afterEach(() => {
  MessageBox.close()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

const navItems = [
  { label: 'Overview', value: 'overview', icon: 'House', badge: 3 },
  { label: 'Settings', value: 'settings', icon: 'Settings' }
]

describe('strengthened navigation components', () => {
  it('CategoryNav owns selection and card styling', async () => {
    const wrapper = mount(CategoryNav, {
      props: { items: navItems, modelValue: 'overview', variant: 'cards' }
    })
    expect(wrapper.classes()).toContain('vp-category-nav--cards')
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['settings'])
    expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ value: 'settings' })
  })

  it('FooterNav renders safe external links and emits selection', async () => {
    const wrapper = mount(FooterNav, {
      props: {
        items: [{ label: 'Docs', value: 'docs', href: '#docs', target: '_blank' }],
        dividers: true
      }
    })
    const link = wrapper.get('a')
    link.element.addEventListener('click', (event) => event.preventDefault())
    expect(link.attributes('rel')).toBe('noopener noreferrer')
    await link.trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual(['docs'])
  })

  it('IndexNav activates and scrolls hash targets', async () => {
    const target = document.createElement('section')
    target.id = 'settings-section'
    target.scrollIntoView = vi.fn()
    document.body.appendChild(target)
    const wrapper = mount(IndexNav, {
      props: {
        items: [{ label: 'S', value: 'settings', href: '#settings-section' }]
      }
    })
    await wrapper.get('button').trigger('click')
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    expect(wrapper.emitted('navigate')?.[0]?.[1]).toBe(target)
  })

  it('MiniNav and QuickNav expose their compact and grid contracts', () => {
    const mini = mount(MiniNav, { props: { items: navItems, collapsed: true } })
    expect(mini.classes()).toContain('vp-mini-nav--collapsed')
    expect(mini.get('button').attributes('aria-label')).toBe('Overview')

    const quick = mount(QuickNav, { props: { items: navItems, columns: 3 } })
    expect(quick.attributes('style')).toContain('--vp-quick-nav-columns: 3')
    expect(quick.findAll('.vp-quick-nav__item')).toHaveLength(2)
  })

  it('VerticalStepNav derives finish/process states and updates v-model', async () => {
    const wrapper = mount(VerticalStepNav, {
      props: {
        modelValue: 1,
        items: [
          { label: 'Account', value: 0 },
          { label: 'Profile', value: 1 },
          { label: 'Done', value: 2, status: 'error' }
        ]
      }
    })
    expect(wrapper.findAll('[data-status]')[0]!.attributes('data-status')).toBe('finish')
    expect(wrapper.findAll('[data-status]')[1]!.attributes('data-status')).toBe('process')
    expect(wrapper.findAll('[data-status]')[2]!.attributes('data-status')).toBe('error')
    await wrapper.findAll('button')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })
})

describe('provider, tabs and message box behavior', () => {
  it('keeps TabPane emits resolvable by compiler-sfc in dev mode', () => {
    const source = readFileSync(
      resolve('packages/components/base/TabPane/types.ts'),
      'utf8'
    )
    expect(source).toMatch(/activate:\s*\[name:/)
    expect(source).toMatch(/deactivate:\s*\[name:/)
    expect(source).not.toMatch(/\(e:\s*['"](?:activate|deactivate)['"]/)
  })

  it('TabPane uses unique accessible ids and destroys inactive content', async () => {
    const slot = () => [
      h(
        TabPane,
        { name: 'a', label: 'A', destroyInactive: true },
        { default: () => 'Pane A' }
      ),
      h(
        TabPane,
        { name: 'b', label: 'B', destroyInactive: true },
        { default: () => 'Pane B' }
      )
    ]
    const root = mount({
      render: () => h('div', [
        h(Tabs, { modelValue: 'a' }, { default: slot }),
        h(Tabs, { modelValue: 'a' }, { default: slot })
      ])
    })
    const [first, second] = root.findAllComponents(Tabs)
    await nextTick()

    expect(first!.findAll('[role="tabpanel"]')).toHaveLength(1)
    expect(first!.get('[role="tabpanel"]').attributes('id')).not.toBe(
      second!.get('[role="tabpanel"]').attributes('id')
    )

    await first!.findAll('[role="tab"]')[1]!.trigger('click')
    await nextTick()
    expect(first!.findAll('[role="tabpanel"]')).toHaveLength(1)
    expect(first!.get('[role="tabpanel"]').text()).toContain('Pane B')
  })

  it('TelemetryProvider restores the previous singleton config', async () => {
    TelemetryService.replaceConfig({ enabled: false, appId: 'outer' })
    const wrapper = mount(TelemetryProvider, {
      props: { enabled: true, config: { appId: 'inner' } },
      slots: { default: () => h('span', 'child') }
    })
    await nextTick()
    expect(TelemetryService.isEnabled()).toBe(true)
    expect(TelemetryService.getConfig().appId).toBe('inner')
    wrapper.unmount()
    expect(TelemetryService.isEnabled()).toBe(false)
    expect(TelemetryService.getConfig().appId).toBe('outer')
  })

  it('MessageBoxHost validates prompts and exposes async close state', async () => {
    const wrapper = mount(MessageBoxHost, {
      props: {
        visible: true,
        mode: 'prompt',
        inputPattern: '^ok$',
        teleportTo: 'body'
      },
      attachTo: document.body,
      global: { stubs: { Teleport: true } }
    })
    await nextTick()
    const input = wrapper.get<HTMLInputElement>('input.vp-message-box__input')
    await input.setValue('no')
    await wrapper.findAll('.vp-message-box__footer button').at(-1)!.trigger('click')
    await nextTick()
    expect(wrapper.find('.vp-message-box__error').exists()).toBe(true)
    expect(wrapper.emitted('confirm')).toBeUndefined()
    wrapper.unmount()
  })

  it('MessageBox resolves replaced and programmatically closed promises', async () => {
    vi.useFakeTimers()
    const first = MessageBox.confirm('First')
    const second = MessageBox.confirm('Second')
    await expect(first).resolves.toBe('cancel')
    MessageBox.close()
    await expect(second).resolves.toBe('cancel')
    await vi.runAllTimersAsync()
  })
})
