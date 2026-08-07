<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import Form from '@amg-webui/form/Form/index.vue'
import FormItem from '@amg-webui/form/FormItem/index.vue'
import InputText from '@amg-webui/form/InputText/index.vue'
import Checkbox from '@amg-webui/form/Checkbox/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import Link from '@amg-webui/core/Link/index.vue'
import InputCaptcha from '@amg-webui/form/InputCaptcha/index.vue'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { LoginPanelProps, LoginPanelEmits, LoginFormModel } from './types'
import './style.scss'

const props = withDefaults(defineProps<LoginPanelProps>(), {
  modelValue: () => ({ username: '', password: '', remember: false, captcha: '' }),
  loading: false,
  showCaptcha: true,
  showRemember: true,
  showForgot: true,
  showRegister: true,
  telemetry: undefined
})

const emit = defineEmits<LoginPanelEmits>()
const { t } = useLocale()

const passwordVisible = ref(false)

const form = computed(() => props.modelValue ?? {})

const defaultRules = computed(() => ({
  username: [{ required: true, message: t(LocaleKeys.error.required) }],
  password: [
    { required: true, message: t(LocaleKeys.error.required) },
    { min: 6, message: t(LocaleKeys.error.minLength, { min: 6 }) }
  ],
  ...(props.showCaptcha
    ? { captcha: [{ required: true, message: t(LocaleKeys.error.required) }] }
    : {})
}))

const resolvedRules = computed(() => ({ ...defaultRules.value, ...props.rules }))

const patch = (next: Partial<LoginFormModel>) => {
  emit('update:modelValue', { ...form.value, ...next })
}

function track(type: string) {
  trackEmit({
    component: 'LoginPanel',
    type,
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

const onSubmit = () => {
  track('submit')
  emit('submit', form.value)
}

const onForgot = () => {
  track('forgot-password')
  emit('forgot-password')
}

const onRegister = () => {
  track('register')
  emit('register')
}

const togglePassword = () => {
  passwordVisible.value = !passwordVisible.value
}
</script>

<template>
  <div :class="['vp-login-panel', props.class]" :style="style" data-component="LoginPanel">
    <header class="vp-login-panel__header">
      <slot name="header">
        <h2 class="vp-login-panel__title">{{ t(LocaleKeys.page.loginTitle) }}</h2>
        <p class="vp-login-panel__subtitle">{{ t(LocaleKeys.auth.loginSubtitle) }}</p>
      </slot>
    </header>

    <Form
      :model="form as Record<string, unknown>"
      :rules="resolvedRules"
      class="vp-login-panel__form"
      @submit="onSubmit"
    >
      <FormItem :label="t(LocaleKeys.auth.username)" prop="username" required>
        <InputText
          :model-value="form.username ?? ''"
          :disabled="disabled || loading"
          autocomplete="username"
          @update:model-value="(v) => patch({ username: v })"
        />
      </FormItem>

      <FormItem :label="t(LocaleKeys.auth.password)" prop="password" required>
        <div class="vp-login-panel__password">
          <InputText
            :type="passwordVisible ? 'text' : 'password'"
            :model-value="form.password ?? ''"
            :disabled="disabled || loading"
            autocomplete="current-password"
            class="vp-login-panel__password-input"
            @update:model-value="(v) => patch({ password: v })"
          />
          <button
            type="button"
            class="vp-login-panel__password-toggle"
            :disabled="disabled || loading"
            :aria-label="passwordVisible ? t('component.login-panel.hidePassword') : t('component.login-panel.showPassword')"
            @click="togglePassword"
          >
            <Icon :name="passwordVisible ? 'EyeOff' : 'Eye'" size="sm" />
          </button>
        </div>
      </FormItem>

      <FormItem v-if="showCaptcha" :label="t(LocaleKeys.auth.captcha)" prop="captcha">
        <InputCaptcha
          :model-value="form.captcha ?? ''"
          :disabled="disabled || loading"
          @update:model-value="(v) => patch({ captcha: v })"
        />
      </FormItem>

      <div class="vp-login-panel__meta">
        <Checkbox
          v-if="showRemember"
          :model-value="!!form.remember"
          :disabled="disabled || loading"
          @update:model-value="(v) => patch({ remember: v })"
        >
          {{ t(LocaleKeys.auth.remember) }}
        </Checkbox>
        <div v-if="showForgot || showRegister" class="vp-login-panel__links">
          <slot name="links">
            <Link v-if="showForgot" type="primary" @click="onForgot">{{ t(LocaleKeys.auth.forgotPassword) }}</Link>
            <Link v-if="showRegister" type="primary" @click="onRegister">{{ t(LocaleKeys.auth.register) }}</Link>
          </slot>
        </div>
      </div>

      <Button
        type="submit"
        class="vp-login-panel__submit"
        :label="loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.button.signIn)"
        :loading="loading"
        :disabled="disabled"
      />
    </Form>

    <footer v-if="$slots.footer" class="vp-login-panel__footer">
      <slot name="footer" />
    </footer>

    <slot />
  </div>
</template>
