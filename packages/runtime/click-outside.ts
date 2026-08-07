import { getDocument } from '@amg-webui/utils/env'

export interface ClickOutsideRegistration {
  id: string
  /** True when pointer is inside the overlay / excluded triggers. */
  contains: (target: EventTarget | null) => boolean
  onOutside: (event: Event) => void
}

/** Capture pointerdown; only the top registration that does not contain the target fires. */
export function createClickOutsideManager() {
  const stack: ClickOutsideRegistration[] = []
  let bound = false

  function onPointerDown(event: Event) {
    const top = stack[stack.length - 1]
    if (!top) return
    if (top.contains(event.target)) return
    try {
      top.onOutside(event)
    } catch {
      /* isolation */
    }
  }

  function ensureBound() {
    const doc = getDocument()
    if (!doc || bound) return
    doc.addEventListener('pointerdown', onPointerDown, true)
    bound = true
  }

  function ensureUnbound() {
    const doc = getDocument()
    if (!doc || !bound || stack.length > 0) return
    doc.removeEventListener('pointerdown', onPointerDown, true)
    bound = false
  }

  return {
    push(reg: ClickOutsideRegistration): void {
      const idx = stack.findIndex((s) => s.id === reg.id)
      if (idx >= 0) stack.splice(idx, 1)
      stack.push(reg)
      ensureBound()
    },
    remove(id: string): void {
      const idx = stack.findIndex((s) => s.id === id)
      if (idx >= 0) stack.splice(idx, 1)
      ensureUnbound()
    },
    reset(): void {
      stack.length = 0
      ensureUnbound()
    }
  }
}

export type ClickOutsideManager = ReturnType<typeof createClickOutsideManager>
