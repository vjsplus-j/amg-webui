<script setup lang="ts">
import { computed } from 'vue'
import { Button, Card } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { Message } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizRegisterEmits, BizRegisterProps } from './types'
import { useRegisterForm } from './composables/useRegisterForm'
import { useBizAuth } from './composables/useBizAuth'
import './style.scss'
import BizVerifyCode from './BizVerifyCode.vue'
import BizCaptcha from './BizCaptcha.vue'

const props = withDefaults(defineProps<BizRegisterProps>(), {
  title: undefined,
  subtitle: undefined,
  loading: false,
  showCaptcha: true,
  captchaMode: 'checkbox',
  codeCooldown: 60
})

const emit = defineEmits<BizRegisterEmits>()
const { t } = useLocale()
const auth = useBizAuth({ adapter: () => props.adapter })
const usingAdapter = computed(() => Boolean(props.adapter))
const submitLoading = computed(() => props.loading || auth.loading.value)

const {
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
} = useRegisterForm()

const displayTitle = computed(() => props.title ?? t(LocaleKeys.page.registerTitle))
const displaySubtitle = computed(() => props.subtitle ?? t(LocaleKeys.auth.registerSubtitle))

async function onSubmit() {
  if (!validate(props.showCaptcha)) return
  const payload = toPayload()
  if (usingAdapter.value) {
    const result = await auth.register(payload)
    if (auth.error.value || !result) return
    emit('submit', payload)
    emit('auth-success', result)
    return
  }
  emit('submit', payload)
}

async function onSendCode() {
  if (!email.value.trim() && !phone.value.trim()) {
    error.value = t(LocaleKeys.auth.sendCodeNeedContact)
    return
  }
  if (props.showCaptcha && !captchaToken.value) {
    error.value = t(LocaleKeys.auth.captchaFirst)
    return
  }
  error.value = ''
  if (usingAdapter.value && props.adapter?.sendCode) {
    await auth.sendCode('register', email.value.trim() || phone.value.trim())
    if (auth.error.value) return
  }
  emit('send-code')
}
</script>

<template>
  <div class="biz-login biz-register">
    <Card class="biz-login__card">
      <header class="biz-login__head">
        <h1 class="biz-login__title">{{ displayTitle }}</h1>
        <p class="biz-login__sub">{{ displaySubtitle }}</p>
      </header>

      <form class="biz-login__form" @submit.prevent="onSubmit">
        <Message v-if="error || auth.error.value" severity="danger" :closable="false">
          {{ error || auth.error.value }}
        </Message>

        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.username) }}</span>
          <InputText v-model="username" placeholder="username" autocomplete="username" fluid />
        </label>
        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.email) }}</span>
          <InputText v-model="email" type="email" placeholder="you@company.com" autocomplete="email" fluid />
        </label>
        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.phone) }}</span>
          <InputText
            v-model="phone"
            :placeholder="t(LocaleKeys.common.optional)"
            autocomplete="tel"
            fluid
          />
        </label>
        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.password) }}</span>
          <InputText
            v-model="password"
            type="password"
            :placeholder="t(LocaleKeys.auth.minPassword)"
            autocomplete="new-password"
            fluid
          />
        </label>
        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.confirmPassword) }}</span>
          <InputText
            v-model="confirmPassword"
            type="password"
            :placeholder="t(LocaleKeys.auth.reenterPassword)"
            autocomplete="new-password"
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

        <Button
          type="submit"
          severity="primary"
          variant="solid"
          :loading="submitLoading"
          class="biz-login__submit"
        >
          {{ t(LocaleKeys.auth.register) }}
        </Button>
      </form>

      <footer class="biz-login__foot">
        {{ t(LocaleKeys.auth.hasAccount) }}
        <button type="button" class="biz-login__link" @click="emit('login')">
          {{ t(LocaleKeys.button.signIn) }}
        </button>
      </footer>
    </Card>
  </div>
</template>
