import { createAppContext } from './app-context'
import { createZIndexManager } from './z-index-manager'
import {
  getDocumentOverlayCoordinator,
  type DocumentOverlayEntry
} from './document-overlay-coordinator'
import { createFocusManager } from './focus-manager'
import { createTeleportManager } from './teleport-manager'
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
let runtimeSeq = 0

function nextId(): string {
  idSeq += 1
  return `vp-overlay-${idSeq}`
}

function nextRuntimeId(): string {
  runtimeSeq += 1
  return `vp-runtime-${runtimeSeq}`
}

function defaultModal(kind: OverlayKind): boolean {
  return kind === 'modal' || kind === 'drawer' || kind === 'message'
}

function defaultLockScroll(kind: OverlayKind, modal: boolean): boolean {
  return modal && (kind === 'modal' || kind === 'drawer' || kind === 'message')
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
  const runtimeId = nextRuntimeId()
  const appContext = createAppContext(initial)
  const zIndex = createZIndexManager(() => appContext.get().zIndexBase)
  const coordinator = getDocumentOverlayCoordinator()
  const focus = createFocusManager()
  const teleport = createTeleportManager(() => appContext.get().teleportTo)
  const stack: OverlayLayer[] = []

  function toEntry(layer: OverlayLayer): DocumentOverlayEntry {
    return {
      runtimeId,
      layerId: layer.id,
      zIndex: layer.zIndex,
      closeOnEscape: layer.closeOnEscape,
      onEscape: layer.onEscape,
      trapFocus: layer.trapFocus,
      container: layer.container,
      lockScroll: layer.lockScroll,
      onClickOutside: layer.onClickOutside,
      contains: layer.onClickOutside
        ? (target) => {
            if (!(target instanceof Node)) return false
            if (layer.container?.contains(target)) return true
            for (const el of layer.exclude) {
              if (el?.contains(target)) return true
            }
            return false
          }
        : undefined
    }
  }

  function syncCoordinator(layer: OverlayLayer): void {
    coordinator.upsert(toEntry(layer))
  }

  function removeLayer(id: string, restoreFocus: boolean): void {
    const idx = stack.findIndex((l) => l.id === id)
    if (idx < 0) return
    const [layer] = stack.splice(idx, 1)
    zIndex.release(id)
    coordinator.remove(runtimeId, id)

    if (restoreFocus && layer.restoreFocus && layer.previouslyFocused) {
      const top = stack[stack.length - 1]
      // Nested modal: restore into parent trap container when the trigger still lives there
      if (
        !top?.trapFocus ||
        (top.container != null && top.container.contains(layer.previouslyFocused))
      ) {
        focus.restore(layer.previouslyFocused)
      }
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
    syncCoordinator(layer)

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
        if (patch.lockScroll !== undefined) current.lockScroll = patch.lockScroll
        if (patch.trapFocus !== undefined) current.trapFocus = patch.trapFocus
        if (patch.closeOnEscape !== undefined) current.closeOnEscape = patch.closeOnEscape
        if (patch.onEscape !== undefined) current.onEscape = patch.onEscape
        if (patch.onClickOutside !== undefined) current.onClickOutside = patch.onClickOutside
        syncCoordinator(current)
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
      // Only release this runtime's document registrations — never global reset
      coordinator.releaseRuntime(runtimeId)
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
