import { sanitizeHtml, sanitizeUrl, SecurityService } from '@amg-webui/security'

export type FormatCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'unorderedList'
  | 'orderedList'
  | 'heading'
  | 'blockquote'
  | 'code'
  | 'horizontalRule'

const INLINE_TAG: Partial<Record<FormatCommand, string>> = {
  bold: 'strong',
  italic: 'em',
  underline: 'u',
  code: 'code'
}

function selectionInside(editor: HTMLElement): Range | null {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0) return null
  const range = sel.getRangeAt(0)
  if (!editor.contains(range.commonAncestorContainer)) return null
  return range
}

function placeCaretAfter(node: Node): void {
  const sel = window.getSelection()
  if (!sel) return
  const range = document.createRange()
  range.setStartAfter(node)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
}

function wrapRange(range: Range, tagName: string): void {
  const el = document.createElement(tagName)
  if (range.collapsed) {
    el.appendChild(document.createTextNode('\u200b'))
    range.insertNode(el)
    const sel = window.getSelection()
    if (sel) {
      const inner = document.createRange()
      inner.selectNodeContents(el)
      inner.collapse(false)
      sel.removeAllRanges()
      sel.addRange(inner)
    }
    return
  }
  try {
    range.surroundContents(el)
  } catch {
    const fragment = range.extractContents()
    el.appendChild(fragment)
    range.insertNode(el)
  }
  placeCaretAfter(el)
}

function insertList(range: Range, ordered: boolean): void {
  const list = document.createElement(ordered ? 'ol' : 'ul')
  const li = document.createElement('li')
  if (range.collapsed) {
    li.appendChild(document.createTextNode('\u200b'))
    list.appendChild(li)
    range.insertNode(list)
  } else {
    const fragment = range.extractContents()
    li.appendChild(fragment)
    list.appendChild(li)
    range.insertNode(list)
  }
  placeCaretAfter(li.lastChild ?? li)
}

const ACTIVE_TAGS: Partial<Record<FormatCommand, readonly string[]>> = {
  bold: ['STRONG', 'B'],
  italic: ['EM', 'I'],
  underline: ['U'],
  code: ['CODE'],
  heading: ['H1', 'H2', 'H3', 'H4'],
  blockquote: ['BLOCKQUOTE'],
  unorderedList: ['UL'],
  orderedList: ['OL']
}

/** Whether the caret/selection sits inside a format wrapper. */
export function isFormatActive(editor: HTMLElement, command: FormatCommand): boolean {
  const range = selectionInside(editor)
  if (!range) return false
  const tags = ACTIVE_TAGS[command]
  if (!tags) return false
  let node: Node | null = range.commonAncestorContainer
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement
  while (node && node !== editor) {
    if (node instanceof HTMLElement && tags.includes(node.tagName)) return true
    node = node.parentElement
  }
  return false
}

/** Apply formatting via Selection API — no document.execCommand. */
export function applyFormat(editor: HTMLElement, command: FormatCommand): void {
  editor.focus()
  const range = selectionInside(editor)
  if (!range) return

  if (command === 'unorderedList') {
    insertList(range, false)
    return
  }
  if (command === 'orderedList') {
    insertList(range, true)
    return
  }
  if (command === 'horizontalRule') {
    const hr = document.createElement('hr')
    range.insertNode(hr)
    placeCaretAfter(hr)
    return
  }
  if (command === 'heading') {
    wrapRange(range, 'h3')
    return
  }
  if (command === 'blockquote') {
    wrapRange(range, 'blockquote')
    return
  }

  const tag = INLINE_TAG[command]
  if (tag) wrapRange(range, tag)
}

/** Insert a sanitized link around the current selection (or at caret). */
export function insertSafeLink(editor: HTMLElement, rawHref: string, linkText?: string): boolean {
  editor.focus()
  const href = sanitizeUrl(rawHref)
  if (!href) return false
  const range = selectionInside(editor)
  if (!range) return false

  const a = document.createElement('a')
  a.setAttribute('href', href)
  a.setAttribute('rel', 'noopener noreferrer')
  if (range.collapsed) {
    a.textContent = linkText?.trim() || href
    range.insertNode(a)
  } else {
    try {
      range.surroundContents(a)
    } catch {
      const fragment = range.extractContents()
      a.appendChild(fragment)
      range.insertNode(a)
    }
  }
  placeCaretAfter(a)
  return true
}

/** Unwrap <a> ancestors inside the selection (or caret). */
export function removeLink(editor: HTMLElement): boolean {
  editor.focus()
  const range = selectionInside(editor)
  if (!range) return false
  let node: Node | null = range.commonAncestorContainer
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement
  while (node && node !== editor) {
    if (node instanceof HTMLAnchorElement) {
      const parent = node.parentNode
      if (!parent) return false
      while (node.firstChild) parent.insertBefore(node.firstChild, node)
      parent.removeChild(node)
      return true
    }
    node = node.parentElement
  }
  return false
}

export function insertPlainText(editor: HTMLElement, text: string): void {
  editor.focus()
  const range = selectionInside(editor)
  if (!range) return
  range.deleteContents()
  const textNode = document.createTextNode(text)
  range.insertNode(textNode)
  placeCaretAfter(textNode)
}

export function readSanitizedHtml(editor: HTMLElement, enabled: boolean): string {
  const raw = editor.innerHTML
  return enabled ? sanitizeHtml(raw) : raw
}

export function writeSanitizedHtml(editor: HTMLElement, html: string, enabled: boolean): void {
  const next = enabled ? sanitizeHtml(html || '') : html || ''
  if (editor.innerHTML !== next) editor.innerHTML = next
}

export function warnIfSanitizeDisabled(enabled: boolean): void {
  if (enabled) return
  SecurityService.alert({
    kind: 'html-stripped',
    message: 'RichText sanitize=false disables XSS protection — not recommended for untrusted HTML'
  })
}
