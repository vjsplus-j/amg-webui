import { getDocument } from '@amg-webui/utils/env'

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="menuitem"]:not([disabled])'

export function listFocusable(root: HTMLElement): HTMLElement[] {
  const seen = new Set<HTMLElement>()
  const out: HTMLElement[] = []
  for (const el of root.querySelectorAll<HTMLElement>(FOCUSABLE)) {
    if (seen.has(el)) continue
    if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') continue
    if (el.tabIndex < 0 && el.getAttribute('role') !== 'menuitem') continue
    if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') continue
    seen.add(el)
    out.push(el)
  }
  return out
}

export function focusInitial(container: HTMLElement | null | undefined): void {
  if (!container) return
  const autofocus = container.querySelector<HTMLElement>('[autofocus]')
  const nodes = listFocusable(container)
  const first = nodes[0]
  ;(autofocus ?? first ?? container)?.focus?.()
}

export function createFocusTrap() {
  let activeRoot: HTMLElement | null = null
  let onKeydown: ((e: KeyboardEvent) => void) | null = null

  function deactivate(): void {
    const doc = getDocument()
    if (doc && onKeydown) doc.removeEventListener('keydown', onKeydown, true)
    onKeydown = null
    activeRoot = null
  }

  function activate(root: HTMLElement): void {
    deactivate()
    const doc = getDocument()
    if (!doc) return
    activeRoot = root
    onKeydown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !activeRoot) return
      const nodes = listFocusable(activeRoot)
      if (!nodes.length) {
        e.preventDefault()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const current = doc.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (current === first || !activeRoot.contains(current)) {
          e.preventDefault()
          last.focus()
        }
      } else if (current === last || !activeRoot.contains(current)) {
        e.preventDefault()
        first.focus()
      }
    }
    doc.addEventListener('keydown', onKeydown, true)
  }

  return { activate, deactivate }
}

export type FocusTrap = ReturnType<typeof createFocusTrap>

export function createFocusManager() {
  const trap = createFocusTrap()

  return {
    capturePrevious(): HTMLElement | null {
      const doc = getDocument()
      return (doc?.activeElement as HTMLElement | null) ?? null
    },
    activateTrap(container: HTMLElement | null): void {
      if (container) trap.activate(container)
      else trap.deactivate()
    },
    deactivateTrap(): void {
      trap.deactivate()
    },
    restore(el: HTMLElement | null): void {
      el?.focus?.()
    },
    focusInitial,
    listFocusable
  }
}

export type FocusManager = ReturnType<typeof createFocusManager>
