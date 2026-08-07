/**
 * Production SSR render matrix — Node `renderToString` for core / overlay /
 * industry symbology surfaces without DOM globals.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from '@vue/server-renderer'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

async function renderComponent(
  loader: () => Promise<{ default: unknown }>,
  props: Record<string, unknown> = {}
) {
  vi.stubGlobal('window', undefined)
  vi.stubGlobal('document', undefined)
  const mod = await loader()
  const Comp = mod.default as ReturnType<typeof defineComponent>
  const app = createSSRApp({
    render: () => h(Comp, props)
  })
  return renderToString(app)
}

describe('SSR render matrix', () => {
  it('renders Button without DOM', async () => {
    const html = await renderComponent(
      () => import('../../packages/components/base/Button/index.vue'),
      { label: 'ssr-btn' }
    )
    expect(html).toMatch(/vp-button|ssr-btn/)
  }, 20_000)

  it('renders Alert without DOM', async () => {
    const html = await renderComponent(
      () => import('../../packages/components/base/Alert/index.vue'),
      { title: 'ssr-alert' }
    )
    expect(html).toMatch(/vp-alert|ssr-alert/)
  }, 20_000)

  it('renders Tag without DOM', async () => {
    const html = await renderComponent(
      () => import('../../packages/components/base/Tag/index.vue'),
      { label: 'ssr-tag' }
    )
    expect(html).toMatch(/vp-tag|ssr-tag/)
  }, 20_000)

  it('renders Barcode symbology without DOM', async () => {
    const html = await renderComponent(
      () => import('../../packages/components/industry/Barcode/index.vue'),
      { modelValue: '6901234567892', format: 'ean13', editable: false }
    )
    expect(html).toMatch(/vp-barcode|svg|6901234567892/)
  }, 20_000)

  it('renders Qrcode symbology without DOM', async () => {
    const html = await renderComponent(
      () => import('../../packages/components/industry/Qrcode/index.vue'),
      { modelValue: 'AMG-WebUI', standard: 'iso' }
    )
    expect(html).toMatch(/vp-qrcode|svg|AMG-WebUI/)
  }, 20_000)

  it('renders MatrixCode without DOM', async () => {
    const html = await renderComponent(
      () => import('../../packages/components/industry/MatrixCode/index.vue'),
      { modelValue: 'AMG', format: 'datamatrix' }
    )
    expect(html).toMatch(/vp-matrix|svg|AMG/)
  }, 20_000)

  it('MessageBox service rejects on server (SSR-safe stub)', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)
    const { MessageBox } = await import(
      '../../packages/components/base/MessageBox/service'
    )
    await expect(MessageBox.alert('x')).rejects.toThrow(/browser environment/i)
  }, 15_000)

  it('Select composable module imports under SSR stubs', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)
    const mod = await import('../../packages/components/base/Select/useSelect')
    expect(mod).toBeTruthy()
  }, 15_000)
})
