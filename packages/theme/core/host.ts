import type { ThemeHost } from './types'
import { LEGACY_THEME_CLASSES } from './registry'

/** No-op host for SSR / unit tests — writes are discarded. */
export function createNullHost(): ThemeHost {
  return {
    setAttribute() {},
    setStyleProperty() {},
    removeClassNames() {}
  }
}

/**
 * Apply theme axes to a DOM Element (documentElement, micro-app root, or shadow host).
 */
export function createDocumentHost(root?: Element | null): ThemeHost {
  const resolveRoot = (): Element | null => {
    if (root) return root
    if (typeof document === 'undefined') return null
    return document.documentElement
  }

  return {
    setAttribute(name, value) {
      const el = resolveRoot()
      if (!el) return
      if (value === null) el.removeAttribute(name)
      else el.setAttribute(name, value)
    },
    setStyleProperty(name, value) {
      const el = resolveRoot()
      if (!el || !('style' in el)) return
      const style = (el as HTMLElement).style
      if (value === null) style.removeProperty(name)
      else style.setProperty(name, value)
    },
    removeClassNames(names) {
      const el = resolveRoot()
      if (!el) return
      for (const name of names) {
        el.classList.remove(`theme-${name}`)
      }
    }
  }
}

/** Document host when `document` exists; otherwise null host. */
export function createAutoHost(root?: Element | null): ThemeHost {
  if (typeof document === 'undefined') return createNullHost()
  return createDocumentHost(root ?? document.documentElement)
}

export function applyLegacyThemeClassCleanup(host: ThemeHost): void {
  host.removeClassNames?.(LEGACY_THEME_CLASSES)
}
