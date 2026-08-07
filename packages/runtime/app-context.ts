import type { OverlayAppContextConfig, TeleportTarget } from './types'

const DEFAULT_Z_INDEX_BASE = 1000
const DEFAULT_NAMESPACE = 'amg-webui'
const DEFAULT_TELEPORT: TeleportTarget = 'body'

export interface AppContextState {
  teleportTo: TeleportTarget
  zIndexBase: number
  namespace: string
}

export function createAppContext(
  initial: OverlayAppContextConfig = {}
): {
  get(): AppContextState
  configure(config: OverlayAppContextConfig): void
} {
  const state: AppContextState = {
    teleportTo: initial.teleportTo ?? DEFAULT_TELEPORT,
    zIndexBase: initial.zIndexBase ?? DEFAULT_Z_INDEX_BASE,
    namespace: initial.namespace ?? DEFAULT_NAMESPACE
  }

  return {
    get() {
      return { ...state }
    },
    configure(config) {
      if (config.teleportTo !== undefined) state.teleportTo = config.teleportTo
      if (config.zIndexBase !== undefined) state.zIndexBase = config.zIndexBase
      if (config.namespace !== undefined) state.namespace = config.namespace
    }
  }
}
