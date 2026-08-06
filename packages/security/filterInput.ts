import { DANGEROUS_PROTOCOL } from './sanitizeUrl'
import { SecurityService } from './SecurityService'
import type { FilterInputOptions } from './types'

const TAG_RE = /<\/?[a-zA-Z][^>]*>/g
const PROTOCOL_IN_TEXT = /\b(?:javascript|data|vbscript|file)\s*:/gi

/**
 * Filter free-form user input for forms (not a substitute for sanitizeHtml on rich content).
 * Returns plain text: strips tags / dangerous protocol fragments. Does **not** HTML-escape —
 * Vue text bindings already escape; use `escapeHtml` only when writing into HTML strings.
 */
export function filterDangerousInput(raw: string, options: FilterInputOptions = {}): string {
  if (!raw) return ''
  let next = raw
  let changed = false

  if (options.stripTags !== false) {
    const stripped = next.replace(TAG_RE, '')
    if (stripped !== next) {
      changed = true
      next = stripped
    }
  }

  if (options.stripDangerousProtocols !== false) {
    const cleaned = next.replace(PROTOCOL_IN_TEXT, '')
    if (cleaned !== next || DANGEROUS_PROTOCOL.test(next.trim())) {
      changed = true
      next = cleaned
    }
  }

  if (typeof options.maxLength === 'number' && options.maxLength >= 0 && next.length > options.maxLength) {
    next = next.slice(0, options.maxLength)
    changed = true
  }

  if (changed) {
    SecurityService.alert({
      kind: 'input-filtered',
      message: 'Filtered dangerous characters from input',
      detail: raw.slice(0, 120)
    })
  }

  return next
}
