import { ref } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import type { BizRegisterPayload } from '../types'

export function useRegisterForm(defaults?: Partial<BizRegisterPayload>) {
  const username = ref(defaults?.username ?? '')
  const email = ref(defaults?.email ?? '')
  const phone = ref(defaults?.phone ?? '')
  const password = ref(defaults?.password ?? '')
  const confirmPassword = ref(defaults?.confirmPassword ?? '')
  const code = ref(defaults?.code ?? '')
  const captchaToken = ref(defaults?.captchaToken ?? '')
  const error = ref('')

  function validate(requireCaptcha = false): boolean {
    error.value = ''
    if (!username.value.trim()) {
      error.value = LocaleService.t('error.required')
      return false
    }
    if (!email.value.trim() && !phone.value.trim()) {
      error.value = LocaleService.t('auth.sendCodeNeedContact')
      return false
    }
    if (password.value.length < 6) {
      error.value = LocaleService.t('auth.minPassword')
      return false
    }
    if (password.value !== confirmPassword.value) {
      error.value = LocaleService.t('auth.passwordMismatch')
      return false
    }
    if (!code.value.trim()) {
      error.value = LocaleService.t('error.required')
      return false
    }
    if (requireCaptcha && !captchaToken.value) {
      error.value = LocaleService.t('auth.captchaRequired')
      return false
    }
    return true
  }

  function toPayload(): BizRegisterPayload {
    return {
      username: username.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value,
      confirmPassword: confirmPassword.value,
      code: code.value.trim(),
      captchaToken: captchaToken.value
    }
  }

  return {
    username,
    email,
    phone,
    password,
    confirmPassword,
    code,
    captchaToken,
    error,
    validate,
    toPayload
  }
}
