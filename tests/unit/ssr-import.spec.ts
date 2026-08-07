import { afterEach, describe, expect, it, vi } from 'vitest'

describe('SSR module imports', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it(
    'imports core modules without throwing',
    async () => {
      const env = await import('@amg-webui/utils/env')
      const dom = await import('@amg-webui/utils/dom')
      const theme = await import('@amg-webui/theme/core')
      const messageBox = await import('@amg-webui/overlay/MessageBox/service')
      const affix = await import('@amg-webui/core/Affix/useAffix')
      const infiniteScroll = await import('@amg-webui/data/InfiniteScroll/directive')
      const button = await import('@amg-webui/core/Button/index.vue')
      const select = await import('@amg-webui/form/Select/useSelect')

      for (const mod of [env, dom, theme, messageBox, affix, infiniteScroll, button, select]) {
        expect(mod).toBeTruthy()
      }
    },
    45_000
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
