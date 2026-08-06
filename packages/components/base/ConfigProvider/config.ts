import type { ComputedRef, InjectionKey } from 'vue'
import type { ConfigProviderResolvedConfig } from './types'

export const CONFIG_PROVIDER_KEY: InjectionKey<ComputedRef<ConfigProviderResolvedConfig>> =
  Symbol('vpConfigProvider')
