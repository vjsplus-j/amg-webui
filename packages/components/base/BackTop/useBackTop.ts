import { ref, onMounted, onUnmounted, computed } from 'vue'
import { throttle } from '@amg-webui/utils'
import type { BackTopProps } from './types'

const DEFAULT_VISIBILITY_HEIGHT = 200

export function useBackTop(props: BackTopProps) {
  const visible = ref(false)
  const threshold = computed(() => props.visibilityHeight ?? DEFAULT_VISIBILITY_HEIGHT)

  const handleScroll = () => {
    visible.value = window.scrollY >= threshold.value
  }

  const throttledScroll = throttle(handleScroll, 100)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    handleScroll()
    window.addEventListener('scroll', throttledScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', throttledScroll)
  })

  return { visible, scrollToTop }
}
