import type { InjectionKey, Ref } from 'vue'
import type { ThemeRuntime } from './core/types'

/**
 * Vue provide/inject key for a scoped ThemeRuntime (ThemeProvider / ConfigProvider).
 * May be a bare runtime or a Ref (providers typically provide a shallowRef).
 */
export const THEME_RUNTIME_KEY: InjectionKey<ThemeRuntime | Ref<ThemeRuntime | null>> =
  Symbol('amgThemeRuntime')
