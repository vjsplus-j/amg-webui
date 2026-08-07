import { afterEach, describe, expect, it, vi } from 'vitest'

describe('SSR module imports', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it(
    'imports core modules without throwing',
    async () => {
      const modules = await Promise.all([
        import('@amg-webui/utils/env'),
        import('@amg-webui/utils/dom'),
        import('@amg-webui/theme/core'),
        import('@amg-webui/overlay/MessageBox/service'),
        import('@amg-webui/core/Affix/useAffix'),
        import('@amg-webui/data/InfiniteScroll/directive'),
        import('@amg-webui/core/Button/index.vue'),
        import('@amg-webui/form/Select/useSelect')
      ])

      for (const mod of modules) {
        expect(mod).toBeTruthy()
      }
    },
    15_000
  )

  it('theme core init works when window is undefined', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)
    const { createThemeRuntime, createNullHost, createMemoryStorage, resetDefaultThemeRuntime } =
      await import('@amg-webui/theme/core')
    resetDefaultThemeRuntime()
    const runtime = createThemeRuntime({
      host: createNullHost(),
      storage: createMemoryStorage({ 'amg-webui-design-v3': 'mercedes' })
    })
    runtime.init()
    expect(runtime.getState().design).toBe('mercedes')
  })
})
