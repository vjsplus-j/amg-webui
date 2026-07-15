import { ref } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import type { BizForgotPasswordPayload } from '../types'

export function useForgotPasswordForm(defaults?: Partial<BizForgotPasswordPayload>) {
  const account = ref(defaults?.account ?? '')
  const code = ref(defaults?.code ?? '')
  const password = ref(defaults?.password ?? '')
  const confirmPassword = ref(defaults?.confirmPassword ?? '')
  const captchaToken = ref(defaults?.captchaToken ?? '')
  const error = ref('')

  function validate(requireCaptcha = false): boolean {
    error.value = ''
    if (!account.value.trim()) {
      error.value = LocaleService.t('auth.sendCodeNeedAccount')
      return false
    }
    if (!code.value.trim()) {
      error.value = LocaleService.t('error.required')
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
    if (requireCaptcha && !captchaToken.value) {
      error.value = LocaleService.t('auth.captchaRequired')
      return false
    }
    return true
  }

  function toPayload(): BizForgotPasswordPayload {
    return {
      account: account.value.trim(),
      code: code.value.trim(),
      password: password.value,
      confirmPassword: confirmPassword.value,
      captchaToken: captchaToken.value
    }
  }

  return {
    account,
    code,
    password,
    confirmPassword,
    captchaToken,
    error,
    validate,
    toPayload
  }
}
