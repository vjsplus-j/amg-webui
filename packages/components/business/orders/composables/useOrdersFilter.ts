import { computed, ref } from 'vue'
import type { BizOrder, BizOrderStatus } from '../types'

export function useOrdersFilter(orders: () => BizOrder[]) {
  const keyword = ref('')
  const status = ref<BizOrderStatus | ''>('')

  const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    return orders().filter((o) => {
      const hitKw =
        !kw ||
        o.orderNo.toLowerCase().includes(kw) ||
        o.customer.toLowerCase().includes(kw)
      const hitStatus = !status.value || o.status === status.value
      return hitKw && hitStatus
    })
  })

  const stats = computed(() => {
    const list = orders()
    return {
      total: list.length,
      pending: list.filter((o) => o.status === 'pending').length,
      paid: list.filter((o) => o.status === 'paid').length,
      amount: list.reduce((s, o) => s + o.amount, 0)
    }
  })

  return { keyword, status, filtered, stats }
}
