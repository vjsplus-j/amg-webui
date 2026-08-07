import { ref, computed, onUnmounted, getCurrentInstance } from 'vue'
import { isLocaleKey, LocaleService } from '@amg-webui/locale'
import type { LocaleKey, LocaleMessages, TextDirection } from '@amg-webui/locale'

export function useLocale() {
  const locale = ref(LocaleService.getLocale())
  const dir = ref<TextDirection>(LocaleService.getDir())

  const unsub = LocaleService.subscribe((code) => {
    locale.value = code
  })
  const unsubDir = LocaleService.subscribeDir((next) => {
    dir.value = next
  })

  if (getCurrentInstance()) {
    onUnmounted(() => {
      unsub()
      unsubDir()
    })
  }

  const messages = computed<LocaleMessages>(() => {
    void locale.value
    return LocaleService.getMessages()
  })

  function t(key: LocaleKey, params?: Record<string, string | number>, fallback?: string) {
    void locale.value
    return LocaleService.t(key, params, fallback)
  }

  /** Runtime / interpolated keys — unknown keys return fallback or the key itself. */
  function tDyn(key: string, params?: Record<string, string | number>, fallback?: string) {
    void locale.value
    if (!isLocaleKey(key)) return fallback ?? key
    return LocaleService.t(key, params, fallback)
  }

  function setLocale(code: string) {
    LocaleService.setLocale(code)
  }

  function setDirection(next: TextDirection | null) {
    LocaleService.setDirection(next)
  }

  function toggleDirection() {
    return LocaleService.toggleDirection()
  }

  return {
    locale,
    dir,
    messages,
    t,
    tDyn,
    setLocale,
    setDirection,
    toggleDirection,
    toggle: LocaleService.toggle
  }
}
