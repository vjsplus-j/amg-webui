import { onUnmounted, type Ref, watch } from 'vue'
import { KEYS } from '@amg-webui/utils/keyboard'

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="menuitem"]:not([disabled])'

function listFocusable(root: HTMLElement): HTMLElement[] {
  const seen = new Set<HTMLElement>()
  const out: HTMLElement[] = []
  for (const el of root.querySelectorAll<HTMLElement>(FOCUSABLE)) {
    if (seen.has(el)) continue
    if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') continue
    // Include role=menuitem even when tabindex=-1 (roving tabindex menus)
    if (el.tabIndex < 0 && el.getAttribute('role') !== 'menuitem') continue
    if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') continue
    seen.add(el)
    out.push(el)
  }
  return out
}

/**
 * Trap Tab / Shift+Tab inside `container` while `active` is true.
 * Restores focus to the previously focused element on deactivate.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null | undefined>,
  active: Ref<boolean>,
  opts?: { restoreFocus?: boolean }
) {
  const restoreFocus = opts?.restoreFocus !== false
  let previouslyFocused: HTMLElement | null = null

  function onKeydown(e: KeyboardEvent) {
    if (!active.value || e.key !== KEYS.TAB) return
    const root = container.value
    if (!root) return
    const nodes = listFocusable(root)
    if (!nodes.length) {
      e.preventDefault()
      return
    }
    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    const current = document.activeElement as HTMLElement | null

    if (e.shiftKey) {
      if (current === first || !root.contains(current)) {
        e.preventDefault()
        last.focus()
      }
    } else if (current === last || !root.contains(current)) {
      e.preventDefault()
      first.focus()
    }
  }

  function activate() {
    previouslyFocused = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', onKeydown, true)
  }

  function deactivate() {
    document.removeEventListener('keydown', onKeydown, true)
    if (restoreFocus) previouslyFocused?.focus?.()
    previouslyFocused = null
  }

  watch(
    active,
    (on) => {
      if (on) activate()
      else deactivate()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    deactivate()
  })
}
