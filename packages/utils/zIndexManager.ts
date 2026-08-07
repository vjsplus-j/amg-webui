/**
 * Monotonic overlay z-index allocator.
 * Seeded by ConfigProvider (`setZIndexBase`); each overlay open takes `nextZIndex()`.
 * Framework-free — safe for SSR (no DOM).
 */

let base = 2000
let current = base

export function getZIndexBase(): number {
  return base
}

export function getCurrentZIndex(): number {
  return current
}

/** Raise the floor used for subsequent allocations (e.g. from ConfigProvider.zIndex). */
export function setZIndexBase(next: number): void {
  if (!Number.isFinite(next)) return
  const n = Math.floor(next)
  base = n
  if (current < n) current = n
}

/** Allocate the next stacking index for an overlay instance. */
export function nextZIndex(): number {
  current += 1
  return current
}

/** Test helper — reset allocator state. */
export function resetZIndexManager(nextBase = 2000): void {
  base = nextBase
  current = nextBase
}
