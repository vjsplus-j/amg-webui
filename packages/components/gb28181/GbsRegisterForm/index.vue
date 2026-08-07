<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsRegisterFormProps, GbsRegister } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsRegisterFormProps>(), {
  modelValue: () => ({
    deviceId: '34020000001320000001',
    sipDomain: '3402000000',
    expires: 3600,
    password: ''
  }),
  disabled: false,
  readonly: false,
  compact: false,
  showPassword: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: GbsRegister): void
  (e: 'register', v: GbsRegister): void
  (e: 'reset'): void
}>()
const { t } = useLocale()
const form = ref<GbsRegister>({ ...props.modelValue! })
const revealPassword = ref(props.showPassword)

watch(
  () => props.modelValue,
  (v) => {
    if (v) form.value = { ...v }
  },
  { deep: true }
)

const rootClass = computed(() => [
  'vp-gbs-register-form',
  'vp-gbs-register-form__panel',
  {
    'vp-gbs-register-form--compact': props.compact,
    'vp-gbs-register-form--disabled': props.disabled
  },
  props.class
])

function patch<K extends keyof GbsRegister>(k: K, e: Event) {
  if (props.readonly || props.disabled) return
  const raw = (e.target as HTMLInputElement).value
  form.value[k] = (k === 'expires' ? Number(raw) : raw) as GbsRegister[K]
  emit('update:modelValue', { ...form.value })
}

function submit() {
  if (props.disabled) return
  emit('register', { ...form.value })
}

function reset() {
  if (props.disabled || props.readonly) return
  form.value = { ...props.modelValue! }
  emit('update:modelValue', { ...form.value })
  emit('reset')
}

function togglePassword() {
  revealPassword.value = !revealPassword.value
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <form
    :class="rootClass"
    :style="style"
    data-component="GbsRegisterForm"
    :aria-disabled="disabled || undefined"
    @submit.prevent="submit"
    @reset.prevent="reset"
  >
    <fieldset class="vp-gbs-register-form__fieldset" :disabled="disabled">
      <legend class="vp-gbs-register-form__title">{{ t('industry.gbs.register') }}</legend>
      <label class="vp-gbs-register-form__field">
        <span class="vp-gbs-register-form__label">{{ t('industry.gbs.deviceId') }}</span>
        <input
          class="vp-gbs-register-form__input"
          :value="form.deviceId"
          :disabled="disabled"
          :readonly="readonly"
          autocomplete="off"
          @input="patch('deviceId', $event)"
        />
      </label>
      <label class="vp-gbs-register-form__field">
        <span class="vp-gbs-register-form__label">{{ t('industry.gbs.sipDomain') }}</span>
        <input
          class="vp-gbs-register-form__input"
          :value="form.sipDomain"
          :disabled="disabled"
          :readonly="readonly"
          @input="patch('sipDomain', $event)"
        />
      </label>
      <label class="vp-gbs-register-form__field">
        <span class="vp-gbs-register-form__label">{{ t('industry.gbs.expires') }}</span>
        <input
          class="vp-gbs-register-form__input"
          type="number"
          min="60"
          :value="form.expires"
          :disabled="disabled"
          :readonly="readonly"
          @input="patch('expires', $event)"
        />
      </label>
      <label class="vp-gbs-register-form__field">
        <span class="vp-gbs-register-form__label">{{ t('industry.gbs.password') }}</span>
        <div class="vp-gbs-register-form__password">
          <input
            class="vp-gbs-register-form__input"
            :type="revealPassword ? 'text' : 'password'"
            :value="form.password"
            :disabled="disabled"
            :readonly="readonly"
            autocomplete="new-password"
            @input="patch('password', $event)"
          />
          <button
            v-if="showPassword"
            type="button"
            class="vp-gbs-register-form__toggle"
            :aria-label="t('component.login-panel.showPassword')"
            :disabled="disabled"
            @click="togglePassword"
          >
            {{ revealPassword ? t('component.login-panel.hidePassword') : t('component.login-panel.showPassword') }}
          </button>
        </div>
      </label>
      <div class="vp-gbs-register-form__actions">
        <button type="submit" class="vp-gbs-register-form__btn" :disabled="disabled">
          {{ t('industry.gbs.register') }}
        </button>
        <button type="reset" class="vp-gbs-register-form__btn vp-gbs-register-form__btn--ghost" :disabled="disabled || readonly">
          {{ t('button.reset') }}
        </button>
      </div>
    </fieldset>
  </form>
</template>
