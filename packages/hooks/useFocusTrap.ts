import { onUnmounted, type Ref, watch } from 'vue'
import {
  createFocusTrap,
  focusInitial as runtimeFocusInitial,
  listFocusable
} from '@amg-webui/runtime'
import { getDocument } from '@amg-webui/utils/env'

/**
 * Trap Tab / Shift+Tab inside `container` while `active` is true.
 * Restores focus to the previously focused element on deactivate.
 * Implementation delegates to `@amg-webui/runtime` focus-trap primitives.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null | undefined>,
  active: Ref<boolean>,
  opts?: { restoreFocus?: boolean }
) {
  const restoreFocus = opts?.restoreFocus !== false
  const trap = createFocusTrap()
  let previouslyFocused: HTMLElement | null = null

  function activate() {
    const doc = getDocument()
    const root = container.value
    if (!doc || !root) return
    previouslyFocused = doc.activeElement as HTMLElement | null
    trap.activate(root)
  }

  function deactivate() {
    trap.deactivate()
    if (restoreFocus) previouslyFocused?.focus?.()
    previouslyFocused = null
  }

  watch(
    [active, container],
    ([on, el]) => {
      if (on && el) activate()
      else deactivate()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    deactivate()
  })
}

export { runtimeFocusInitial as focusInitial, listFocusable }
