import { computed, ref } from 'vue'
import type { BizUser } from '../types'

export function useUsersTable(users: () => BizUser[]) {
  const keyword = ref('')
  const role = ref('')

  const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    return users().filter((u) => {
      const hitKw =
        !kw ||
        u.name.toLowerCase().includes(kw) ||
        u.email.toLowerCase().includes(kw)
      const hitRole = !role.value || u.role === role.value
      return hitKw && hitRole
    })
  })

  return { keyword, role, filtered }
}
