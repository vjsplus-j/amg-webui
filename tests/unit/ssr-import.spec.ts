import { describe, expect, it } from 'vitest'

describe('SSR module imports', () => {
  it(
    'imports core modules without throwing',
    async () => {
      const modules = await Promise.all([
        import('@amg-webui/utils/env'),
        import('@amg-webui/utils/dom'),
        import('@amg-webui/components/base/MessageBox/service'),
        import('@amg-webui/components/base/Affix/useAffix'),
        import('@amg-webui/components/base/InfiniteScroll/directive'),
        import('@amg-webui/components/base/Button/index.vue'),
        import('@amg-webui/components/base/Select/useSelect')
      ])

      for (const mod of modules) {
        expect(mod).toBeTruthy()
      }
    },
    15_000
  )
})
