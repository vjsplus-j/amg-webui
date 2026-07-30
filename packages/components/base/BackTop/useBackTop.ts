import { ref, onMounted, onUnmounted, computed, watch, type Ref } from 'vue'
import { throttle } from '@amg-webui/utils'
import type { BackTopProps } from './types'

const DEFAULT_VISIBILITY_HEIGHT = 200

function resolveTarget(container?: string | HTMLElement): Window | HTMLElement {
  if (!container) return window
  if (typeof container === 'string') {
    return (document.querySelector(container) as HTMLElement | null) ?? window
  }
  return container
}

function readScrollTop(target: Window | HTMLElement): number {
  if (target === window) return window.scrollY || document.documentElement.scrollTop
  return (target as HTMLElement).scrollTop
}

export function useBackTop(props: BackTopProps) {
  const visible = ref(false)
  const threshold = computed(() => props.visibilityHeight ?? DEFAULT_VISIBILITY_HEIGHT)
  const targetRef: Ref<Window | HTMLElement> = ref(window)

  const handleScroll = () => {
    visible.value = readScrollTop(targetRef.value) >= threshold.value
  }

  const throttledScroll = throttle(handleScroll, 100)

  const bind = (target: Window | HTMLElement) => {
    target.addEventListener('scroll', throttledScroll, { passive: true })
  }

  const unbind = (target: Window | HTMLElement) => {
    target.removeEventListener('scroll', throttledScroll)
  }

  const scrollToTop = () => {
    const target = targetRef.value
    if (target === window) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    ;(target as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    targetRef.value = resolveTarget(props.container)
    handleScroll()
    bind(targetRef.value)
  })

  watch(
    () => props.container,
    () => {
      unbind(targetRef.value)
      targetRef.value = resolveTarget(props.container)
      handleScroll()
      bind(targetRef.value)
    }
  )

  onUnmounted(() => {
    unbind(targetRef.value)
  })

  return { visible, scrollToTop }
}
