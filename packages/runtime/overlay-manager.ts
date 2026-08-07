import { createAppContext } from './app-context'
import { createZIndexManager } from './z-index-manager'
import { getSharedScrollLockManager } from './scroll-lock-manager'
import { createFocusManager } from './focus-manager'
import { createEscapeStack } from './escape-stack'
import { createTeleportManager } from './teleport-manager'
import { createClickOutsideManager } from './click-outside'
import type {
  OverlayAppContextConfig,
  OverlayHandle,
  OverlayKind,
  OverlayLayer,
  OverlayOpenOptions,
  OverlayRuntimeApi,
  TeleportTarget
} from './types'

let idSeq = 0

function nextId(): string {
  idSeq += 1
  return `vp-overlay-${idSeq}`
}

function defaultModal(kind: OverlayKind): boolean {
  return kind === 'modal' || kind === 'drawer' || kind === 'message'
}

function defaultLockScroll(kind: OverlayKind, modal: boolean): boolean {
  return modal && (kind === 'modal' || kind === 'drawer' || kind === 'message' || kind === 'tour')
}

function defaultTrapFocus(kind: OverlayKind, modal: boolean): boolean {
  return modal && (kind === 'modal' || kind === 'drawer' || kind === 'message')
}

function defaultCloseOnEscape(kind: OverlayKind): boolean {
  return kind !== 'tooltip'
}

export function createOverlayRuntime(
  initial?: OverlayAppContextConfig
): OverlayRuntimeApi {
  const appContext = createAppContext(initial)
  const zIndex = createZIndexManager(() => appContext.get().zIndexBase)
  const scrollLock = getSharedScrollLockManager()
  const focus = createFocusManager()
  const escape = createEscapeStack()
  const teleport = createTeleportManager(() => appContext.get().teleportTo)
  const clickOutside = createClickOutsideManager()
  const stack: OverlayLayer[] = []

  function syncTopFocusTrap(): void {
    const top = stack[stack.length - 1]
    if (top?.trapFocus && top.container) {
      focus.activateTrap(top.container)
    } else {
      focus.deactivateTrap()
    }
  }

  function syncClickOutside(layer: OverlayLayer): void {
    if (!layer.onClickOutside) {
      clickOutside.remove(layer.id)
      return
    }
    clickOutside.push({
      id: layer.id,
      contains: (target) => {
        if (!(target instanceof Node)) return false
        if (layer.container?.contains(target)) return true
        for (const el of layer.exclude) {
          if (el?.contains(target)) return true
        }
        return false
      },
      onOutside: layer.onClickOutside
    })
  }

  function removeLayer(id: string, restoreFocus: boolean): void {
    const idx = stack.findIndex((l) => l.id === id)
    if (idx < 0) return
    const [layer] = stack.splice(idx, 1)
    zIndex.release(id)
    if (layer.lockScroll) scrollLock.release(id)
    escape.remove(id)
    clickOutside.remove(id)
    syncTopFocusTrap()
    if (restoreFocus && layer.restoreFocus) {
      // Only restore if no other trap layer remains on top
      const top = stack[stack.length - 1]
      if (!top?.trapFocus) focus.restore(layer.previouslyFocused)
    }
  }

  function open(options: OverlayOpenOptions): OverlayHandle {
    const id = nextId()
    const modal = options.modal ?? defaultModal(options.kind)
    const lockScroll = options.lockScroll ?? defaultLockScroll(options.kind, modal)
    const trapFocus = options.trapFocus ?? defaultTrapFocus(options.kind, modal)
    const restoreFocus = options.restoreFocus !== false
    const closeOnEscape = options.closeOnEscape ?? defaultCloseOnEscape(options.kind)
    const z = zIndex.allocate(id, options.kind, options.zIndex)

    const layer: OverlayLayer = {
      id,
      kind: options.kind,
      zIndex: z,
      modal,
      lockScroll,
      trapFocus,
      restoreFocus,
      closeOnEscape,
      onEscape: options.onEscape,
      container: options.container ?? null,
      exclude: options.exclude ?? [],
      onClickOutside: options.onClickOutside,
      previouslyFocused: trapFocus || restoreFocus ? focus.capturePrevious() : null
    }

    stack.push(layer)

    if (lockScroll) scrollLock.acquire(id)
    if (closeOnEscape && options.onEscape) {
      escape.push(id, options.onEscape)
    }
    syncClickOutside(layer)
    syncTopFocusTrap()

    return {
      id,
      zIndex: z,
      close() {
        removeLayer(id, true)
      },
      update(patch) {
        const current = stack.find((l) => l.id === id)
        if (!current) return
        if (patch.container !== undefined) current.container = patch.container ?? null
        if (patch.exclude !== undefined) current.exclude = patch.exclude
        if (patch.modal !== undefined) current.modal = patch.modal
        if (patch.lockScroll !== undefined && patch.lockScroll !== current.lockScroll) {
          if (patch.lockScroll) scrollLock.acquire(id)
          else scrollLock.release(id)
          current.lockScroll = patch.lockScroll
        }
        if (patch.trapFocus !== undefined) current.trapFocus = patch.trapFocus
        if (patch.closeOnEscape !== undefined) current.closeOnEscape = patch.closeOnEscape
        if (patch.onEscape !== undefined) current.onEscape = patch.onEscape
        if (
          patch.onEscape !== undefined ||
          patch.closeOnEscape !== undefined
        ) {
          if (current.closeOnEscape && current.onEscape) escape.push(id, current.onEscape)
          else escape.remove(id)
        }
        if (patch.onClickOutside !== undefined) {
          current.onClickOutside = patch.onClickOutside
          syncClickOutside(current)
        }
        syncTopFocusTrap()
      }
    }
  }

  return {
    configure(config) {
      appContext.configure(config)
    },
    getContext() {
      return appContext.get()
    },
    open,
    close(id) {
      removeLayer(id, true)
    },
    closeTop() {
      const top = stack[stack.length - 1]
      if (top) removeLayer(top.id, true)
    },
    getTop() {
      return stack[stack.length - 1] ?? null
    },
    getLayer(id) {
      return stack.find((l) => l.id === id) ?? null
    },
    getStack() {
      return stack
    },
    resolveTeleportTo(override?: TeleportTarget) {
      return teleport.resolve(override)
    },
    dispose() {
      while (stack.length) {
        const top = stack[stack.length - 1]
        removeLayer(top.id, false)
      }
      zIndex.reset()
      scrollLock.reset()
      escape.reset()
      clickOutside.reset()
      focus.deactivateTrap()
    }
  }
}

let defaultRuntime: OverlayRuntimeApi | null = null

export function getDefaultOverlayRuntime(): OverlayRuntimeApi {
  if (!defaultRuntime) defaultRuntime = createOverlayRuntime()
  return defaultRuntime
}

export function configureDefaultOverlayRuntime(
  config: OverlayAppContextConfig
): OverlayRuntimeApi {
  const rt = getDefaultOverlayRuntime()
  rt.configure(config)
  return rt
}

export function resetDefaultOverlayRuntime(): void {
  defaultRuntime?.dispose()
  defaultRuntime = null
}
