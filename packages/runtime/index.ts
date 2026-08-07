export type {
  OverlayKind,
  TeleportTarget,
  OverlayAppContextConfig,
  OverlayOpenOptions,
  OverlayUpdatePatch,
  OverlayLayer,
  OverlayHandle,
  OverlayRuntimeApi
} from './types'

export { OVERLAY_RUNTIME_KEY } from './keys'

export { createAppContext } from './app-context'
export { createZIndexManager } from './z-index-manager'
export { createScrollLockManager, getSharedScrollLockManager, resetSharedScrollLockManager } from './scroll-lock-manager'
export {
  createFocusManager,
  createFocusTrap,
  focusInitial,
  listFocusable
} from './focus-manager'
export { createEscapeStack } from './escape-stack'
export { createTeleportManager, resolveTeleportTarget } from './teleport-manager'
export { createClickOutsideManager } from './click-outside'
export {
  getFloatingPanelStyle,
  getFixedPanelStyle,
  clampToViewport,
  type PanelPlacement,
  type FloatingPlacement,
  type FloatingPanelResult
} from './positioning'

export {
  createOverlayRuntime,
  getDefaultOverlayRuntime,
  configureDefaultOverlayRuntime,
  resetDefaultOverlayRuntime
} from './overlay-manager'
