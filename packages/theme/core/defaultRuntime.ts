import type { ThemeConfigureOptions, ThemeRuntime, ThemeSnapshot } from './types'
import { createThemeRuntime } from './runtime'
import { createAutoHost, createDocumentHost } from './host'
import { createAutoStorage } from './storage'

let defaultRuntime: ThemeRuntime | null = null

/**
 * Lazy singleton used by ThemeService / FontService / IconStyleService.
 * SSR-safe: null host + memory storage until configure/bind on the client.
 */
export function getDefaultThemeRuntime(): ThemeRuntime {
  if (!defaultRuntime) {
    defaultRuntime = createThemeRuntime({
      host: createAutoHost(),
      storage: createAutoStorage()
    })
  }
  return defaultRuntime
}

/**
 * Reconfigure or replace the default singleton (micro-FE root, namespaced storage).
 */
export function configureDefaultThemeRuntime(options: ThemeConfigureOptions): ThemeRuntime {
  if (options.runtime) {
    defaultRuntime?.dispose()
    defaultRuntime = options.runtime
    return defaultRuntime
  }

  const prev: ThemeSnapshot | undefined = defaultRuntime?.getState()
  defaultRuntime?.dispose()

  const host =
    options.host ?? (options.root ? createDocumentHost(options.root) : createAutoHost())
  const storage = options.storage ?? createAutoStorage()

  defaultRuntime = createThemeRuntime({
    host,
    storage,
    storageNamespace: options.storageNamespace,
    defaults:
      options.defaults ??
      (prev
        ? {
            design: prev.design,
            scheme: prev.scheme,
            font: prev.font,
            iconStyle: prev.iconStyle
          }
        : undefined),
    syncBrandFont: options.syncBrandFont,
    persist: options.persist
  })

  if (prev) {
    defaultRuntime.init({
      preferStorage: false,
      overrides: {
        design: prev.design,
        scheme: prev.scheme,
        font: prev.font,
        iconStyle: prev.iconStyle
      }
    })
    if (Object.keys(prev.customTokens).length > 0) {
      defaultRuntime.applyCustom(prev.customTokens)
    }
  }

  return defaultRuntime
}

/** Test helper — drop the singleton between cases. */
export function resetDefaultThemeRuntime(): void {
  defaultRuntime?.dispose()
  defaultRuntime = null
}
