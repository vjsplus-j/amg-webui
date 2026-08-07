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
        import('@amg-webui/security'),
        import('@amg-webui/components/base/MessageBox/service'),
        import('@amg-webui/components/base/Affix/useAffix'),
        import('@amg-webui/components/base/InfiniteScroll/directive'),
        import('@amg-webui/components/base/Button/index.vue'),
        import('@amg-webui/components/base/Select/useSelect'),
        import('@amg-webui/components/base/Dialog/index.vue'),
        import('@amg-webui/components/base/Dropdown/index.vue'),
        import('@amg-webui/components/industry/Barcode/index.vue'),
        import('@amg-webui/components/industry/Qrcode/index.vue'),
        import('@amg-webui/components/industry/MatrixCode/index.vue'),
        import('@amg-webui/components/industry/OcrScan/index.vue'),
        import('@amg-webui/components/industry/GbsStatusCard/index.vue')
      ])

      for (const mod of modules) {
        expect(mod).toBeTruthy()
      }
    },
    20_000
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
