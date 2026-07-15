import { ref, computed, onUnmounted, getCurrentInstance } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import type { LocaleCode, LocaleMessages } from '@amg-webui/locale'

export function useLocale() {
  const locale = ref<LocaleCode>(LocaleService.getLocale())

  const unsub = LocaleService.subscribe((code) => {
    locale.value = code
  })

  // Clean up when used inside a component setup; no-op in plain scripts
  if (getCurrentInstance()) {
    onUnmounted(() => unsub())
  }

  const messages = computed<LocaleMessages>(() => {
    void locale.value
    return LocaleService.getMessages()
  })

  function t(key: string, params?: Record<string, string | number>, fallback?: string) {
    void locale.value
    return LocaleService.t(key, params, fallback)
  }

  function setLocale(code: LocaleCode) {
    LocaleService.setLocale(code)
  }

  return {
    locale,
    messages,
    t,
    setLocale,
    toggle: LocaleService.toggle
  }
}
