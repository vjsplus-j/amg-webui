import { getDocument } from '@amg-webui/utils/env'
import { getSharedScrollLockManager } from './scroll-lock-manager'
import { createFocusTrap } from './focus-trap'

export type DocumentEscapeHandler = () => void

export interface DocumentOverlayEntry {
  runtimeId: string
  layerId: string
  zIndex: number
  closeOnEscape: boolean
  onEscape?: DocumentEscapeHandler
  trapFocus: boolean
  container: HTMLElement | null
  onClickOutside?: (event: Event) => void
  /** True when pointer is inside the overlay / excluded triggers. */
  contains?: (target: EventTarget | null) => boolean
  lockScroll: boolean
}

function entryKey(runtimeId: string, layerId: string): string {
  return `${runtimeId}:${layerId}`
}

function scrollOwnerId(runtimeId: string, layerId: string): string {
  return entryKey(runtimeId, layerId)
}

/**
 * Document-level overlay coordinator — one Escape / pointer / focus-trap / scroll
 * coordinator per process. OverlayRuntime instances register layers; dispose only
 * releases that runtime's owners.
 */
export function createDocumentOverlayCoordinator() {
  const entries = new Map<string, DocumentOverlayEntry>()
  const scrollLock = getSharedScrollLockManager()
  const trap = createFocusTrap()
  let escapeBound = false
  let pointerBound = false

  function listByZIndex(): DocumentOverlayEntry[] {
    return [...entries.values()].sort((a, b) => a.zIndex - b.zIndex)
  }

  function globalTop(): DocumentOverlayEntry | null {
    const list = listByZIndex()
    return list[list.length - 1] ?? null
  }

  function topEscape(): DocumentOverlayEntry | null {
    const list = listByZIndex()
    for (let i = list.length - 1; i >= 0; i--) {
      const e = list[i]
      if (e.closeOnEscape && e.onEscape) return e
    }
    return null
  }

  function topClickOutside(): DocumentOverlayEntry | null {
    const list = listByZIndex()
    for (let i = list.length - 1; i >= 0; i--) {
      const e = list[i]
      if (e.onClickOutside && e.contains) return e
    }
    return null
  }

  function topTrap(): DocumentOverlayEntry | null {
    const list = listByZIndex()
    for (let i = list.length - 1; i >= 0; i--) {
      const e = list[i]
      if (e.trapFocus && e.container) return e
    }
    return null
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return
    const top = topEscape()
    if (!top?.onEscape) return
    e.preventDefault()
    e.stopPropagation()
    try {
      top.onEscape()
    } catch {
      /* handler isolation */
    }
  }

  function onPointerDown(event: Event) {
    const top = topClickOutside()
    if (!top?.onClickOutside || !top.contains) return
    if (top.contains(event.target)) return
    try {
      top.onClickOutside(event)
    } catch {
      /* isolation */
    }
  }

  function ensureEscapeBound() {
    const doc = getDocument()
    if (!doc || escapeBound) return
    doc.addEventListener('keydown', onKeydown, true)
    escapeBound = true
  }

  function ensureEscapeUnbound() {
    const doc = getDocument()
    if (!doc || !escapeBound) return
    if (topEscape()) return
    doc.removeEventListener('keydown', onKeydown, true)
    escapeBound = false
  }

  function ensurePointerBound() {
    const doc = getDocument()
    if (!doc || pointerBound) return
    doc.addEventListener('pointerdown', onPointerDown, true)
    pointerBound = true
  }

  function ensurePointerUnbound() {
    const doc = getDocument()
    if (!doc || !pointerBound) return
    if (topClickOutside()) return
    doc.removeEventListener('pointerdown', onPointerDown, true)
    pointerBound = false
  }

  function syncFocusTrap(): void {
    const top = topTrap()
    if (top?.container) trap.activate(top.container)
    else trap.deactivate()
  }

  function syncListeners(): void {
    if (topEscape()) ensureEscapeBound()
    else ensureEscapeUnbound()
    if (topClickOutside()) ensurePointerBound()
    else ensurePointerUnbound()
    syncFocusTrap()
  }

  function upsert(entry: DocumentOverlayEntry): void {
    const key = entryKey(entry.runtimeId, entry.layerId)
    const prev = entries.get(key)
    entries.set(key, entry)

    if (entry.lockScroll) {
      scrollLock.acquire(scrollOwnerId(entry.runtimeId, entry.layerId))
    } else if (prev?.lockScroll) {
      scrollLock.release(scrollOwnerId(entry.runtimeId, entry.layerId))
    }

    syncListeners()
  }

  function remove(runtimeId: string, layerId: string): void {
    const key = entryKey(runtimeId, layerId)
    const prev = entries.get(key)
    if (!prev) return
    entries.delete(key)
    if (prev.lockScroll) {
      scrollLock.release(scrollOwnerId(runtimeId, layerId))
    }
    syncListeners()
  }

  /** Release every layer owned by a runtime (MFE unload). Never resets other runtimes. */
  function releaseRuntime(runtimeId: string): void {
    const prefix = `${runtimeId}:`
    for (const key of [...entries.keys()]) {
      if (!key.startsWith(prefix)) continue
      const prev = entries.get(key)
      entries.delete(key)
      if (prev?.lockScroll) {
        scrollLock.release(scrollOwnerId(prev.runtimeId, prev.layerId))
      }
    }
    syncListeners()
  }

  function reset(): void {
    for (const entry of [...entries.values()]) {
      if (entry.lockScroll) {
        scrollLock.release(scrollOwnerId(entry.runtimeId, entry.layerId))
      }
    }
    entries.clear()
    trap.deactivate()
    ensureEscapeUnbound()
    ensurePointerUnbound()
  }

  return {
    upsert,
    remove,
    releaseRuntime,
    reset,
    globalTop,
    /** Test / debug: layers registered for a runtime. */
    listRuntime(runtimeId: string): DocumentOverlayEntry[] {
      return listByZIndex().filter((e) => e.runtimeId === runtimeId)
    },
    size(): number {
      return entries.size
    }
  }
}

export type DocumentOverlayCoordinator = ReturnType<typeof createDocumentOverlayCoordinator>

let sharedCoordinator: DocumentOverlayCoordinator | null = null

export function getDocumentOverlayCoordinator(): DocumentOverlayCoordinator {
  if (!sharedCoordinator) sharedCoordinator = createDocumentOverlayCoordinator()
  return sharedCoordinator
}

export function resetDocumentOverlayCoordinator(): void {
  sharedCoordinator?.reset()
  sharedCoordinator = null
}
