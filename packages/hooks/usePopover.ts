import { computed, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import {
  getFloatingPanelStyle,
  type FloatingPlacement
} from '@amg-webui/utils/domPanel'
import { useFloatingPanel } from './useFloatingPanel'
import { useOverlay, type OverlayCloseReason } from './useOverlay'

export interface UsePopoverOptions {
  placement?: MaybeRefOrGetter<FloatingPlacement>
  offset?: MaybeRefOrGetter<number>
  matchTriggerWidth?: MaybeRefOrGetter<boolean>
  trapFocus?: MaybeRefOrGetter<boolean>
  closeOnEscape?: MaybeRefOrGetter<boolean>
  closeOnClickOutside?: MaybeRefOrGetter<boolean>
  zIndex?: Ref<number | undefined>
  onClose?: (reason: OverlayCloseReason) => void
}

/**
 * Floating popover / picker shell:
 * open state + Teleport-ready refs + `useFloatingPanel` + non-modal `useOverlay`.
 * Components own `<Teleport>` in template and bind `:style="panelStyle"`.
 */
export function usePopover(options: UsePopoverOptions = {}) {
  const isOpen = ref(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)

  const placementRef = computed(
    () => toValue(options.placement ?? 'bottom-start') as FloatingPlacement
  )
  const offsetRef = computed(() => toValue(options.offset ?? 4))
  const matchWidthRef = computed(() =>
    toValue(options.matchTriggerWidth ?? true)
  )

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const { zIndex } = useOverlay({
    visible: isOpen,
    container: panelRef,
    modal: false,
    trapFocus: () => toValue(options.trapFocus ?? false),
    closeOnEscape: () => toValue(options.closeOnEscape ?? true),
    closeOnClickOutside: () => toValue(options.closeOnClickOutside ?? true),
    ignore: [triggerRef],
    zIndex: options.zIndex,
    onClose: (reason) => {
      close()
      options.onClose?.(reason)
    }
  })

  const { panelStyle, actualPlacement, update } = useFloatingPanel(
    triggerRef,
    panelRef,
    isOpen,
    placementRef,
    {
      offset: offsetRef,
      zIndex,
      matchTriggerWidth: matchWidthRef
    }
  )

  return {
    isOpen,
    triggerRef,
    panelRef,
    open,
    close,
    toggle,
    panelStyle,
    actualPlacement,
    zIndex,
    update,
    /** @deprecated prefer panelStyle from floating panel */
    getPanelStyle: () =>
      triggerRef.value
        ? getFloatingPanelStyle(triggerRef.value, panelRef.value, {
            placement: placementRef.value,
            offset: offsetRef.value,
            zIndex: zIndex.value,
            matchTriggerWidth: matchWidthRef.value
          }).style
        : {}
  }
}
