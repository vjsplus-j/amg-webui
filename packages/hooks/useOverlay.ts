import {
  computed,
  inject,
  onUnmounted,
  shallowRef,
  toValue,
  useId,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef
} from 'vue'
import {
  focusInitial,
  getDefaultOverlayRuntime,
  OVERLAY_RUNTIME_KEY,
  type OverlayHandle,
  type OverlayKind,
  type OverlayRuntimeApi,
  type TeleportTarget
} from '@amg-webui/runtime'

export interface UseOverlayOptions {
  visible: MaybeRefOrGetter<boolean>
  kind: OverlayKind
  /** Panel root for trap / initial focus. */
  container: Ref<HTMLElement | null | undefined>
  /** Explicit runtime; else inject OVERLAY_RUNTIME_KEY; else default singleton. */
  runtime?: MaybeRefOrGetter<OverlayRuntimeApi | undefined>
  modal?: MaybeRefOrGetter<boolean | undefined>
  lockScroll?: MaybeRefOrGetter<boolean | undefined>
  trapFocus?: MaybeRefOrGetter<boolean | undefined>
  restoreFocus?: MaybeRefOrGetter<boolean | undefined>
  closeOnEscape?: MaybeRefOrGetter<boolean | undefined>
  onEscape?: () => void
  onClickOutside?: (event: Event) => void
  /** Trigger / exclude nodes for click-outside. */
  exclude?: MaybeRefOrGetter<Array<HTMLElement | null | undefined>>
  zIndex?: MaybeRefOrGetter<number | undefined>
  teleportTo?: MaybeRefOrGetter<TeleportTarget>
  /** When true, call focusInitial after open. @default kind modal/drawer/message */
  autoFocus?: MaybeRefOrGetter<boolean | undefined>
}

export interface UseOverlayResult {
  zIndex: ShallowRef<number | undefined>
  teleportTo: Ref<TeleportTarget>
  titleId: string
  labelledBy: (hasTitle: boolean) => string | undefined
  handle: ShallowRef<OverlayHandle | null>
  ariaModal: Ref<boolean | undefined>
}

function resolveRuntime(
  options: UseOverlayOptions,
  injected: OverlayRuntimeApi | undefined
): OverlayRuntimeApi {
  return toValue(options.runtime) ?? injected ?? getDefaultOverlayRuntime()
}

/**
 * Bind a component panel to the unified Overlay runtime (stack, z-index,
 * scroll lock, focus trap, escape LIFO, teleport defaults).
 */
export function useOverlay(options: UseOverlayOptions): UseOverlayResult {
  const injected = inject(OVERLAY_RUNTIME_KEY, undefined)
  const handle = shallowRef<OverlayHandle | null>(null)
  const zIndex = shallowRef<number | undefined>(undefined)
  const uid = useId()
  const titleId = `${uid}-title`
  let pendingFocus = false

  const teleportTo = computed(() =>
    resolveRuntime(options, injected).resolveTeleportTo(toValue(options.teleportTo))
  )

  const ariaModal = computed(() => {
    const modal = toValue(options.modal)
    if (modal === undefined) return undefined
    return modal
  })

  function labelledBy(hasTitle: boolean): string | undefined {
    return hasTitle ? titleId : undefined
  }

  function wantsAutoFocus(): boolean {
    const explicit = toValue(options.autoFocus)
    if (explicit !== undefined) return explicit
    return (
      options.kind === 'modal' ||
      options.kind === 'drawer' ||
      options.kind === 'message'
    )
  }

  function syncOpenOptions() {
    handle.value?.update({
      container: options.container.value ?? null,
      exclude: toValue(options.exclude) ?? [],
      onEscape: options.onEscape,
      onClickOutside: options.onClickOutside,
      modal: toValue(options.modal),
      lockScroll: toValue(options.lockScroll),
      trapFocus: toValue(options.trapFocus),
      closeOnEscape: toValue(options.closeOnEscape)
    })
  }

  function closeHandle() {
    handle.value?.close()
    handle.value = null
    zIndex.value = undefined
    pendingFocus = false
  }

  function openHandle() {
    const runtime = resolveRuntime(options, injected)
    if (handle.value) {
      syncOpenOptions()
      return
    }

    const opened = runtime.open({
      kind: options.kind,
      modal: toValue(options.modal),
      lockScroll: toValue(options.lockScroll),
      trapFocus: toValue(options.trapFocus),
      restoreFocus: toValue(options.restoreFocus),
      closeOnEscape: toValue(options.closeOnEscape),
      onEscape: options.onEscape,
      onClickOutside: options.onClickOutside,
      zIndex: toValue(options.zIndex),
      container: options.container.value ?? null,
      exclude: toValue(options.exclude) ?? []
    })
    handle.value = opened
    zIndex.value = opened.zIndex
    pendingFocus = wantsAutoFocus()

    if (pendingFocus && options.container.value) {
      pendingFocus = false
      opened.update({ container: options.container.value })
      focusInitial(options.container.value)
    }
  }

  watch(
    () => toValue(options.visible),
    (visible) => {
      if (visible) openHandle()
      else closeHandle()
    },
    { immediate: true }
  )

  watch(
    () => options.container.value,
    (el) => {
      handle.value?.update({ container: el ?? null })
      if (el && pendingFocus && handle.value) {
        pendingFocus = false
        focusInitial(el)
      }
    }
  )

  watch(
    () =>
      [
        toValue(options.modal),
        toValue(options.lockScroll),
        toValue(options.trapFocus),
        toValue(options.closeOnEscape),
        toValue(options.exclude),
        toValue(options.zIndex)
      ] as const,
    () => {
      if (handle.value) syncOpenOptions()
    }
  )

  onUnmounted(() => {
    closeHandle()
  })

  return {
    zIndex,
    teleportTo,
    titleId,
    labelledBy,
    handle,
    ariaModal
  }
}
