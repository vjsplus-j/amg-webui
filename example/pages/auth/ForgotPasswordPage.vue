<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BizForgotPassword, type BizForgotPasswordPayload } from '@amg-webui/components/business'
import { ToastService } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'

const router = useRouter()
const { t } = useLocale()
const isLoading = ref(false)

const handleSubmit = async (payload: BizForgotPasswordPayload) => {
  if (payload.password !== payload.confirmPassword) {
    ToastService.warn({
      summary: t(LocaleKeys.error.validation),
      detail: t(LocaleKeys.error.passwordMismatch)
    })
    return
  }
  isLoading.value = true
  await new Promise((r) => setTimeout(r, 400))
  isLoading.value = false
  ToastService.success({
    summary: t(LocaleKeys.common.success),
    detail: t(LocaleKeys.auth.resetSuccess)
  })
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="forgot-page">
    <BizForgotPassword
      :loading="isLoading"
      captcha-mode="checkbox"
      @submit="handleSubmit"
      @login="router.push({ name: 'login' })"
      @send-code="
        ToastService.info({
          summary: t(LocaleKeys.auth.sendCode),
          detail: t(LocaleKeys.auth.forgotPassword)
        })
      "
    />
  </div>
</template>

<style scoped>
.forgot-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: var(--surface-0);
}
</style>
