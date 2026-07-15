import { computed, ref } from 'vue'
import type { BizContentItem, BizContentStatus } from '../types'

export function useContentList(items: () => BizContentItem[]) {
  const keyword = ref('')
  const status = ref<BizContentStatus | ''>('')

  const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    return items().filter((it) => {
      const hitKw =
        !kw ||
        it.title.toLowerCase().includes(kw) ||
        it.category.toLowerCase().includes(kw)
      const hitStatus = !status.value || it.status === status.value
      return hitKw && hitStatus
    })
  })

  return { keyword, status, filtered }
}
