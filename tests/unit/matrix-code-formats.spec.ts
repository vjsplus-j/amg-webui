import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import MatrixCodeDemo from '../../example/demos/MatrixCode/index.vue'
import MatrixCode from '../../packages/components/base/MatrixCode/index.vue'
import {
  generateMatrixCodeSvg,
  MATRIX_CODE_FORMATS,
  type MatrixCodeFormat
} from '../../packages/utils/matrixCode'

const GS1_VALUE = '(01)09501101530003(17)261231(10)AMG01'
const GS1_DIGITAL_LINK = 'https://id.gs1.org/01/09501101530003/10/AMG01'
const HIBC_VALUE = 'A123BJC5D6E71'
const SWISS_QR_VALUE = [
  'SPC',
  '0200',
  '1',
  'CH4431999123000889012',
  'S',
  'AMG WebUI',
  '',
  'Teststrasse',
  '1',
  '8000',
  'Zurich',
  'CH',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'CHF',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'NON',
  '',
  ''
].join('\n')

const SAMPLES: Record<MatrixCodeFormat, string> = {
  qrcode: 'AMG-WebUI QR Code',
  microqrcode: '12345',
  rmqr: 'AMG-WEBUI',
  gs1qrcode: GS1_VALUE,
  gs1dlqrcode: GS1_DIGITAL_LINK,
  hibcqrcode: HIBC_VALUE,
  swissqrcode: SWISS_QR_VALUE,
  datamatrix: 'AMG-WebUI Data Matrix',
  'datamatrix-rectangular': 'AMG-WEBUI',
  'datamatrix-rectangular-extension': 'DMRE-1234567890',
  gs1datamatrix: GS1_VALUE,
  'gs1datamatrix-rectangular': GS1_VALUE,
  gs1dldatamatrix: GS1_DIGITAL_LINK,
  pdf417: 'AMG-WebUI PDF417 payload',
  'pdf417-compact': 'AMG-WebUI compact PDF417',
  micropdf417: 'AMG-WEBUI',
  hibcpdf417: HIBC_VALUE,
  hibcmicropdf417: HIBC_VALUE,
  azteccode: 'AMG-WebUI Aztec',
  'azteccode-compact': 'AMG',
  aztecrune: '123',
  hibcazteccode: HIBC_VALUE,
  maxicode: 'AMG-WebUI MaxiCode',
  hanxin: 'AMG-WebUI 汉信码',
  codeone: 'CODEONE-DEMO',
  code49: 'AMGWEBUI2026',
  code16k: 'AMGWEBUI2026',
  codablockf: 'CODABLOCKF-123456',
  dotcode: 'DOTCODE-123456',
  gs1dotcode: GS1_VALUE,
  hibcdatamatrix: HIBC_VALUE,
  'hibcdatamatrix-rectangular': HIBC_VALUE,
  hibccodablockf: HIBC_VALUE,
  ultracode: 'AMG-WebUI Ultracode'
}

beforeAll(() => {
  LocaleService.init()
})

describe('standards-based matrix and stacked barcode generation', () => {
  it('renders every documented two-dimensional format as SVG', () => {
    expect(Object.keys(SAMPLES).sort()).toEqual([...MATRIX_CODE_FORMATS].sort())

    for (const format of MATRIX_CODE_FORMATS) {
      const svg = generateMatrixCodeSvg({ format, text: SAMPLES[format] })
      expect(svg, format).toContain('<svg')
      expect(svg, format).toContain('viewBox=')
    }
  })

  it('uses semantic currentColor and rejects empty data', () => {
    const svg = generateMatrixCodeSvg({ format: 'datamatrix', text: SAMPLES.datamatrix })
    expect(svg).toContain('currentColor')
    expect(() => generateMatrixCodeSvg({ format: 'qrcode', text: '' })).toThrow()
  })

  it('mounts the complete MatrixCode demo with every format visible', async () => {
    const wrapper = mount(MatrixCodeDemo)
    await nextTick()

    expect(wrapper.findAll('.vp-matrix-code__symbol')).toHaveLength(MATRIX_CODE_FORMATS.length + 1)
    expect(wrapper.findAll('.vp-matrix-code__error')).toHaveLength(0)
  })

  it('does not crash preview fallback for invalid non-string values', async () => {
    const wrapper = mount(MatrixCode as any, {
      props: { value: [{ id: 1 }] },
      global: { config: { warnHandler: () => undefined } }
    })
    await nextTick()

    expect(wrapper.find('.vp-matrix-code__muted').exists()).toBe(true)
  })
})
