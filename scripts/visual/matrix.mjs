/**
 * Visual theme matrix SSOT — 8 official themes × scheme × direction × core components.
 * Consumed by tests/e2e/visual-theme-matrix.spec.ts and scripts/visual/run-matrix.mjs.
 */

/** @typedef {'mercedes'|'linear'|'porsche'|'lamborghini'|'ferrari'|'apple'|'wechat'|'alipay'} DesignBrand */
/** @typedef {'light'|'dark'} ColorScheme */
/** @typedef {'ltr'|'rtl'} TextDirection */
/** @typedef {'button'|'input-text'|'select'|'data-table'|'dialog'} MatrixComponent */

export const DESIGN_BRANDS = [
  'mercedes',
  'linear',
  'porsche',
  'lamborghini',
  'ferrari',
  'apple',
  'wechat',
  'alipay'
]

/** Themes that expose light/dark via data-scheme. Others use design-default appearance only. */
export const SCHEME_SUPPORTED = new Set(['linear', 'apple', 'wechat', 'alipay'])

export const MATRIX_COMPONENTS = [
  'button',
  'input-text',
  'select',
  'data-table',
  'dialog'
]

export const MATRIX_DIRECTIONS = ['ltr', 'rtl']

export const MATRIX_SCHEMES = ['light', 'dark']

/**
 * Pixel diff gate — do not lower to mask regressions.
 * @type {{ maxDiffPixelRatio: number; threshold: number }}
 */
export const SNAPSHOT_COMPARE = {
  maxDiffPixelRatio: 0.01,
  threshold: 0.15
}

/**
 * @returns {Array<{ design: DesignBrand; scheme: ColorScheme; dir: TextDirection; component: MatrixComponent }>}
 */
export function buildVisualMatrixCases() {
  /** @type {ReturnType<typeof buildVisualMatrixCases>} */
  const cases = []
  for (const design of DESIGN_BRANDS) {
    const schemes = SCHEME_SUPPORTED.has(design) ? MATRIX_SCHEMES : ['dark']
    for (const scheme of schemes) {
      for (const dir of MATRIX_DIRECTIONS) {
        for (const component of MATRIX_COMPONENTS) {
          cases.push({ design, scheme, dir, component })
        }
      }
    }
  }
  return cases
}

export function snapshotName({ design, scheme, dir, component }) {
  return `${design}--${scheme}--${dir}--${component}.png`
}
