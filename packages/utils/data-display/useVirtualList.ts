import { computed, onUnmounted, ref, type Ref } from 'vue'

const DEFAULT_ITEM_HEIGHT = 36
const DEFAULT_OVERSCAN = 6

export function useVirtualList<T>(
  items: Ref<T[]>,
  options?: { itemHeight?: number; containerHeight?: number; overscan?: number }
) {
  const itemHeight = options?.itemHeight ?? DEFAULT_ITEM_HEIGHT
  const containerHeight = options?.containerHeight ?? 280
  const overscan = options?.overscan ?? DEFAULT_OVERSCAN
  const scrollTop = ref(0)
  let rafId = 0

  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2

  const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan)
  )

  const endIndex = computed(() =>
    Math.min(items.value.length, startIndex.value + visibleCount)
  )

  const visibleItems = computed(() =>
    items.value.slice(startIndex.value, endIndex.value).map((item, i) => ({
      item,
      index: startIndex.value + i
    }))
  )

  const totalHeight = computed(() => items.value.length * itemHeight)
  const offsetY = computed(() => startIndex.value * itemHeight)

  function onScroll(event: Event) {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      scrollTop.value = (event.target as HTMLElement).scrollTop
      rafId = 0
    })
  }

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
  })

  return {
    itemHeight,
    visibleItems,
    totalHeight,
    offsetY,
    onScroll
  }
}
