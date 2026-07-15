<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BizRegister, type BizRegisterPayload } from '@amg-webui/components/business'
import { ToastService } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { useAuth } from '../../stores/auth'

const router = useRouter()
const { register } = useAuth()
const { t } = useLocale()
const isLoading = ref(false)

const handleSubmit = async (payload: BizRegisterPayload) => {
  if (payload.password.length < 6) {
    ToastService.warn({
      summary: t(LocaleKeys.error.validation),
      detail: t(LocaleKeys.error.minLength, { min: 6 })
    })
    return
  }
  if (payload.password !== payload.confirmPassword) {
    ToastService.warn({
      summary: t(LocaleKeys.error.validation),
      detail: t(LocaleKeys.error.passwordMismatch)
    })
    return
  }

  isLoading.value = true
  const success = await register(payload.username, payload.email || payload.phone, payload.password)
  isLoading.value = false

  if (success) {
    ToastService.success({
      summary: t(LocaleKeys.common.success),
      detail: t(LocaleKeys.auth.registerSuccess)
    })
    router.replace({ name: 'dashboard' })
  } else {
    ToastService.error({
      summary: t(LocaleKeys.error.validation),
      detail: t(LocaleKeys.auth.userExists)
    })
  }
}
</script>

<template>
  <div class="register-page">
    <BizRegister
      :loading="isLoading"
      captcha-mode="slider"
      @submit="handleSubmit"
      @login="router.push({ name: 'login' })"
      @send-code="
        ToastService.info({
          summary: t(LocaleKeys.auth.sendCode),
          detail: t(LocaleKeys.auth.register)
        })
      "
    />
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: var(--surface-0);
}
</style>
