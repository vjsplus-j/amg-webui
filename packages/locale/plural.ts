/**
 * ICU-lite plural segments:
 *   {count, plural, one {# …} few {# …} many {# …} other {# …}}
 *
 * Category selection uses CLDR rules via Intl.PluralRules (cached per locale).
 * `#` inside an arm is replaced by the raw value; the selected text still
 * goes through the normal {param} interpolation afterwards, so arms may
 * reference other params freely.
 *
 * ICU requires `other`; it is also the fallback when the value is missing.
 */

export type PluralParams = Record<string, string | number> | undefined

const rulesCache = new Map<string, Intl.PluralRules>()

function getRules(locale: string): Intl.PluralRules {
  let rules = rulesCache.get(locale)
  if (!rules) {
    try {
      rules = new Intl.PluralRules(locale)
    } catch {
      rules = new Intl.PluralRules('en')
    }
    rulesCache.set(locale, rules)
  }
  return rules
}

const MARKER = ', plural,'

/** Parse `one {text} few {text} =0 {text} …` arms from a plural body */
function parseArms(body: string): Record<string, string> {
  const arms: Record<string, string> = {}
  let i = 0
  while (i < body.length) {
    while (i < body.length && /\s/.test(body[i]!)) i++
    let key = ''
    while (i < body.length && !/[\s{}]/.test(body[i]!)) key += body[i++]
    while (i < body.length && /\s/.test(body[i]!)) i++
    if (body[i] !== '{') break
    let depth = 0
    let text = ''
    for (; i < body.length; i++) {
      const ch = body[i]!
      if (ch === '{') {
        depth++
        if (depth > 1) text += ch
        continue
      }
      if (ch === '}') {
        depth--
        if (depth === 0) {
          i++
          break
        }
        text += ch
        continue
      }
      text += ch
    }
    if (key) arms[key] = text
  }
  return arms
}

/**
 * Resolve every `{name, plural, …}` segment in `template`.
 * Exact `=N` arms win over CLDR categories; missing/NaN values and missing
 * categories fall back to the `other` arm.
 */
export function resolvePlurals(
  template: string,
  params: PluralParams,
  locale: string
): string {
  let out = template
  // Each iteration rewrites exactly one segment; guard against pathological input.
  for (let guard = 0; guard < 16; guard++) {
    const markerIdx = out.indexOf(MARKER)
    if (markerIdx === -1) break
    const start = out.lastIndexOf('{', markerIdx)
    if (start === -1) break
    const name = out.slice(start + 1, markerIdx).trim()
    if (!name) break

    let depth = 0
    let end = -1
    for (let i = start; i < out.length; i++) {
      if (out[i] === '{') depth++
      else if (out[i] === '}') {
        depth--
        if (depth === 0) {
          end = i
          break
        }
      }
    }
    if (end === -1) break

    const arms = parseArms(out.slice(markerIdx + MARKER.length, end))
    const raw = params?.[name]
    const n = typeof raw === 'number' ? raw : Number(raw)
    let selected: string | undefined
    if (raw !== undefined && raw !== '' && !Number.isNaN(n)) {
      selected = arms[`=${n}`] ?? arms[getRules(locale).select(n)]
    }
    selected ??= arms.other ?? ''
    const replacement = selected.replace(/#/g, String(raw ?? ''))
    out = out.slice(0, start) + replacement + out.slice(end + 1)
  }
  return out
}
