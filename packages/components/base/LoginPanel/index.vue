<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Form from '../Form/index.vue'
import FormItem from '../FormItem/index.vue'
import InputText from '../InputText/index.vue'
import Checkbox from '../Checkbox/index.vue'
import Button from '../Button/index.vue'
import InputCaptcha from '../InputCaptcha/index.vue'
import type { LoginPanelProps, LoginPanelEmits, LoginFormModel } from './types'
import './style.scss'

const props = withDefaults(defineProps<LoginPanelProps>(), {
  modelValue: () => ({ username: '', password: '', remember: false, captcha: '' }),
  loading: false
})

const emit = defineEmits<LoginPanelEmits>()
const { t } = useLocale()

const form = computed(() => props.modelValue ?? {})

const patch = (next: Partial<LoginFormModel>) => {
  const value = { ...form.value, ...next }
  emit('update:modelValue', value)
}

const onSubmit = () => {
  emit('submit', form.value)
}
</script>

<template>
  <div :class="['vp-login-panel', props.class]" :style="style" data-component="LoginPanel">
    <header class="vp-login-panel__header">
      <h2 class="vp-login-panel__title">{{ t(LocaleKeys.page.loginTitle) }}</h2>
      <p class="vp-login-panel__subtitle">{{ t(LocaleKeys.auth.loginSubtitle) }}</p>
    </header>
    <Form :model="form as Record<string, unknown>" class="vp-login-panel__form" @submit="onSubmit">
      <FormItem :label="t(LocaleKeys.auth.username)" prop="username" required>
        <InputText
          :model-value="form.username ?? ''"
          :disabled="disabled || loading"
          @update:model-value="(v) => patch({ username: v })"
        />
      </FormItem>
      <FormItem :label="t(LocaleKeys.auth.password)" prop="password" required>
        <InputText
          type="password"
          :model-value="form.password ?? ''"
          :disabled="disabled || loading"
          @update:model-value="(v) => patch({ password: v })"
        />
      </FormItem>
      <FormItem :label="t(LocaleKeys.auth.captcha)" prop="captcha">
        <InputCaptcha
          :model-value="form.captcha ?? ''"
          :disabled="disabled || loading"
          @update:model-value="(v) => patch({ captcha: v })"
        />
      </FormItem>
      <Checkbox
        :model-value="!!form.remember"
        :disabled="disabled || loading"
        @update:model-value="(v) => patch({ remember: v })"
      >
        {{ t(LocaleKeys.auth.remember) }}
      </Checkbox>
      <Button
        type="submit"
        class="vp-login-panel__submit"
        :label="loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.button.signIn)"
        :loading="loading"
        :disabled="disabled"
      />
    </Form>
    <slot />
  </div>
</template>
