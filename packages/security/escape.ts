const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0'
}

/** Escape text for safe HTML text / attribute contexts (SSR-safe, no DOM required). */
export function escapeHtml(text: string): string {
  if (!text) return ''
  return text.replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch] ?? ch)
}

/**
 * Decode a single level of common HTML entities without DOM parsing.
 * Never assigns untrusted strings to `innerHTML` (avoids XSS footgun).
 */
export function unescapeHtml(text: string): string {
  if (!text) return ''
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (full, body: string) => {
    if (body[0] === '#') {
      const hex = body[1] === 'x' || body[1] === 'X'
      const code = hex ? Number.parseInt(body.slice(2), 16) : Number.parseInt(body.slice(1), 10)
      if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return full
      try {
        return String.fromCodePoint(code)
      } catch {
        return full
      }
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? full
  })
}
