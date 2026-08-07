<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { Button, Card, Icon } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { Message } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizLoginEmits, BizLoginProps, BizLoginMode } from './types'
import { useLoginForm } from './composables/useLoginForm'
import { useBizAuth } from './composables/useBizAuth'
import BizCaptcha from './BizCaptcha.vue'
import BizVerifyCode from './BizVerifyCode.vue'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BizLoginProps>(), {
  title: undefined,
  subtitle: undefined,
  loading: false,
  defaultUsername: '',
  showRemember: true,
  showRegister: true,
  showForgot: true,
  showCaptcha: false,
  captchaMode: 'checkbox',
  modes: () => ['password', 'sms', 'qr'],
  defaultMode: 'password'
})

const emit = defineEmits<BizLoginEmits>()
const attrs = useAttrs()
const { t } = useLocale()

const auth = useBizAuth({ adapter: () => props.adapter })
const usingAdapter = computed(() => Boolean(props.adapter))
const submitLoading = computed(() => props.loading || auth.loading.value)

const { username, password, remember, toPayload } = useLoginForm({
  username: props.defaultUsername
})

const mode = ref<BizLoginMode>(props.defaultMode)
const phone = ref('')
const smsCode = ref('')
const captchaToken = ref('')
const error = ref('')

const displayTitle = computed(() => props.title ?? t(LocaleKeys.page.loginTitle))
const displaySubtitle = computed(() => props.subtitle ?? t(LocaleKeys.auth.loginSubtitle))

const modeTabs = computed(() =>
  (props.modes ?? []).map((id) => ({
    id,
    label:
      id === 'password'
        ? t('biz.login.modePassword')
        : id === 'sms'
          ? t('biz.login.modeSms')
          : t('biz.login.modeQr')
  }))
)

function setMode(next: BizLoginMode) {
  mode.value = next
  error.value = ''
  auth.error.value = null
  emit('update:mode', next)
}

async function resolveCaptcha(): Promise<string | undefined> {
  if (props.verifyCaptcha) return props.verifyCaptcha()
  if (props.showCaptcha) return captchaToken.value || undefined
  return undefined
}

async function onSubmit() {
  error.value = ''
  auth.error.value = null
  if (mode.value === 'password') {
    if (!username.value.trim()) {
      error.value = t('biz.login.usernameRequired')
      return
    }
    if (!password.value) {
      error.value = t('biz.login.passwordRequired')
      return
    }
    if (props.showCaptcha && !captchaToken.value && !props.verifyCaptcha) {
      error.value = t(LocaleKeys.auth.captchaRequired)
      return
    }
    const payload = toPayload()
    payload.mode = 'password'
    const token = await resolveCaptcha()
    if (props.showCaptcha || props.verifyCaptcha) {
      if (!token) {
        error.value = t(LocaleKeys.auth.captchaRequired)
        return
      }
      payload.captchaToken = token
    }
    if (usingAdapter.value) {
      const result = await auth.login(payload)
      if (auth.error.value || !result) return
      emit('submit', payload)
      emit('auth-success', result)
      return
    }
    emit('submit', payload)
    return
  }

  if (mode.value === 'sms') {
    if (!phone.value.trim()) {
      error.value = t('biz.login.phoneRequired')
      return
    }
    if (!smsCode.value.trim()) {
      error.value = t('biz.login.codeRequired')
      return
    }
    const payload = {
      username: phone.value.trim(),
      password: '',
      phone: phone.value.trim(),
      code: smsCode.value.trim(),
      mode: 'sms' as const,
      remember: remember.value
    }
    if (usingAdapter.value) {
      const result = await auth.login(payload)
      if (auth.error.value || !result) return
      emit('submit', payload)
      emit('auth-success', result)
      return
    }
    emit('submit', payload)
  }
}

async function onSendCode() {
  if (usingAdapter.value && props.adapter?.sendCode) {
    const target = mode.value === 'sms' ? phone.value.trim() : username.value.trim()
    if (!target) {
      error.value = t('biz.login.phoneRequired')
      return
    }
    await auth.sendCode('login', target)
    if (auth.error.value) return
  }
  emit('send-code')
}
</script>

<template>
  <div class="biz-login" v-bind="attrs">
    <Card class="biz-login__card">
      <header class="biz-login__head">
        <h1 class="biz-login__title">{{ displayTitle }}</h1>
        <p class="biz-login__sub">{{ displaySubtitle }}</p>
      </header>

      <div v-if="modeTabs.length > 1" class="theme-kit-tabs biz-login__modes">
        <button
          v-for="tab in modeTabs"
          :key="tab.id"
          type="button"
          class="theme-kit-tab"
          :class="{ 'is-active': mode === tab.id }"
          @click="setMode(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>

      <form v-if="mode === 'password'" class="biz-login__form" @submit.prevent="onSubmit">
        <Message v-if="error || auth.error.value" severity="danger" :closable="false">
          {{ error || auth.error.value }}
        </Message>

        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.username) }}</span>
          <InputText v-model="username" autocomplete="username" fluid />
        </label>
        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.password) }}</span>
          <InputText
            v-model="password"
            type="password"
            autocomplete="current-password"
            fluid
          />
        </label>

        <BizCaptcha v-if="showCaptcha && !verifyCaptcha" v-model="captchaToken" :mode="captchaMode" />

        <div v-if="showRemember || showForgot" class="biz-login__row">
          <label v-if="showRemember" class="biz-login__check">
            <input v-model="remember" type="checkbox" />
            {{ t(LocaleKeys.auth.remember) }}
          </label>
          <span v-else />
          <button v-if="showForgot" type="button" class="biz-login__link" @click="emit('forgot')">
            {{ t(LocaleKeys.auth.forgotPassword) }}
          </button>
        </div>

        <Button type="submit" severity="primary" variant="solid" :loading="submitLoading" class="biz-login__submit">
          <Icon name="User" size="sm" />
          {{ t(LocaleKeys.button.signIn) }}
        </Button>
      </form>

      <form v-else-if="mode === 'sms'" class="biz-login__form" @submit.prevent="onSubmit">
        <Message v-if="error || auth.error.value" severity="danger" :closable="false">
          {{ error || auth.error.value }}
        </Message>
        <label class="biz-login__field">
          <span>{{ t('biz.login.phone') }}</span>
          <InputText v-model="phone" autocomplete="tel" fluid />
        </label>
        <label class="biz-login__field">
          <span>{{ t('biz.login.smsCode') }}</span>
          <BizVerifyCode v-model="smsCode" @send="onSendCode" />
        </label>
        <Button type="submit" severity="primary" variant="solid" :loading="submitLoading" class="biz-login__submit">
          {{ t(LocaleKeys.button.signIn) }}
        </Button>
      </form>

      <div v-else class="biz-login__alt">
        <slot name="qr">
          <p class="theme-kit-body-lg">{{ t('biz.login.qrPlaceholder') }}</p>
        </slot>
      </div>

      <div class="biz-login__oauth">
        <slot name="oauth">
          <p class="theme-kit-body-lg">{{ t('biz.login.oauthPlaceholder') }}</p>
        </slot>
      </div>

      <footer v-if="showRegister" class="biz-login__foot">
        {{ t(LocaleKeys.auth.noAccount) }}
        <button type="button" class="biz-login__link" @click="emit('register')">
          {{ t(LocaleKeys.auth.register) }}
        </button>
      </footer>
    </Card>
  </div>
</template>
