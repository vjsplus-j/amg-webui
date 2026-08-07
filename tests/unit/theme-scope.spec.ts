import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick, unref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { ThemeProvider, ConfigProvider } from '@amg-webui/core'
import {
  THEME_RUNTIME_KEY,
  createThemeRuntime,
  createNullHost,
  createMemoryStorage,
  type ThemeRuntime
} from '@amg-webui/theme'

describe('Theme Scope (ThemeProvider / ConfigProvider)', () => {
  afterEach(async () => {
    document.documentElement.removeAttribute('data-design')
    document.documentElement.removeAttribute('data-scheme')
    document.documentElement.removeAttribute('data-font')
    document.documentElement.removeAttribute('data-icon-style')
    document.documentElement.style.removeProperty('--ds-accent')
    document.documentElement.style.removeProperty('--primary-500')
    const { resetDefaultThemeRuntime } = await import('@amg-webui/theme/core')
    resetDefaultThemeRuntime()
  })

  it('does not paint scoped runtime to documentElement', async () => {
    const wrapper = mount(ThemeProvider, {
      props: { design: 'porsche' },
      attachTo: document.body
    })
    await flushPromises()

    expect(document.documentElement.getAttribute('data-design')).toBeNull()
    expect(wrapper.element.getAttribute('data-design')).toBe('porsche')
    wrapper.unmount()
  })

  it('ConfigProvider without local theme does not hijack inherited runtime host', async () => {
    const innerDesign = vi.fn<(design: string | null) => void>()

    const Inner = defineComponent({
      setup() {
        const injected = inject(THEME_RUNTIME_KEY, null) as { value: ThemeRuntime | null } | null
        const rt = injected ? unref(injected) : null
        innerDesign(rt?.getState().design ?? null)
        return () => h('span', { class: 'inner' })
      }
    })

    const wrapper = mount(
      defineComponent({
        components: { ThemeProvider, ConfigProvider, Inner },
        setup() {
          return () =>
            h(ThemeProvider, { design: 'ferrari' }, () =>
              h(ConfigProvider, {}, () => h(Inner))
            )
        }
      })
    )
    await flushPromises()

    const outerEl = wrapper.find('.vp-theme-provider').element
    const configEl = wrapper.find('.vp-config-provider').element

    expect(outerEl.getAttribute('data-design')).toBe('ferrari')
    expect(configEl.getAttribute('data-design')).toBeNull()
    expect(innerDesign).toHaveBeenCalledWith('ferrari')
    wrapper.unmount()
  })

  it('nested ThemeProviders stay isolated on separate hosts', async () => {
    const wrapper = mount(
      defineComponent({
        components: { ThemeProvider },
        setup() {
          return () =>
            h('div', { class: 'page' }, [
              h(
                ThemeProvider,
                { design: 'mercedes', class: 'outer' },
                () =>
                  h(
                    ThemeProvider,
                    { design: 'apple', scheme: 'light', class: 'inner' },
                    () => h('span', 'child')
                  )
              )
            ])
        }
      })
    )
    await flushPromises()

    const outer = wrapper.find('.outer').element
    const inner = wrapper.find('.inner').element

    expect(outer.getAttribute('data-design')).toBe('mercedes')
    expect(inner.getAttribute('data-design')).toBe('apple')
    expect(inner.getAttribute('data-scheme')).toBe('light')
    expect(outer.getAttribute('data-scheme')).toBeNull()
    wrapper.unmount()

    expect(outer.getAttribute('data-design')).toBeNull()
    expect(inner.getAttribute('data-design')).toBeNull()
  })

  it('removing tokens prop clears overlay via replaceCustom', async () => {
    const wrapper = mount(ThemeProvider, {
      props: {
        design: 'linear',
        tokens: { '--ds-accent': '#ff0000' }
      }
    })
    await flushPromises()

    const host = wrapper.element
    expect(host.style.getPropertyValue('--ds-accent')).toBe('#ff0000')

    await wrapper.setProps({ tokens: undefined })
    await flushPromises()

    expect(host.style.getPropertyValue('--ds-accent')).toBe('')
    wrapper.unmount()
  })

  it('owned runtime is disposed when local theme axes are removed', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        design: 'porsche',
        tokens: { '--ds-accent': '#abc' }
      }
    })
    await flushPromises()

    const host = wrapper.find('.vp-config-provider').element
    expect(host.getAttribute('data-design')).toBe('porsche')
    expect(host.style.getPropertyValue('--ds-accent')).toBe('#abc')

    await wrapper.setProps({ design: undefined, tokens: undefined })
    await flushPromises()

    expect(host.getAttribute('data-design')).toBeNull()
    expect(host.style.getPropertyValue('--ds-accent')).toBe('')
    wrapper.unmount()
  })

  it('ThemeProvider unmount clears host attrs and custom tokens', async () => {
    const wrapper = mount(ThemeProvider, {
      props: {
        design: 'linear',
        scheme: 'dark',
        tokens: { '--ds-accent': '#00ff00' }
      }
    })
    await flushPromises()

    const host = wrapper.element
    expect(host.getAttribute('data-design')).toBe('linear')
    expect(host.getAttribute('data-scheme')).toBe('dark')
    expect(host.style.getPropertyValue('--ds-accent')).toBe('#00ff00')

    wrapper.unmount()
    await nextTick()

    expect(host.getAttribute('data-design')).toBeNull()
    expect(host.getAttribute('data-scheme')).toBeNull()
    expect(host.style.getPropertyValue('--ds-accent')).toBe('')
  })

  it('two ThemeProviders on one page stay token-isolated', async () => {
    const wrapper = mount(
      defineComponent({
        components: { ThemeProvider },
        setup() {
          return () =>
            h('div', [
              h(ThemeProvider, { design: 'mercedes', primary: '#111111', class: 'a' }),
              h(ThemeProvider, { design: 'apple', primary: '#eeeeee', class: 'b' })
            ])
        }
      })
    )
    await flushPromises()

    const a = wrapper.find('.a').element
    const b = wrapper.find('.b').element
    expect(a.style.getPropertyValue('--primary-500')).toBe('#111111')
    expect(b.style.getPropertyValue('--primary-500')).toBe('#eeeeee')
    wrapper.unmount()
  })
})

