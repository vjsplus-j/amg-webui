import { ref, computed, type Ref } from 'vue'

const ITEM_HEIGHT = 36
const OVERSCAN = 4

export function useVirtualWindow<T>(
  items: Ref<T[]>,
  containerHeight = 280
) {
  const scrollTop = ref(0)
  const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT) + OVERSCAN

  const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - OVERSCAN)
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

  const totalHeight = computed(() => items.value.length * ITEM_HEIGHT)
  const offsetY = computed(() => startIndex.value * ITEM_HEIGHT)

  function onScroll(event: Event) {
    scrollTop.value = (event.target as HTMLElement).scrollTop
  }

  return {
    ITEM_HEIGHT,
    visibleItems,
    totalHeight,
    offsetY,
    onScroll
  }
}
