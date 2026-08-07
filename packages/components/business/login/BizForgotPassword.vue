<script setup lang="ts">
import { computed } from 'vue'
import { Button, Card } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { Message } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizForgotPasswordEmits, BizForgotPasswordProps } from './types'
import { useForgotPasswordForm } from './composables/useForgotPasswordForm'
import './style.scss'
import BizVerifyCode from './BizVerifyCode.vue'
import BizCaptcha from './BizCaptcha.vue'

const props = withDefaults(defineProps<BizForgotPasswordProps>(), {
  title: undefined,
  subtitle: undefined,
  loading: false,
  showCaptcha: true,
  captchaMode: 'checkbox',
  codeCooldown: 60
})

const emit = defineEmits<BizForgotPasswordEmits>()
const { t } = useLocale()

const {
  account,
  code,
  password,
  confirmPassword,
  captchaToken,
  error,
  validate,
  toPayload
} = useForgotPasswordForm()

const displayTitle = computed(() => props.title ?? t(LocaleKeys.auth.forgotPassword))
const displaySubtitle = computed(() => props.subtitle ?? t(LocaleKeys.auth.forgotSubtitle))

function onSubmit() {
  if (!validate(props.showCaptcha)) return
  emit('submit', toPayload())
}

function onSendCode() {
  if (!account.value.trim()) {
    error.value = t(LocaleKeys.auth.sendCodeNeedAccount)
    return
  }
  if (props.showCaptcha && !captchaToken.value) {
    error.value = t(LocaleKeys.auth.captchaFirst)
    return
  }
  error.value = ''
  emit('send-code')
}
</script>

<template>
  <div class="biz-login biz-forgot">
    <Card class="biz-login__card">
      <header class="biz-login__head">
        <h1 class="biz-login__title">{{ displayTitle }}</h1>
        <p class="biz-login__sub">{{ displaySubtitle }}</p>
      </header>

      <form class="biz-login__form" @submit.prevent="onSubmit">
        <Message v-if="error" severity="danger" :closable="false">{{ error }}</Message>

        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.account) }}</span>
          <InputText
            v-model="account"
            placeholder="username / email"
            autocomplete="username"
            fluid
          />
        </label>

        <BizCaptcha
          v-if="showCaptcha"
          v-model="captchaToken"
          :mode="captchaMode"
        />

        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.verifyCode) }}</span>
          <BizVerifyCode
            v-model="code"
            :cooldown="codeCooldown"
            @send="onSendCode"
          />
        </label>

        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.newPassword) }}</span>
          <InputText
            v-model="password"
            type="password"
            :placeholder="t(LocaleKeys.auth.minPassword)"
            autocomplete="new-password"
            fluid
          />
        </label>
        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.confirmNewPassword) }}</span>
          <InputText
            v-model="confirmPassword"
            type="password"
            :placeholder="t(LocaleKeys.auth.reenterNewPassword)"
            autocomplete="new-password"
            fluid
          />
        </label>

        <Button
          type="submit"
          severity="primary"
          variant="solid"
          :loading="loading"
          class="biz-login__submit"
        >
          {{ t(LocaleKeys.auth.resetPassword) }}
        </Button>
      </form>

      <footer class="biz-login__foot">
        {{ t(LocaleKeys.auth.rememberPassword) }}
        <button type="button" class="biz-login__link" @click="emit('login')">
          {{ t(LocaleKeys.auth.backToLogin) }}
        </button>
      </footer>
    </Card>
  </div>
</template>
