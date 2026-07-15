import { ref } from 'vue'
import type { BizLoginCredentials } from '../types'

export function useLoginForm(defaults?: Partial<BizLoginCredentials>) {
  const username = ref(defaults?.username ?? '')
  const password = ref(defaults?.password ?? '')
  const remember = ref(defaults?.remember ?? false)

  function toPayload(): BizLoginCredentials {
    return {
      username: username.value.trim(),
      password: password.value,
      remember: remember.value
    }
  }

  function reset() {
    username.value = defaults?.username ?? ''
    password.value = defaults?.password ?? ''
    remember.value = defaults?.remember ?? false
  }

  return { username, password, remember, toPayload, reset }
}
