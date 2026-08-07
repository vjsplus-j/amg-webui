import { afterEach, describe, expect, it, vi } from 'vitest'

describe('Theme Core (SSR-safe)', () => {
  afterEach(async () => {
    vi.unstubAllGlobals()
    const { resetDefaultThemeRuntime } = await import('@amg-webui/theme/core')
    resetDefaultThemeRuntime()
    vi.resetModules()
  })

  it('imports core without document / localStorage', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)
    vi.stubGlobal('localStorage', undefined)

    const core = await import('@amg-webui/theme/core')
    expect(core.createThemeRuntime).toBeTypeOf('function')
    expect(core.designStyles.length).toBe(8)

    const runtime = core.createThemeRuntime({
      host: core.createNullHost(),
      storage: core.createMemoryStorage()
    })
    runtime.setDesign('porsche')
    runtime.setScheme('light')
    expect(runtime.getState().design).toBe('porsche')
    expect(runtime.getState().font).toBe('barlow')
    expect(runtime.serializeAttrs()['data-design']).toBe('porsche')
    expect(runtime.serializeAttrs()['data-scheme']).toBeUndefined()
  })

  it('memory storage + host paint without DOM', async () => {
    const core = await import('@amg-webui/theme/core')
    const attrs = new Map<string, string | null>()
    const styles = new Map<string, string | null>()
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
    const storage = core.createMemoryStorage()
    const runtime = core.createThemeRuntime({ host, storage, storageNamespace: 'mfe-a' })
    runtime.init({ overrides: { design: 'linear', scheme: 'light' } })
    expect(attrs.get('data-design')).toBe('linear')
    expect(attrs.get('data-scheme')).toBe('light')
    expect(storage.getItem('mfe-a-design-v3')).toBe('linear')

    runtime.applyCustom({ '--ds-accent': '#123456' })
    expect(styles.get('--ds-accent')).toBe('#123456')
  })

  it('replaceCustom removes tokens absent from the next map', async () => {
    const core = await import('@amg-webui/theme/core')
    const styles = new Map<string, string | null>()
    const host = {
      setAttribute() {},
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
    runtime.applyCustom({
      '--surface': '#000',
      '--text': '#fff'
    })
    expect(styles.get('--surface')).toBe('#000')
    expect(styles.get('--text')).toBe('#fff')

    runtime.replaceCustom({ '--surface': '#eee' })
    expect(styles.get('--surface')).toBe('#eee')
    expect(styles.has('--text')).toBe(false)
    expect(runtime.getState().customTokens).toEqual({ '--surface': '#eee' })

    // Incremental merge must not wipe siblings
    runtime.applyCustom({ '--ds-accent': '#123456' })
    expect(runtime.getState().customTokens['--surface']).toBe('#eee')
    expect(runtime.getState().customTokens['--ds-accent']).toBe('#123456')
  })

  it('subscribe fires on setDesign / setScheme / applyCustom', async () => {
    const core = await import('@amg-webui/theme/core')
    const runtime = core.createThemeRuntime({
      host: core.createNullHost(),
      storage: core.createMemoryStorage(),
      persist: false
    })
    const snaps: string[] = []
    const stop = runtime.subscribe((state) => {
      snaps.push(`${state.design}:${state.scheme}:${Object.keys(state.customTokens).length}`)
    })
    runtime.setDesign('porsche')
    runtime.setScheme('light')
    runtime.applyCustom({ '--ds-accent': '#abc' })
    expect(snaps.length).toBeGreaterThanOrEqual(3)
    expect(snaps.at(-1)).toContain('porsche:light:1')
    stop()
    runtime.setDesign('ferrari')
    expect(snaps.at(-1)).toContain('porsche:light:1')
  })

  it('boot script is self-contained', async () => {
    const { createThemeBootScript, themeBootScriptTag } = await import('@amg-webui/theme/core')
    const script = createThemeBootScript({ namespace: 'amg-webui' })
    expect(script).toContain('wechat')
    expect(script).toContain('alipay')
    expect(script).toContain('localStorage')
    expect(script).toContain('data-design')
    expect(script).not.toContain('import ')
    expect(themeBootScriptTag()).toMatch(/^<script>/)
  })

  it('ThemeService facade works through default runtime on happy-dom', async () => {
    const { ThemeService } = await import('@amg-webui/theme')
    const { resetDefaultThemeRuntime } = await import('@amg-webui/theme/core')
    resetDefaultThemeRuntime()
    ThemeService.init({ overrides: { design: 'apple', scheme: 'light' } })
    expect(ThemeService.getCurrentStyle()).toBe('apple')
    expect(ThemeService.getScheme()).toBe('light')
    ThemeService.applyCustom({ '--ds-accent': 'tomato' })
    expect(ThemeService.getState().customTokens['--ds-accent']).toBe('tomato')
    expect(document.documentElement.getAttribute('data-design')).toBe('apple')
  })

  it('configure isolates micro-FE namespace', async () => {
    const core = await import('@amg-webui/theme/core')
    const storage = core.createMemoryStorage()
    const hostA = {
      attrs: new Map<string, string>(),
      setAttribute(n: string, v: string | null) {
        if (v === null) this.attrs.delete(n)
        else this.attrs.set(n, v)
      },
      setStyleProperty() {}
    }
    const runtimeA = core.createThemeRuntime({
      host: hostA,
      storage,
      storageNamespace: 'app-a'
    })
    runtimeA.setDesign('ferrari')
    expect(storage.getItem('app-a-design-v3')).toBe('ferrari')
    expect(storage.getItem('amg-webui-design-v3')).toBeNull()
  })

  it('generatePrimaryScale yields full stop ladder + semantic bridges', async () => {
    const { generatePrimaryScale, parseCssColor } = await import('@amg-webui/theme/core')
    expect(parseCssColor('not-a-color')).toBeNull()
    expect(generatePrimaryScale('nope')).toEqual({})

    const scale = generatePrimaryScale('#3b82f6')
    expect(scale['--primary-500']).toBe('#3b82f6')
    expect(scale['--primary-50']).toMatch(/^#[0-9a-f]{6}$/)
    expect(scale['--primary-900']).toMatch(/^#[0-9a-f]{6}$/)
    expect(scale['--ds-accent']).toBe('#3b82f6')
    expect(scale['--ds-focus-ring']).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('setPrimary + serializeStyle for SSR injection', async () => {
    const core = await import('@amg-webui/theme/core')
    const runtime = core.createThemeRuntime({
      host: core.createNullHost(),
      storage: core.createMemoryStorage(),
      persist: false
    })
    runtime.init({ overrides: { design: 'mercedes' } })
    runtime.setPrimary('#ef4444')
    expect(runtime.getState().customTokens['--primary-500']).toBe('#ef4444')

    const css = runtime.serializeStyle(':root')
    expect(css).toContain('--primary-500:#ef4444')
    expect(css).toContain('--ds-accent:#ef4444')
    expect(runtime.toStyleTag()).toMatch(/^<style id="amg-theme-ssr">/)
  })

  it('two runtimes stay isolated', async () => {
    const core = await import('@amg-webui/theme/core')
    const stylesA = new Map<string, string>()
    const stylesB = new Map<string, string>()
    const makeHost = (styles: Map<string, string>) => ({
      setAttribute() {},
      setStyleProperty(name: string, value: string | null) {
        if (value === null) styles.delete(name)
        else styles.set(name, value)
      }
    })
    const a = core.createThemeRuntime({
      host: makeHost(stylesA),
      storage: core.createMemoryStorage(),
      persist: false
    })
    const b = core.createThemeRuntime({
      host: makeHost(stylesB),
      storage: core.createMemoryStorage(),
      persist: false
    })
    a.setPrimary('#111111')
    b.setPrimary('#eeeeee')
    expect(stylesA.get('--primary-500')).toBe('#111111')
    expect(stylesB.get('--primary-500')).toBe('#eeeeee')
    expect(a.getState().customTokens['--primary-500']).not.toBe(
      b.getState().customTokens['--primary-500']
    )
  })

  it('createShadowHost paints attrs/vars on shadow host element', async () => {
    const core = await import('@amg-webui/theme/core')
    const hostEl = document.createElement('div')
    document.body.appendChild(hostEl)
    const shadow = hostEl.attachShadow({ mode: 'open' })
    const runtime = core.createThemeRuntime({
      host: core.createShadowHost(shadow),
      storage: core.createMemoryStorage(),
      persist: false
    })
    runtime.init({ overrides: { design: 'porsche' } })
    runtime.applyCustom({ '--ds-accent': '#00ff00' })
    expect(hostEl.getAttribute('data-design')).toBe('porsche')
    expect(hostEl.style.getPropertyValue('--ds-accent')).toBe('#00ff00')
    hostEl.remove()
  })
})
