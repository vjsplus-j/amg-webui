<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, InputText, Card, Message, Icon } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizLoginEmits, BizLoginProps } from './types'
import { useLoginForm } from './composables/useLoginForm'
import BizCaptcha from './BizCaptcha.vue'
import './style.scss'

const props = withDefaults(defineProps<BizLoginProps>(), {
  title: undefined,
  subtitle: undefined,
  loading: false,
  defaultUsername: '',
  showRemember: true,
  showRegister: true,
  showForgot: true,
  showCaptcha: false,
  captchaMode: 'checkbox'
})

const emit = defineEmits<BizLoginEmits>()
const { t } = useLocale()

const { username, password, remember, toPayload } = useLoginForm({
  username: props.defaultUsername
})

const captchaToken = ref('')
const error = ref('')

const displayTitle = computed(() => props.title ?? t(LocaleKeys.page.loginTitle))
const displaySubtitle = computed(() => props.subtitle ?? t(LocaleKeys.auth.loginSubtitle))

function onSubmit() {
  error.value = ''
  if (props.showCaptcha && !captchaToken.value) {
    error.value = t(LocaleKeys.auth.captchaRequired)
    return
  }
  const payload = toPayload()
  if (props.showCaptcha) payload.captchaToken = captchaToken.value
  emit('submit', payload)
}
</script>

<template>
  <div class="biz-login">
    <Card class="biz-login__card">
      <header class="biz-login__head">
        <h1 class="biz-login__title">{{ displayTitle }}</h1>
        <p class="biz-login__sub">{{ displaySubtitle }}</p>
      </header>

      <form class="biz-login__form" @submit.prevent="onSubmit">
        <Message v-if="error" severity="danger" :closable="false">{{ error }}</Message>

        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.username) }}</span>
          <InputText v-model="username" placeholder="username" autocomplete="username" fluid />
        </label>
        <label class="biz-login__field">
          <span>{{ t(LocaleKeys.auth.password) }}</span>
          <InputText
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            fluid
          />
        </label>

        <BizCaptcha
          v-if="showCaptcha"
          v-model="captchaToken"
          :mode="captchaMode"
        />

        <div v-if="showRemember || showForgot" class="biz-login__row">
          <label v-if="showRemember" class="biz-login__check">
            <input v-model="remember" type="checkbox" />
            {{ t(LocaleKeys.auth.remember) }}
          </label>
          <span v-else />
          <button
            v-if="showForgot"
            type="button"
            class="biz-login__link"
            @click="emit('forgot')"
          >
            {{ t(LocaleKeys.auth.forgotPassword) }}？
          </button>
        </div>

        <Button type="submit" severity="primary" variant="solid" :loading="loading" class="biz-login__submit">
          <Icon name="User" size="sm" />
          {{ t(LocaleKeys.button.signIn) }}
        </Button>
      </form>

      <footer v-if="showRegister" class="biz-login__foot">
        {{ t(LocaleKeys.auth.noAccount) }}
        <button type="button" class="biz-login__link" @click="emit('register')">
          {{ t(LocaleKeys.auth.register) }}
        </button>
      </footer>
    </Card>
  </div>
</template>
