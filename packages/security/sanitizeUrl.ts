import type { SanitizeUrlOptions } from './types'
import { SecurityService } from './SecurityService'

/** Default dangerous schemes — never navigable from Link / RichText / forms. */
export const DANGEROUS_PROTOCOL = /^(javascript|data|vbscript|file):/i

const DEFAULT_SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])

/** Strip C0 controls / whitespace used to smuggle schemes (mXSS / browser quirks). */
function normalizeHrefCandidate(href: string): string {
  return href.replace(/[\u0000-\u001F\u007F\s]+/g, '').trim()
}

/**
 * Returns true when `href` is safe to put on an `<a href>`.
 * Empty / whitespace-only → false. Relative paths (no scheme) → true by default.
 */
export function isSafeHref(
  href: string | undefined | null,
  options: SanitizeUrlOptions = {}
): boolean {
  if (href == null) return false
  const trimmed = href.trim()
  if (!trimmed) return false

  const collapsed = normalizeHrefCandidate(trimmed)
  if (DANGEROUS_PROTOCOL.test(trimmed) || DANGEROUS_PROTOCOL.test(collapsed)) return false

  const allowRelative = options.allowRelative !== false
  const colon = collapsed.indexOf(':')
  const slash = collapsed.indexOf('/')
  const hasScheme = colon > 0 && (slash < 0 || colon < slash)

  if (!hasScheme) return allowRelative

  const scheme = collapsed.slice(0, colon + 1).toLowerCase()
  const allowed = new Set(DEFAULT_SAFE_PROTOCOLS)
  for (const p of options.allowedProtocols ?? []) {
    const normalized = p.endsWith(':') ? p.toLowerCase() : `${p.toLowerCase()}:`
    allowed.add(normalized)
  }
  return allowed.has(scheme)
}

/**
 * Returns the href when safe, otherwise `undefined`.
 * Optionally records a security alert when blocked.
 */
export function sanitizeUrl(
  href: string | undefined | null,
  options: SanitizeUrlOptions = {}
): string | undefined {
  if (href == null) return undefined
  const trimmed = href.trim()
  if (!trimmed) return undefined
  if (isSafeHref(trimmed, options)) return trimmed
  SecurityService.alert({
    kind: 'url-blocked',
    message: 'Blocked unsafe URL protocol',
    detail: trimmed.slice(0, 120)
  })
  return undefined
}

/** Emit a security alert when an href was rejected (for Link/Button silent blocks). */
export function reportBlockedHref(href: string | undefined | null): void {
  if (href == null || !href.trim()) return
  if (isSafeHref(href)) return
  SecurityService.alert({
    kind: 'url-blocked',
    message: 'Blocked unsafe URL protocol',
    detail: href.trim().slice(0, 120)
  })
}
