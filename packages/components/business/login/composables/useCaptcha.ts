import { ref } from 'vue'

export function useCaptcha() {
  const token = ref('')
  const passed = ref(false)
  const progress = ref(0)

  function reset() {
    token.value = ''
    passed.value = false
    progress.value = 0
  }

  function pass(prefix = 'vp-cap') {
    const next = `${prefix}_${Date.now().toString(36)}`
    token.value = next
    passed.value = true
    progress.value = 100
    return next
  }

  return { token, passed, progress, reset, pass }
}
