import type { ThemeSnapshot } from './types'
import { serializeThemeAttrs, normalizeCssVarName } from './attrs'
import { iconStrokeWidth } from './registry'

export interface SerializeThemeStyleOptions {
  /** CSS selector for the rule. @default ':root' */
  selector?: string
  /** Include `data-*` axes as CSS custom properties (`--amg-data-design`, …). @default false */
  includeAttrVars?: boolean
}

function escapeCssIdent(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`)
}

function escapeCssString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/**
 * Serialize snapshot custom tokens (+ optional attr mirrors) to a CSS rule text
 * for SSR `<style>` injection before hydration.
 */
export function serializeThemeStyle(
  state: ThemeSnapshot,
  options: SerializeThemeStyleOptions = {}
): string {
  const selector = options.selector ?? ':root'
  const decls: string[] = []

  decls.push(`--icon-stroke-width:${iconStrokeWidth(state.iconStyle)}`)

  if (options.includeAttrVars) {
    const attrs = serializeThemeAttrs(state)
    for (const [name, value] of Object.entries(attrs)) {
      const prop = `--amg-${name.replace(/^data-/, 'data-')}`
      decls.push(`${prop}:"${escapeCssString(value)}"`)
    }
  }

  for (const [key, value] of Object.entries(state.customTokens)) {
    const prop = normalizeCssVarName(key)
    // Values are expected to be safe token strings (hex / var() / numbers).
    decls.push(`${prop}:${value}`)
  }

  if (decls.length === 0) return ''
  return `${selector}{${decls.join(';')}}`
}

/** Full `<style id="…">` tag for SSR HTML templates. */
export function themeStyleTag(
  state: ThemeSnapshot,
  options: SerializeThemeStyleOptions & { id?: string } = {}
): string {
  const id = options.id ?? 'amg-theme-ssr'
  const css = serializeThemeStyle(state, options)
  if (!css) return `<style id="${escapeCssIdent(id)}"></style>`
  return `<style id="${escapeCssIdent(id)}">${css}</style>`
}
