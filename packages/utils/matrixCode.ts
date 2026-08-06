import {
  azteccode,
  azteccodecompact,
  aztecrune,
  codablockf,
  code16k,
  code49,
  codeone,
  datamatrix,
  datamatrixrectangular,
  datamatrixrectangularextension,
  dotcode,
  drawingSVG,
  gs1datamatrix,
  gs1datamatrixrectangular,
  gs1dldatamatrix,
  gs1dlqrcode,
  gs1dotcode,
  gs1qrcode,
  hanxin,
  hibcazteccode,
  hibccodablockf,
  hibcdatamatrix,
  hibcdatamatrixrectangular,
  hibcmicropdf417,
  hibcpdf417,
  hibcqrcode,
  maxicode,
  micropdf417,
  microqrcode,
  pdf417,
  pdf417compact,
  qrcode,
  rectangularmicroqrcode,
  swissqrcode,
  ultracode,
  type RenderOptions
} from '@bwip-js/generic'

/** Two-dimensional and stacked symbologies supported by MatrixCode. */
export const MATRIX_CODE_FORMATS = [
  'qrcode',
  'microqrcode',
  'rmqr',
  'gs1qrcode',
  'datamatrix',
  'datamatrix-rectangular',
  'datamatrix-rectangular-extension',
  'gs1datamatrix',
  'gs1datamatrix-rectangular',
  'gs1dldatamatrix',
  'pdf417',
  'pdf417-compact',
  'micropdf417',
  'azteccode',
  'azteccode-compact',
  'aztecrune',
  'maxicode',
  'hanxin',
  'codeone',
  'code49',
  'code16k',
  'codablockf',
  'dotcode',
  'gs1dotcode',
  'gs1dlqrcode',
  'hibcqrcode',
  'hibcdatamatrix',
  'hibcdatamatrix-rectangular',
  'hibcpdf417',
  'hibcmicropdf417',
  'hibcazteccode',
  'hibccodablockf',
  'swissqrcode',
  'ultracode'
] as const

export type MatrixCodeFormat = (typeof MATRIX_CODE_FORMATS)[number]

export type MatrixCodeErrorCorrection =
  | 'L'
  | 'M'
  | 'Q'
  | 'H'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | 'EC1'
  | 'EC2'
  | 'EC3'
  | 'EC4'
  | 'EC5'

export interface GenerateMatrixCodeSvgOptions {
  text: string
  format?: MatrixCodeFormat
  pixelSize?: number
  quietZone?: number
  errorCorrection?: MatrixCodeErrorCorrection
  version?: string | number
}

type MatrixCodeRenderOptions = RenderOptions & {
  eclevel?: MatrixCodeErrorCorrection | number
  version?: string | number
}

type MatrixCodeEncoder = typeof qrcode

const FORMAT_ENCODERS = {
  qrcode,
  microqrcode,
  rmqr: rectangularmicroqrcode,
  gs1qrcode,
  datamatrix,
  'datamatrix-rectangular': datamatrixrectangular,
  'datamatrix-rectangular-extension': datamatrixrectangularextension,
  gs1datamatrix,
  'gs1datamatrix-rectangular': gs1datamatrixrectangular,
  gs1dldatamatrix,
  pdf417,
  'pdf417-compact': pdf417compact,
  micropdf417,
  azteccode,
  'azteccode-compact': azteccodecompact,
  aztecrune,
  maxicode,
  hanxin,
  codeone,
  code49,
  code16k,
  codablockf,
  dotcode,
  gs1dotcode,
  gs1dlqrcode,
  hibcqrcode,
  hibcdatamatrix,
  'hibcdatamatrix-rectangular': hibcdatamatrixrectangular,
  hibcpdf417,
  hibcmicropdf417,
  hibcazteccode,
  hibccodablockf,
  swissqrcode,
  ultracode
} satisfies Record<MatrixCodeFormat, MatrixCodeEncoder>

