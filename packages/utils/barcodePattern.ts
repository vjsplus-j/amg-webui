import {
  code128,
  code39,
  code93,
  databarexpanded,
  databaromni,
  drawingSVG,
  ean13,
  ean8,
  gs1_128,
  interleaved2of5,
  isbn,
  issn,
  itf14,
  msi,
  pharmacode,
  rationalizedCodabar,
  upca,
  upce,
  type RenderOptions
} from '@bwip-js/generic'

/** Linear barcode symbologies supported by the Barcode component. */
export const BARCODE_FORMATS = [
  'ean13',
  'ean8',
  'upca',
  'upce',
  'itf14',
  'gs1-128',
  'isbn',
  'issn',
  'gs1-databar-omni',
  'gs1-databar-expanded',
  'code128',
  'code39',
  'code93',
  'interleaved2of5',
  'codabar',
  'msi',
  'pharmacode'
] as const

export type BarcodeFormat = (typeof BARCODE_FORMATS)[number]

export interface GenerateBarcodeSvgOptions {
  text: string
  format?: BarcodeFormat
  barWidth?: number
  height?: number
  showLabel?: boolean
  quietZone?: number
}

const FORMAT_ENCODERS = {
  ean13,
  ean8,
  upca,
  upce,
  itf14,
  'gs1-128': gs1_128,
  isbn,
  issn,
  'gs1-databar-omni': databaromni,
  'gs1-databar-expanded': databarexpanded,
  code128,
  code39,
  code93,
  interleaved2of5,
  codabar: rationalizedCodabar,
  msi,
  pharmacode
} satisfies Record<BarcodeFormat, typeof code128>

const FORMAT_BCIDS: Record<BarcodeFormat, string> = {
  ean13: 'ean13',
  ean8: 'ean8',
  upca: 'upca',
  upce: 'upce',
  itf14: 'itf14',
  'gs1-128': 'gs1-128',
  isbn: 'isbn',
  issn: 'issn',
  'gs1-databar-omni': 'databaromni',
  'gs1-databar-expanded': 'databarexpanded',
  code128: 'code128',
  code39: 'code39',
  code93: 'code93',
  interleaved2of5: 'interleaved2of5',
  codabar: 'rationalizedCodabar',
  msi: 'msi',
  pharmacode: 'pharmacode'
}

/** Generate a standards-based, scalable SVG using only the selected linear encoders. */
export function generateBarcodeSvg(options: GenerateBarcodeSvgOptions): string {
  const format = options.format ?? 'code128'
  const encoder = FORMAT_ENCODERS[format]
  const renderOptions: RenderOptions = {
    bcid: FORMAT_BCIDS[format],
    text: options.text,
    scaleX: Math.max(1, Math.round(options.barWidth ?? 2)),
    scaleY: 1,
    height: Math.max(1, (options.height ?? 48) / 2.835),
    includetext: options.showLabel ?? true,
    textxalign: 'center',
    guardwhitespace: true,
    paddingwidth: Math.max(0, Math.round(options.quietZone ?? 10))
  }
  return encoder(renderOptions, drawingSVG()).replace(/#000000/g, 'currentColor')
}

/** @deprecated Use generateBarcodeSvg() for a standards-compliant symbol. */
export function buildBarcodeBars(text: string): number[] {
  const bars: number[] = [2, 1, 1]
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    bars.push((code & 1) === 1 ? 3 : 1)
    bars.push((code & 2) === 2 ? 2 : 1)
    bars.push((code & 4) === 4 ? 3 : 1)
    bars.push(1)
  }
  bars.push(2, 1, 3)
  return bars
}

export function barsToSvg(
  bars: number[],
  barWidth = 2,
  height = 48,
  fg = 'currentColor'
): string {
  let x = 0
  let rects = ''
  bars.forEach((w, i) => {
    if (i % 2 === 0) {
      rects += `<rect x="${x}" y="0" width="${w * barWidth}" height="${height}" fill="${fg}"/>`
    }
    x += w * barWidth
  })
  const totalW = x
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${height}" width="${totalW}" height="${height}">${rects}</svg>`
}
