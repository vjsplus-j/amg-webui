import { onUnmounted, ref } from 'vue'

export function useVerifyCode(options?: { cooldown?: number }) {
  const cooldownSec = options?.cooldown ?? 60
  const remain = ref(0)
  let timer: ReturnType<typeof setInterval> | undefined

  function clear() {
    if (timer) {
      clearInterval(timer)
      timer = undefined
    }
  }

  function startCooldown(seconds = cooldownSec) {
    clear()
    remain.value = seconds
    timer = setInterval(() => {
      remain.value -= 1
      if (remain.value <= 0) {
        remain.value = 0
        clear()
      }
    }, 1000)
  }

  onUnmounted(clear)

  return { remain, startCooldown, clearCooldown: clear }
}