describe('Theme Core dispose cleanup', () => {
  it('dispose clears host attrs and custom tokens', async () => {
    const core = await import('@amg-webui/theme/core')
    const attrs = new Map<string, string>()
    const styles = new Map<string, string>()
    const host = {
      setAttribute(name: string, value: string | null) {
        if (value === null) attrs.delete(name)
        else attrs.set(name, value)
      },
      setStyleProperty(name: string, value: string | null) {
        if (value === null) styles.delete(name)
        else styles.set(name, value)
      }
    }
    const runtime = core.createThemeRuntime({
      host,
      storage: core.createMemoryStorage(),
      persist: false
    })
    runtime.init({ overrides: { design: 'linear', scheme: 'dark' } })
    runtime.applyCustom({ '--ds-accent': '#abc' })
    expect(attrs.get('data-design')).toBe('linear')
    expect(styles.get('--ds-accent')).toBe('#abc')

    runtime.dispose()
    expect(attrs.has('data-design')).toBe(false)
    expect(attrs.has('data-scheme')).toBe(false)
    expect(styles.has('--ds-accent')).toBe(false)
  })
})

describe('Theme export → applyCustom roundtrip', () => {
  it('generatePrimaryScale tokens roundtrip through applyCustom and replaceCustom', async () => {
    const { generatePrimaryScale } = await import('@amg-webui/theme/core')
    const scale = generatePrimaryScale('#3b82f6')
    expect(Object.keys(scale).length).toBeGreaterThan(0)

    const runtime = createThemeRuntime({
      host: createNullHost(),
      storage: createMemoryStorage(),
      persist: false
    })
    runtime.init({ overrides: { design: 'linear' } })
    runtime.applyCustom(scale)

    const state = runtime.getState()
    expect(state.customTokens['--primary-500']).toBe('#3b82f6')
    expect(state.customTokens['--ds-accent']).toBe('#3b82f6')

    runtime.replaceCustom(scale)
    expect(runtime.getState().customTokens['--primary-500']).toBe('#3b82f6')
    expect(runtime.getState().customTokens['--ds-accent']).toBe('#3b82f6')
  })
})
