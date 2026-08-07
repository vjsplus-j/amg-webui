import { computed, ref } from 'vue'
import type { BizTenant, BizTenantPlan, BizTenantStatus } from '../types'

export function useTenantsFilter(tenants: () => BizTenant[]) {
  const keyword = ref('')
  const status = ref<BizTenantStatus | ''>('')
  const plan = ref<BizTenantPlan | ''>('')

  const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    return tenants().filter((row) => {
      const hitKw =
        !kw ||
        row.name.toLowerCase().includes(kw) ||
        row.slug.toLowerCase().includes(kw) ||
        (row.domain?.toLowerCase().includes(kw) ?? false)
      const hitStatus = !status.value || row.status === status.value
      const hitPlan = !plan.value || row.plan === plan.value
      return hitKw && hitStatus && hitPlan
    })
  })

  const stats = computed(() => {
    const list = tenants()
    return {
      total: list.length,
      active: list.filter((t) => t.status === 'active').length,
      trial: list.filter((t) => t.status === 'trial').length,
      suspended: list.filter((t) => t.status === 'suspended').length
    }
  })

  return { keyword, status, plan, filtered, stats }
}
