import Comp from './index.vue'
import { CONFIG_PROVIDER_KEY } from './config'
export { useConfigProvider, useConfigValue } from './useConfigProvider'

export { Comp as ConfigProvider, CONFIG_PROVIDER_KEY }
export type {
  ConfigProviderDensity,
  ConfigProviderDirection,
  ConfigProviderEmits,
  ConfigProviderEmptyConfig,
  ConfigProviderProps,
  ConfigProviderResolvedConfig,
  ConfigProviderRuntimeConfig
} from './types'
export default Comp
