import { computed } from 'vue'
import type { PaginationProps } from './types'

export function usePagination(props: PaginationProps) {
  const total = computed(() => Math.max(0, props.total ?? 0))
  const pageSize = computed(() => Math.max(1, props.pageSize ?? 10))
  const page = computed(() => Math.max(1, props.page ?? 1))
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

  const rootClass = computed(() => [
    'vp-pagination',
    { 'vp-pagination--disabled': props.disabled },
    props.class
  ])

  const canPrev = computed(() => page.value > 1)
  const canNext = computed(() => page.value < pageCount.value)

  const pageItems = computed(() => {
    const count = pageCount.value
    const current = page.value
    const items: (number | 'ellipsis')[] = []
    if (count <= 7) {
      for (let i = 1; i <= count; i++) items.push(i)
      return items
    }
    items.push(1)
    if (current > 3) items.push('ellipsis')
    const start = Math.max(2, current - 1)
    const end = Math.min(count - 1, current + 1)
    for (let i = start; i <= end; i++) items.push(i)
    if (current < count - 2) items.push('ellipsis')
    items.push(count)
    return items
  })

  return { total, pageSize, page, pageCount, rootClass, canPrev, canNext, pageItems }
}
