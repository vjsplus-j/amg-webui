import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import BarcodeDemo from '../../example/demos/Barcode/index.vue'
import {
  BARCODE_FORMATS,
  generateBarcodeSvg,
  type BarcodeFormat
} from '../../packages/utils/barcodePattern'

const SAMPLES: Record<BarcodeFormat, string> = {
  ean13: '6901234567892',
  ean8: '69012341',
  upca: '012345678905',
  upce: '01234565',
  itf14: '18931234567894',
  'gs1-128': '(01)06901234567892(17)261231(10)AMG01',
  isbn: '978-7-115-42802-8',
  issn: '1000-0097',
  'gs1-databar-omni': '(01)09501101530003',
  'gs1-databar-expanded': '(01)09501101530003(17)261231(10)AMG01',
  code128: 'AMG-WEBUI-2026',
  code39: 'AMG-2026',
  code93: 'AMG-2026',
  interleaved2of5: '1234567890',
  codabar: 'A123456A',
  msi: '1234567',
  pharmacode: '12345'
}

beforeAll(() => {
  LocaleService.init()
})

describe('standards-based barcode generation', () => {
  it('renders every documented linear symbology as SVG', () => {
    expect(Object.keys(SAMPLES)).toEqual([...BARCODE_FORMATS])

    for (const format of BARCODE_FORMATS) {
      const svg = generateBarcodeSvg({ format, text: SAMPLES[format] })
      expect(svg, format).toContain('<svg')
      expect(svg, format).toContain('viewBox=')
    }
  })

  it('uses semantic currentColor and rejects invalid retail data', () => {
    const svg = generateBarcodeSvg({ format: 'ean13', text: SAMPLES.ean13 })
    expect(svg).toContain('currentColor')
    expect(() => generateBarcodeSvg({ format: 'ean13', text: '123' })).toThrow()
  })

  it('mounts the complete Barcode demo with every format visible', async () => {
    const wrapper = mount(BarcodeDemo)
    await nextTick()

    expect(wrapper.findAll('.vp-barcode__bars')).toHaveLength(BARCODE_FORMATS.length + 1)
    expect(wrapper.findAll('.vp-barcode__error')).toHaveLength(0)
  })
})
