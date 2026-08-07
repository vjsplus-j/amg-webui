import type { InjectionKey, Ref } from 'vue'
import type { OverlayRuntimeApi } from './types'

/** Provide / inject a scoped Overlay runtime (micro-FE / nested shell). May be a Ref. */
export const OVERLAY_RUNTIME_KEY: InjectionKey<
  OverlayRuntimeApi | Ref<OverlayRuntimeApi | null | undefined>
> = Symbol('amgOverlayRuntime')
