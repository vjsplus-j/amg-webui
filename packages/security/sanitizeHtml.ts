import { getDocument } from '@amg-webui/utils/env'
import { escapeHtml } from './escape'
import { isSafeHref } from './sanitizeUrl'
import { SecurityService } from './SecurityService'
import type { SanitizeHtmlOptions } from './types'

/** Default whitelist for RichText / Md preview — no script, iframe, object, form. */
export const DEFAULT_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'a',
  'span',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'blockquote',
  'code',
  'pre',
  'hr',
  'sub',
  'sup'
] as const

export const DEFAULT_ALLOWED_ATTRIBUTES: Readonly<Record<string, readonly string[]>> = {
  a: ['href', 'title', 'target', 'rel'],
  '*': []
}

const URI_ATTRS = new Set(['href', 'src', 'xlink:href', 'action'])

function normalizeAttrMap(
  map: Readonly<Record<string, readonly string[]>> | undefined
): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>()
  const source = map ?? DEFAULT_ALLOWED_ATTRIBUTES
  for (const [tag, attrs] of Object.entries(source)) {
    out.set(tag.toLowerCase(), new Set(attrs.map((a) => a.toLowerCase())))
  }
  return out
}

function isAttrAllowed(
  tag: string,
  attr: string,
  attrMap: Map<string, Set<string>>
): boolean {
  const specific = attrMap.get(tag)
  if (specific?.has(attr)) return true
  const star = attrMap.get('*')
  return Boolean(star?.has(attr))
}

function sanitizeAttributeValue(
  name: string,
  value: string,
  options: SanitizeHtmlOptions
): string | null {
  // Collapse whitespace / tabs that browsers may ignore in protocol detection
  const trimmed = value.replace(/[\u0000-\u001F\u007F\s]+/g, '').trim()
  const display = value.trim()
  if (URI_ATTRS.has(name)) {
    // Prefer display form for relative paths; use collapsed form for protocol checks
    const candidate = display
    if (
      !isSafeHref(candidate, {
        allowRelative: options.allowRelativeUrls !== false,
        allowedProtocols: options.allowedProtocols
      }) ||
      !isSafeHref(trimmed || candidate, {
        allowRelative: options.allowRelativeUrls !== false,
        allowedProtocols: options.allowedProtocols
      })
    ) {
      return null
    }
    return candidate
  }
  // Block inline event handlers / javascript in any attr
  if (/^on/i.test(name)) return null
  if (/^\s*javascript:/i.test(display) || /javascript:/i.test(trimmed)) return null
  // Never allow style= in default policy (CSS expression / url() XSS)
  if (name === 'style') return null
  return display
}

function walkSanitize(
  source: Node,
  parent: Element,
  allowedTags: Set<string>,
  attrMap: Map<string, Set<string>>,
  options: SanitizeHtmlOptions,
  stats: { stripped: number }
): void {
  const doc = parent.ownerDocument
  const children = Array.from(source.childNodes)

  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) {
      parent.appendChild(doc.createTextNode(child.textContent ?? ''))
      continue
    }
    if (child.nodeType === Node.COMMENT_NODE) {
      stats.stripped += 1
      continue
    }
    if (child.nodeType !== Node.ELEMENT_NODE) {
      stats.stripped += 1
      continue
    }

    const el = child as Element
    const tag = el.tagName.toLowerCase()

    if (tag === 'script' || tag === 'style' || tag === 'iframe' || tag === 'object' || tag === 'embed') {
      stats.stripped += 1
      continue
    }

    if (!allowedTags.has(tag)) {
      stats.stripped += 1
      if (options.keepUnknownText) {
        walkSanitize(el, parent, allowedTags, attrMap, options, stats)
      }
      continue
    }

    const clone = doc.createElement(tag)
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      if (!isAttrAllowed(tag, name, attrMap)) {
        stats.stripped += 1
        continue
      }
      const safe = sanitizeAttributeValue(name, attr.value, options)
      if (safe == null) {
        stats.stripped += 1
        continue
      }
      clone.setAttribute(name, safe)
    }

    if (tag === 'a') {
      const href = clone.getAttribute('href')
      if (!href) {
        // drop empty / blocked anchors but keep text
        walkSanitize(el, parent, allowedTags, attrMap, options, stats)
        stats.stripped += 1
        continue
      }
      const target = clone.getAttribute('target')
      if (target === '_blank') {
        const rel = clone.getAttribute('rel') || ''
        const parts = new Set(rel.split(/\s+/).filter(Boolean))
        parts.add('noopener')
        parts.add('noreferrer')
        clone.setAttribute('rel', [...parts].join(' '))
      }
    }

    walkSanitize(el, clone, allowedTags, attrMap, options, stats)
    parent.appendChild(clone)
  }
}

/**
 * Whitelist HTML sanitizer (DOM-based). No eval / no third-party dependency.
 * When DOM is unavailable (SSR), returns escaped plain text.
 */
export function sanitizeHtml(dirty: string, options: SanitizeHtmlOptions = {}): string {
  if (!dirty) return ''
  const doc = getDocument()
  if (!doc) return escapeHtml(dirty)

  const allowedTags = new Set(
    (options.allowedTags ?? DEFAULT_ALLOWED_TAGS).map((t) => t.toLowerCase())
  )
  const attrMap = normalizeAttrMap(options.allowedAttributes)
  const stats = { stripped: 0 }

  const template = doc.createElement('template')
  template.innerHTML = dirty
  const out = doc.createElement('div')
  walkSanitize(template.content, out, allowedTags, attrMap, options, stats)

  if (stats.stripped > 0) {
    SecurityService.alert({
      kind: 'html-stripped',
      message: `Sanitizer removed ${stats.stripped} unsafe node(s) or attribute(s)`,
      matchedRule: 'html-stripped',
      rawDetail: dirty,
      detailMaxLength: 160
    })
  }

  return out.innerHTML
}

/** Convenience: escape when `asHtml` is false, sanitize when true. */
export function safeHtml(value: string, asHtml: boolean, options?: SanitizeHtmlOptions): string {
  return asHtml ? sanitizeHtml(value, options) : escapeHtml(value)
}
