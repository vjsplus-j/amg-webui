import { DANGEROUS_PROTOCOL } from './sanitizeUrl'
import { SecurityService } from './SecurityService'
import type { FilterInputOptions } from './types'

const TAG_RE = /<\/?[a-zA-Z][^>]*>/g
const PROTOCOL_IN_TEXT = /\b(?:javascript|data|vbscript|file)\s*:/gi

/**
 * Filter free-form user input for forms (not a substitute for sanitizeHtml on rich content).
 * Returns plain text: strips tags / dangerous protocol fragments. Does **not** HTML-escape —
 * Vue text bindings already escape; use `escapeHtml` only when writing into HTML strings.
 * Opt-in via InputText/Textarea/Password `sanitizeInput` — not XSS defense by itself.
 */
export function filterDangerousInput(raw: string, options: FilterInputOptions = {}): string {
  if (!raw) return ''
  let next = raw
  const rules: string[] = []

  if (options.stripTags !== false) {
    const stripped = next.replace(TAG_RE, '')
    if (stripped !== next) {
      rules.push('strip-tags')
      next = stripped
    }
  }

  if (options.stripDangerousProtocols !== false) {
    const cleaned = next.replace(PROTOCOL_IN_TEXT, '')
    if (cleaned !== next || DANGEROUS_PROTOCOL.test(next.trim())) {
      rules.push('dangerous-protocol')
      next = cleaned
    }
  }

  if (typeof options.maxLength === 'number' && options.maxLength >= 0 && next.length > options.maxLength) {
    next = next.slice(0, options.maxLength)
    rules.push('max-length')
  }

  if (rules.length > 0) {
    SecurityService.alert({
      kind: 'input-filtered',
      message: 'Filtered dangerous characters from input',
      matchedRule: rules.join('+'),
      rawDetail: raw,
      detailMaxLength: 120
    })
  }

  return next
}