const FORMAT_BCIDS: Record<MatrixCodeFormat, string> = {
  qrcode: 'qrcode',
  microqrcode: 'microqrcode',
  rmqr: 'rectangularmicroqrcode',
  gs1qrcode: 'gs1qrcode',
  datamatrix: 'datamatrix',
  'datamatrix-rectangular': 'datamatrixrectangular',
  'datamatrix-rectangular-extension': 'datamatrixrectangularextension',
  gs1datamatrix: 'gs1datamatrix',
  'gs1datamatrix-rectangular': 'gs1datamatrixrectangular',
  gs1dldatamatrix: 'gs1dldatamatrix',
  pdf417: 'pdf417',
  'pdf417-compact': 'pdf417compact',
  micropdf417: 'micropdf417',
  azteccode: 'azteccode',
  'azteccode-compact': 'azteccodecompact',
  aztecrune: 'aztecrune',
  maxicode: 'maxicode',
  hanxin: 'hanxin',
  codeone: 'codeone',
  code49: 'code49',
  code16k: 'code16k',
  codablockf: 'codablockf',
  dotcode: 'dotcode',
  gs1dotcode: 'gs1dotcode',
  gs1dlqrcode: 'gs1dlqrcode',
  hibcqrcode: 'hibcqrcode',
  hibcdatamatrix: 'hibcdatamatrix',
  'hibcdatamatrix-rectangular': 'hibcdatamatrixrectangular',
  hibcpdf417: 'hibcpdf417',
  hibcmicropdf417: 'hibcmicropdf417',
  hibcazteccode: 'hibcazteccode',
  hibccodablockf: 'hibccodablockf',
  swissqrcode: 'swissqrcode',
  ultracode: 'ultracode'
}

const FORMAT_DEFAULTS = {
  qrcode: { eclevel: 'M' },
  microqrcode: {},
  rmqr: { version: 'R17x43' },
  gs1qrcode: { eclevel: 'M' },
  datamatrix: {},
  'datamatrix-rectangular': {},
  'datamatrix-rectangular-extension': {},
  gs1datamatrix: {},
  'gs1datamatrix-rectangular': {},
  gs1dldatamatrix: {},
  pdf417: {},
  'pdf417-compact': {},
  micropdf417: {},
  azteccode: {},
  'azteccode-compact': {},
  aztecrune: {},
  maxicode: {},
  hanxin: {},
  codeone: {},
  code49: {},
  code16k: {},
  codablockf: {},
  dotcode: {},
  gs1dotcode: {},
  gs1dlqrcode: { eclevel: 'M' },
  hibcqrcode: { eclevel: 'M' },
  hibcdatamatrix: {},
  'hibcdatamatrix-rectangular': {},
  hibcpdf417: {},
  hibcmicropdf417: {},
  hibcazteccode: {},
  hibccodablockf: {},
  swissqrcode: {},
  ultracode: {}
} satisfies Record<MatrixCodeFormat, Partial<MatrixCodeRenderOptions>>

const QR_LIKE_FORMATS = new Set<MatrixCodeFormat>([
  'qrcode',
  'microqrcode',
  'rmqr',
  'gs1qrcode',
  'gs1dlqrcode',
  'hibcqrcode'
])

const PDF417_FORMATS = new Set<MatrixCodeFormat>([
  'pdf417',
  'pdf417-compact',
  'micropdf417',
  'hibcpdf417',
  'hibcmicropdf417'
])

function applyErrorCorrection(
  options: MatrixCodeRenderOptions,
  format: MatrixCodeFormat,
  value: MatrixCodeErrorCorrection | undefined
) {
  if (!value) return
  if (QR_LIKE_FORMATS.has(format) && ['L', 'M', 'Q', 'H'].includes(value)) {
    options.eclevel = value
  } else if (PDF417_FORMATS.has(format) && /^[0-8]$/.test(value)) {
    options.eclevel = value
  } else if (format === 'ultracode' && /^EC[1-5]$/.test(value)) {
    options.eclevel = value
  }
}

/** Generate a standards-based two-dimensional or stacked barcode SVG. */
export function generateMatrixCodeSvg(options: GenerateMatrixCodeSvgOptions): string {
  const format = options.format ?? 'qrcode'
  const encoder = FORMAT_ENCODERS[format]
  const renderOptions: MatrixCodeRenderOptions = {
    ...FORMAT_DEFAULTS[format],
    bcid: FORMAT_BCIDS[format],
    text: options.text,
    scale: Math.max(1, Math.round(options.pixelSize ?? 4)),
    paddingwidth: Math.max(0, Math.round(options.quietZone ?? 8)),
    paddingheight: Math.max(0, Math.round(options.quietZone ?? 8))
  }

  if (options.version) {
    renderOptions.version = options.version
  }
  applyErrorCorrection(renderOptions, format, options.errorCorrection)

  return encoder(renderOptions, drawingSVG()).replace(/#000000/g, 'currentColor')
}
