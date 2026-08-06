/**
 * Primary → full stop scale (pure, no DOM).
 * Fail-soft: invalid color → empty object (never throws into UI).
 */

export type PrimaryScaleStop =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900

/** Lightness targets for each stop (HSL L, 0–1). 500 is the input primary. */
const STOP_LIGHTNESS: Record<PrimaryScaleStop, number> = {
  50: 0.96,
  100: 0.92,
  200: 0.84,
  300: 0.74,
  400: 0.64,
  500: 0.5,
  600: 0.42,
  700: 0.34,
  800: 0.26,
  900: 0.18
}

const STOPS: readonly PrimaryScaleStop[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

export interface RgbColor {
  r: number
  g: number
  b: number
}

export interface HslColor {
  h: number
  s: number
  l: number
}

export interface GeneratePrimaryScaleOptions {
  /**
   * When true (default), also emit semantic bridges:
   * `--ds-accent`, `--ds-accent-muted`, `--ds-focus-ring`, `--primary-*` aliases.
   */
  includeSemantic?: boolean
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

function clampByte(n: number): number {
  return Math.round(Math.min(255, Math.max(0, n)))
}

/** Parse `#rgb` / `#rrggbb` / `rgb()` / `rgba()` — returns null on failure. */
export function parseCssColor(input: string): RgbColor | null {
  const raw = input.trim().toLowerCase()
  if (!raw) return null

  if (raw.startsWith('#')) {
    const hex = raw.slice(1)
    if (/^[0-9a-f]{3}$/i.test(hex)) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16)
      }
    }
    if (/^[0-9a-f]{6}$/i.test(hex)) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
      }
    }
    return null
  }

  const rgbMatch = raw.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)/)
  if (rgbMatch) {
    return {
      r: clampByte(Number(rgbMatch[1])),
      g: clampByte(Number(rgbMatch[2])),
      b: clampByte(Number(rgbMatch[3]))
    }
  }

  return null
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) / 6
  else if (max === G) h = ((B - R) / d + 2) / 6
  else h = ((R - G) / d + 4) / 6
  return { h, s, l }
}

function hue2rgb(p: number, q: number, t: number): number {
  let T = t
  if (T < 0) T += 1
  if (T > 1) T -= 1
  if (T < 1 / 6) return p + (q - p) * 6 * T
  if (T < 1 / 2) return q
  if (T < 2 / 3) return p + (q - p) * (2 / 3 - T) * 6
  return p
}

export function hslToRgb({ h, s, l }: HslColor): RgbColor {
  if (s === 0) {
    const v = clampByte(l * 255)
    return { r: v, g: v, b: v }
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: clampByte(hue2rgb(p, q, h + 1 / 3) * 255),
    g: clampByte(hue2rgb(p, q, h) * 255),
    b: clampByte(hue2rgb(p, q, h - 1 / 3) * 255)
  }
}

function toHex({ r, g, b }: RgbColor): string {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
}

function mixWithWhite(rgb: RgbColor, amount: number): RgbColor {
  const a = clamp01(amount)
  return {
    r: clampByte(rgb.r + (255 - rgb.r) * a),
    g: clampByte(rgb.g + (255 - rgb.g) * a),
    b: clampByte(rgb.b + (255 - rgb.b) * a)
  }
}

function mixWithBlack(rgb: RgbColor, amount: number): RgbColor {
  const a = clamp01(amount)
  return {
    r: clampByte(rgb.r * (1 - a)),
    g: clampByte(rgb.g * (1 - a)),
    b: clampByte(rgb.b * (1 - a))
  }
}

/**
 * Derive `--primary-50…900` (+ optional semantic bridges) from a single primary color.
 * Uses HSL with relative lightness remapping so input stays at stop 500.
 */
export function generatePrimaryScale(
  primary: string,
  options: GeneratePrimaryScaleOptions = {}
): Record<string, string> {
  const rgb = parseCssColor(primary)
  if (!rgb) return {}

  const includeSemantic = options.includeSemantic !== false
  const hsl = rgbToHsl(rgb)
  const out: Record<string, string> = {}

  for (const stop of STOPS) {
    let next: RgbColor
    if (stop === 500) {
      next = rgb
    } else {
      const targetL = STOP_LIGHTNESS[stop]
      const delta = targetL - hsl.l
      if (delta > 0) {
        // Lighten toward white proportional to remaining headroom.
        const headroom = Math.max(0.001, 1 - hsl.l)
        next = mixWithWhite(rgb, delta / headroom)
      } else {
        const headroom = Math.max(0.001, hsl.l)
        next = mixWithBlack(rgb, -delta / headroom)
      }
      // Preserve hue/sat better via HSL rewrite at target L.
      next = hslToRgb({ h: hsl.h, s: hsl.s, l: clamp01(targetL) })
    }
    out[`--primary-${stop}`] = toHex(next)
  }

  if (includeSemantic) {
    const accent = out['--primary-500']
    const accentHover = out['--primary-600']
    const accentSoft = out['--primary-400']
    out['--ds-accent'] = accent
    out['--primary-color'] = accent
    // Solid approximations of color-mix muted / focus (SSR-safe, no color-mix required).
    out['--ds-accent-muted'] = toHex(mixWithWhite(parseCssColor(accent) ?? rgb, 0.86))
    out['--ds-focus-ring'] = toHex(mixWithWhite(parseCssColor(accent) ?? rgb, 0.72))
    out['--primary-400'] = accentSoft
    out['--primary-600'] = accentHover
  }

  return out
}
