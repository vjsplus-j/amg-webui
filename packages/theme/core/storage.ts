import type { ThemeStorage } from './types'

export function createMemoryStorage(seed?: Record<string, string>): ThemeStorage {
  const map = new Map<string, string>(seed ? Object.entries(seed) : [])
  return {
    getItem(key) {
      return map.has(key) ? (map.get(key) as string) : null
    },
    setItem(key, value) {
      map.set(key, value)
    },
    removeItem(key) {
      map.delete(key)
    }
  }
}

/**
 * Wrap `localStorage` / `sessionStorage` (or any Storage-like object).
 * Safe to call on SSR only when you pass an explicit storage — use createAutoStorage() otherwise.
 */
export function createWebStorage(storage: Storage): ThemeStorage {
  return {
    getItem(key) {
      try {
        return storage.getItem(key)
      } catch {
        return null
      }
    },
    setItem(key, value) {
      try {
        storage.setItem(key, value)
      } catch {
        /* quota / private mode */
      }
    },
    removeItem(key) {
      try {
        storage.removeItem(key)
      } catch {
        /* ignore */
      }
    }
  }
}

/** Browser localStorage when available; otherwise memory. Never throws on SSR. */
export function createAutoStorage(): ThemeStorage {
  if (typeof globalThis === 'undefined') return createMemoryStorage()
  try {
    const ls = (globalThis as { localStorage?: Storage }).localStorage
    if (ls) return createWebStorage(ls)
  } catch {
    /* ignore */
  }
  return createMemoryStorage()
}
