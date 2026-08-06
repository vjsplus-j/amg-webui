import { inject, unref, type MaybeRef } from 'vue'
import {
  getDefaultThemeRuntime,
  THEME_RUNTIME_KEY,
  type ThemeRuntime
} from '@amg-webui/theme'

/**
 * Resolve the nearest scoped ThemeRuntime (ThemeProvider / ConfigProvider),
 * falling back to the app-default singleton.
 *
 * Prefer this for multi-instance / micro-FE subtrees. Do not use
 * `ThemeService.configure` to fight over the singleton for same-page themes.
 */
export function useThemeRuntime(): ThemeRuntime {
  const injected = inject(THEME_RUNTIME_KEY, null) as MaybeRef<ThemeRuntime | null> | null
  if (injected == null) return getDefaultThemeRuntime()
  const value = unref(injected)
  return value ?? getDefaultThemeRuntime()
}

export { THEME_RUNTIME_KEY }
