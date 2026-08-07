import type { InjectionKey } from 'vue'
import type { OverlayRuntimeApi } from './types'

/** Provide / inject a scoped Overlay runtime (micro-FE / nested shell). */
export const OVERLAY_RUNTIME_KEY: InjectionKey<OverlayRuntimeApi> = Symbol(
  'amgOverlayRuntime'
)
