import type { ComputedRef, InjectionKey } from 'vue'
import type { ConfigProviderProps } from './types'

export const CONFIG_PROVIDER_KEY: InjectionKey<ComputedRef<ConfigProviderProps>> =
  Symbol('vpConfigProvider')
