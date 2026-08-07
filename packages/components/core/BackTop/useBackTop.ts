import { ref, onMounted, onUnmounted, computed, watch, type Ref } from 'vue'
import { throttle } from '@amg-webui/utils'
import { getDocument, getWindow, isClient } from '@amg-webui/utils/env'
import type { BackTopProps } from './types'

const DEFAULT_VISIBILITY_HEIGHT = 200

function resolveTarget(container?: string | HTMLElement): Window | HTMLElement | null {
  const win = getWindow()
  if (!win) return null
  if (!container) return win
  if (typeof container === 'string') {
    return (getDocument()?.querySelector(container) as HTMLElement | null) ?? win
  }
  return container
}

function readScrollTop(target: Window | HTMLElement): number {
  const win = getWindow()
  if (win && target === win) {
    return win.scrollY || getDocument()?.documentElement.scrollTop || 0
  }
  return (target as HTMLElement).scrollTop
}

export function useBackTop(props: BackTopProps) {
  const visible = ref(false)
  const threshold = computed(() => props.visibilityHeight ?? DEFAULT_VISIBILITY_HEIGHT)
  const targetRef: Ref<Window | HTMLElement | null> = ref(null)

  const handleScroll = () => {
    const target = targetRef.value
    if (!target) return
    visible.value = readScrollTop(target) >= threshold.value
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
    const win = getWindow()
    if (!target || !win) return
    if (target === win) {
      win.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    ;(target as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    if (!isClient) return
    targetRef.value = resolveTarget(props.container)
    handleScroll()
    if (targetRef.value) bind(targetRef.value)
  })

  watch(
    () => props.container,
    () => {
      if (!isClient) return
      if (targetRef.value) unbind(targetRef.value)
      targetRef.value = resolveTarget(props.container)
      handleScroll()
      if (targetRef.value) bind(targetRef.value)
    }
  )

  onUnmounted(() => {
    if (targetRef.value) unbind(targetRef.value)
  })

  return { visible, scrollToTop }
}
