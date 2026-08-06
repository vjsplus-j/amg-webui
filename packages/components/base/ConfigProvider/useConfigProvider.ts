import { computed, inject, type ComputedRef } from 'vue'
import { CONFIG_PROVIDER_KEY } from './config'
import type { ConfigProviderResolvedConfig } from './types'

const EMPTY_CONFIG = computed<ConfigProviderResolvedConfig>(() => ({}))

export function useConfigProvider(): ComputedRef<ConfigProviderResolvedConfig> {
  return inject(CONFIG_PROVIDER_KEY, EMPTY_CONFIG)
}

export function useConfigValue<K extends keyof ConfigProviderResolvedConfig>(
  key: K,
  fallback?: ConfigProviderResolvedConfig[K]
) {
  const config = useConfigProvider()
  return computed(() => config.value[key] ?? fallback)
}
