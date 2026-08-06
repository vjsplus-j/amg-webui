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
    expect(core.designStyles.length).toBe(6)

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

  it('boot script is self-contained', async () => {
    const { createThemeBootScript, themeBootScriptTag } = await import('@amg-webui/theme/core')
    const script = createThemeBootScript({ namespace: 'amg-webui' })
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
})
