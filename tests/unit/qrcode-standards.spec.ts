import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import QrcodeDemo from '../../example/demos/Qrcode/index.vue'
import Qrcode from '../../packages/components/core/Qrcode/index.vue'
import {
  generateQrcodeSvg,
  QRCODE_STANDARDS,
  type QrcodeStandard
} from '../../packages/utils/qrcodeMatrix'

const SAMPLES: Record<QrcodeStandard, string> = {
  gb: 'AMG-WebUI 国标二维码',
  iso: 'https://amg-webui.example/iso-iec-18004',
  jis: 'AMG-WebUI 日本 QR コード',
  aim: 'AIM ISS QR CODE'
}

beforeAll(() => {
  LocaleService.init()
})

describe('standards-based QR Code generation', () => {
  it('renders every documented QR standard profile as SVG', () => {
    expect(Object.keys(SAMPLES)).toEqual([...QRCODE_STANDARDS])

    for (const standard of QRCODE_STANDARDS) {
      const svg = generateQrcodeSvg({ standard, text: SAMPLES[standard] })
      expect(svg, standard).toContain('<svg')
      expect(svg, standard).toContain('viewBox=')
      expect(svg, standard).toContain('currentColor')
    }
  })

  it('rejects empty data at the encoding boundary', () => {
    expect(() => generateQrcodeSvg({ standard: 'gb', text: '' })).toThrow()
  })

  it('mounts the complete Qrcode demo with every profile visible', async () => {
    const wrapper = mount(QrcodeDemo)
    await nextTick()

    expect(wrapper.findAll('.vp-qrcode__matrix')).toHaveLength(QRCODE_STANDARDS.length + 1)
    expect(wrapper.findAll('.vp-qrcode__error')).toHaveLength(0)
  })

  it('does not crash preview fallback for invalid non-string values', async () => {
    const wrapper = mount(Qrcode as any, {
      props: { value: [{ id: 1 }] },
      global: { config: { warnHandler: () => undefined } }
    })
    await nextTick()

    expect(wrapper.find('.vp-qrcode__muted').exists()).toBe(true)
  })
})
