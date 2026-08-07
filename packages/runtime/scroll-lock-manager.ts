import { getDocument, getWindow } from '@amg-webui/utils/env'

interface ScrollLockState {
  count: number
  rootOverflow: string
  bodyOverflow: string
  bodyPaddingRight: string
}

const states = new WeakMap<Document, ScrollLockState>()

function acquire(doc: Document): void {
  const current = states.get(doc)
  if (current) {
    current.count += 1
    return
  }

  const win = getWindow()
  const scrollbarWidth = Math.max(
    0,
    (win?.innerWidth ?? 0) - doc.documentElement.clientWidth
  )
  const state: ScrollLockState = {
    count: 1,
    rootOverflow: doc.documentElement.style.overflow,
    bodyOverflow: doc.body.style.overflow,
    bodyPaddingRight: doc.body.style.paddingRight
  }

  states.set(doc, state)
  doc.documentElement.style.overflow = 'hidden'
  doc.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    const currentPadding =
      Number.parseFloat(win?.getComputedStyle(doc.body).paddingRight ?? '0') || 0
    doc.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`
  }
}

function release(doc: Document): void {
  const state = states.get(doc)
  if (!state) return
  state.count -= 1
  if (state.count > 0) return

  doc.documentElement.style.overflow = state.rootOverflow
  doc.body.style.overflow = state.bodyOverflow
  doc.body.style.paddingRight = state.bodyPaddingRight
  states.delete(doc)
}

/** Reference-counted document scroll lock (nested overlays safe). */
export function createScrollLockManager() {
  const owners = new Set<string>()

  function releaseOwner(ownerId: string): void {
    if (!owners.has(ownerId)) return
    const doc = getDocument()
    if (doc) release(doc)
    owners.delete(ownerId)
  }

  return {
    acquire(ownerId: string): void {
      if (owners.has(ownerId)) return
      const doc = getDocument()
      if (!doc) return
      acquire(doc)
      owners.add(ownerId)
    },
    release(ownerId: string): void {
      releaseOwner(ownerId)
    },
    isLocked(): boolean {
      return owners.size > 0
    },
    /** Release owners whose id starts with `prefix` (e.g. `runtime-a:`). */
    releaseByPrefix(prefix: string): void {
      for (const id of [...owners]) {
        if (!id.startsWith(prefix)) continue
        releaseOwner(id)
      }
    },
    reset(): void {
      for (const id of [...owners]) {
        releaseOwner(id)
      }
    }
  }
}

export type ScrollLockManager = ReturnType<typeof createScrollLockManager>

let sharedScrollLock: ScrollLockManager | null = null

/** Process-wide scroll lock used by OverlayRuntime and useBodyScrollLock. */
export function getSharedScrollLockManager(): ScrollLockManager {
  if (!sharedScrollLock) sharedScrollLock = createScrollLockManager()
  return sharedScrollLock
}

export function resetSharedScrollLockManager(): void {
  sharedScrollLock?.reset()
  sharedScrollLock = null
}
