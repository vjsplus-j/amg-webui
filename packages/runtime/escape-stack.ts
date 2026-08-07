import { getDocument } from '@amg-webui/utils/env'

export type EscapeHandler = () => void

/** Single document Escape listener; LIFO — only the top handler runs. */
export function createEscapeStack() {
  const stack: Array<{ id: string; handler: EscapeHandler }> = []
  let bound = false

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return
    const top = stack[stack.length - 1]
    if (!top) return
    e.preventDefault()
    e.stopPropagation()
    try {
      top.handler()
    } catch {
      /* handler isolation */
    }
  }

  function ensureBound() {
    const doc = getDocument()
    if (!doc || bound) return
    doc.addEventListener('keydown', onKeydown, true)
    bound = true
  }

  function ensureUnbound() {
    const doc = getDocument()
    if (!doc || !bound || stack.length > 0) return
    doc.removeEventListener('keydown', onKeydown, true)
    bound = false
  }

  return {
    push(id: string, handler: EscapeHandler): void {
      // Replace existing entry for same id
      const idx = stack.findIndex((s) => s.id === id)
      if (idx >= 0) stack.splice(idx, 1)
      stack.push({ id, handler })
      ensureBound()
    },
    remove(id: string): void {
      const idx = stack.findIndex((s) => s.id === id)
      if (idx >= 0) stack.splice(idx, 1)
      ensureUnbound()
    },
    topId(): string | null {
      return stack[stack.length - 1]?.id ?? null
    },
    reset(): void {
      stack.length = 0
      ensureUnbound()
    }
  }
}

export type EscapeStack = ReturnType<typeof createEscapeStack>
