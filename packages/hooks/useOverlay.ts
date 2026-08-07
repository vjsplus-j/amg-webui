import {
  computed,
  onUnmounted,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref
} from 'vue'
import { KEYS } from '@amg-webui/utils/keyboard'
import { getDocument } from '@amg-webui/utils/env'
import { useFocusTrap } from './useFocusTrap'
import { useBodyScrollLock } from './useBodyScrollLock'
import { useZIndex } from './useZIndex'

export type OverlayCloseReason = 'escape' | 'outside'

export interface UseOverlayOptions {
  visible: Readonly<Ref<boolean>>
  /** Panel / dialog root — focus trap + optional outside-click boundary */
  container: Ref<HTMLElement | null | undefined>
  /** Lock body scroll while open (default: true) */
  modal?: MaybeRefOrGetter<boolean>
  /** Trap Tab inside container (default: same as modal) */
  trapFocus?: MaybeRefOrGetter<boolean>
  /** Close on Escape (default: true) */
  closeOnEscape?: MaybeRefOrGetter<boolean>
  /**
   * Close on pointerdown outside `container` (default: false).
   * Prefer overlay-host click for modal masks; enable for floating panels.
   */
  closeOnClickOutside?: MaybeRefOrGetter<boolean>
  /**
   * Elements treated as “inside” for outside-click (e.g. select trigger).
   * Clicking these does not fire `onClose('outside')`.
   */
  ignore?: MaybeRefOrGetter<
    Array<Ref<HTMLElement | null | undefined> | HTMLElement | null | undefined>
  >
  /** Explicit z-index override; otherwise allocated via zIndexManager */
  zIndex?: Ref<number | undefined>
  onClose?: (reason: OverlayCloseReason) => void
}

/**
 * Unified overlay controller: focus trap + reference-counted scroll lock +
 * Escape / optional outside-click + stacking z-index.
 * Does not own Teleport target — keep `teleportTo` on the component.
 */
export function useOverlay(options: UseOverlayOptions) {
  const modal = computed(() => toValue(options.modal ?? true))
  const trapFocus = computed(() =>
    toValue(options.trapFocus ?? modal.value)
  )
  const closeOnEscape = computed(() => toValue(options.closeOnEscape ?? true))
  const closeOnClickOutside = computed(() =>
    toValue(options.closeOnClickOutside ?? false)
  )

  const trapActive = computed(
    () => options.visible.value && trapFocus.value
  )
  useFocusTrap(options.container, trapActive)

  useBodyScrollLock(options.visible, modal)

  const zIndex = useZIndex(options.zIndex)

  function onKeydown(e: KeyboardEvent) {
    if (!options.visible.value || !closeOnEscape.value) return
    if (e.key !== KEYS.ESCAPE) return
    e.preventDefault()
    options.onClose?.('escape')
  }

  function onPointerDown(e: Event) {
    if (!options.visible.value || !closeOnClickOutside.value) return
    const root = options.container.value
    const target = e.target
    if (!(target instanceof Node)) return
    if (root && root.contains(target)) return
    const ignored = toValue(options.ignore ?? [])
    for (const item of ignored) {
      const el = item && typeof item === 'object' && 'value' in item ? item.value : item
      if (el && el.contains(target)) return
    }
    options.onClose?.('outside')
  }

  function bind() {
    const doc = getDocument()
    if (!doc) return
    doc.addEventListener('keydown', onKeydown, true)
    doc.addEventListener('pointerdown', onPointerDown, true)
  }

  function unbind() {
    const doc = getDocument()
    if (!doc) return
    doc.removeEventListener('keydown', onKeydown, true)
    doc.removeEventListener('pointerdown', onPointerDown, true)
  }

  watch(
    () => options.visible.value,
    (open) => {
      unbind()
      if (open) bind()
    },
    { immediate: true }
  )

  onUnmounted(unbind)

  return { zIndex }
}
