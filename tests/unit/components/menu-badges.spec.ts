import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleKeys } from '@amg-webui/locale'
import { hasLucideIcon } from '@amg-webui/icons'
import Menu from '../../../packages/components/core/Menu/index.vue'
import { resolveComponentBadges } from '../../../example/nav-component-badges'

describe('Menu compact badges', () => {
  it('renders Hot as an accessible icon-only Flame badge', async () => {
    const wrapper = mount(Menu, {
      props: {
        items: [
          {
            key: 'exclusive',
            label: 'Exclusive',
            badges: [
              { tone: 'hot', label: 'Hot', icon: 'Flame' },
              { tone: 'ep', label: 'EP' }
            ]
          }
        ]
      }
    })

    const hot = wrapper.get('.vp-menu__badge--hot')
    expect(hot.classes()).toContain('vp-menu__badge--icon')
    expect(hot.attributes('role')).toBe('img')
    expect(hot.attributes('aria-label')).toBe('Hot')
    expect(hot.attributes('title')).toBe('Hot')
    expect(hot.text()).toBe('')
    expect(hot.find('.vp-icon').exists()).toBe(true)
    expect(hot.find('svg').exists()).toBe(true)
    expect(wrapper.get('.vp-menu__badge--ep').text()).toBe('EP')

    await wrapper.setProps({ collapsed: true })
    await nextTick()
    expect(wrapper.find('.vp-menu__badges').exists()).toBe(false)
    expect(wrapper.get('.vp-menu__item').attributes('title')).toBe('Exclusive · Hot · EP')
  })

  it('classifies exclusive components with the localized Hot flame contract', () => {
    expect(hasLucideIcon('Flame')).toBe(true)
    expect(resolveComponentBadges('__exclusive_component__', (key) => key)).toEqual([
      {
        tone: 'hot',
        label: LocaleKeys.nav.badge.hot,
        icon: 'Flame'
      }
    ])
  })
})
