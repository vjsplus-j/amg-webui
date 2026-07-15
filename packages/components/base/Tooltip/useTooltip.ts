import { ref, onUnmounted } from 'vue'
import type { TooltipProps } from './types'

export function useTooltip(props: TooltipProps) {
  const visible = ref(false)
  let showTimer: ReturnType<typeof setTimeout> | null = null
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  const clearTimers = () => {
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  const show = () => {
    if (props.disabled) return
    clearTimers()
    const delay = props.delay ?? 0
    if (delay > 0) {
      showTimer = setTimeout(() => {
        visible.value = true
      }, delay)
    } else {
      visible.value = true
    }
  }

  const hide = () => {
    clearTimers()
    hideTimer = setTimeout(() => {
      visible.value = false
    }, 100)
  }

  onUnmounted(clearTimers)

  return { visible, show, hide, clearTimers }
}
