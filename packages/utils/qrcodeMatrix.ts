import {
  drawingSVG,
  qrcode,
  type RenderOptions
} from '@bwip-js/generic'

export const QRCODE_STANDARDS = ['gb', 'iso', 'jis', 'aim'] as const

export type QrcodeStandard = (typeof QRCODE_STANDARDS)[number]

export const QRCODE_ERROR_CORRECTION_LEVELS = ['L', 'M', 'Q', 'H'] as const

export type QrcodeErrorCorrectionLevel = (typeof QRCODE_ERROR_CORRECTION_LEVELS)[number]

export const QRCODE_STANDARD_PROFILES = {
  gb: { label: 'GB/T 18284', errorCorrection: 'M' },
  iso: { label: 'ISO/IEC 18004', errorCorrection: 'Q' },
  jis: { label: 'JIS X 0510', errorCorrection: 'Q' },
  aim: { label: 'AIM ISS QR Code', errorCorrection: 'H' }
} satisfies Record<QrcodeStandard, { label: string; errorCorrection: QrcodeErrorCorrectionLevel }>

export interface GenerateQrcodeSvgOptions {
  text: string
  standard?: QrcodeStandard
  errorCorrection?: QrcodeErrorCorrectionLevel
  pixelSize?: number
  quietZone?: number
  version?: number
}

type QrcodeRenderOptions = RenderOptions & {
  eclevel: QrcodeErrorCorrectionLevel
  version?: number
}

function resolveStandard(standard?: QrcodeStandard): QrcodeStandard {
  return standard && QRCODE_STANDARDS.includes(standard) ? standard : 'iso'
}

function resolveErrorCorrection(
  standard: QrcodeStandard,
  errorCorrection?: QrcodeErrorCorrectionLevel
): QrcodeErrorCorrectionLevel {
  return errorCorrection && QRCODE_ERROR_CORRECTION_LEVELS.includes(errorCorrection)
    ? errorCorrection
    : QRCODE_STANDARD_PROFILES[standard].errorCorrection
}

/** Generate a standards-based QR Code SVG. */
export function generateQrcodeSvg(options: GenerateQrcodeSvgOptions): string {
  const standard = resolveStandard(options.standard)
  const renderOptions: QrcodeRenderOptions = {
    bcid: 'qrcode',
    text: options.text,
    scale: Math.max(1, Math.round(options.pixelSize ?? 4)),
    paddingwidth: Math.max(0, Math.round(options.quietZone ?? 8)),
    paddingheight: Math.max(0, Math.round(options.quietZone ?? 8)),
    eclevel: resolveErrorCorrection(standard, options.errorCorrection)
  }

  if (options.version) {
    renderOptions.version = Math.max(1, Math.min(40, Math.round(options.version)))
  }

  return qrcode(renderOptions, drawingSVG()).replace(/#000000/g, 'currentColor')
}

/** @deprecated Use generateQrcodeSvg() for a standards-compliant symbol. */
export function buildQrcodeMatrix(text: string, size = 21): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

  const setFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const border = x === 0 || y === 0 || x === 6 || y === 6
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4
        matrix[oy + y][ox + x] = border || core
      }
    }
  }

  setFinder(0, 0)
  setFinder(size - 7, 0)
  setFinder(0, size - 7)

  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) continue
      const inQuiet =
        (x < 8 && y < 8) ||
        (x >= size - 8 && y < 8) ||
        (x < 8 && y >= size - 8)
      if (inQuiet) continue
      const seed = (hash + x * 17 + y * 23 + text.length * 13) >>> 0
      matrix[y][x] = (seed & 3) !== 0
    }
  }

  return matrix
}

export function matrixToSvg(
  matrix: boolean[][],
  pixelSize = 4,
  fg = 'currentColor',
  bg = 'transparent'
): string {
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  const w = cols * pixelSize
  const h = rows * pixelSize
  let rects = ''
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (matrix[y][x]) {
        rects += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${fg}"/>`
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${bg}"/>${rects}</svg>`
}
