<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsGatewayFormProps, GbsGateway } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsGatewayFormProps>(), {
  modelValue: () => ({
    gatewayId: '34020000001320000001',
    sipDomain: '3402000000',
    sipPort: 5060,
    password: '',
    realm: '3402000000'
  }),
  disabled: false,
  readonly: false,
  compact: false,
  showPassword: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: GbsGateway): void
  (e: 'submit', v: GbsGateway): void
  (e: 'reset'): void
}>()
const { t } = useLocale()
const form = ref<GbsGateway>({ ...props.modelValue! })
const revealPassword = ref(props.showPassword)

watch(
  () => props.modelValue,
  (v) => {
    if (v) form.value = { ...v }
  },
  { deep: true }
)

const rootClass = computed(() => [
  'vp-gbs-gateway-form',
  'vp-gbs-gateway-form__panel',
  {
    'vp-gbs-gateway-form--compact': props.compact,
    'vp-gbs-gateway-form--disabled': props.disabled
  },
  props.class
])

function patch<K extends keyof GbsGateway>(k: K, e: Event) {
  if (props.readonly || props.disabled) return
  const raw = (e.target as HTMLInputElement).value
  form.value[k] = (k === 'sipPort' ? Number(raw) : raw) as GbsGateway[K]
  emit('update:modelValue', { ...form.value })
}

function submit() {
  if (props.disabled) return
  emit('submit', { ...form.value })
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
    data-component="GbsGatewayForm"
    :aria-disabled="disabled || undefined"
    @submit.prevent="submit"
    @reset.prevent="reset"
  >
    <fieldset class="vp-gbs-gateway-form__fieldset" :disabled="disabled">
      <legend class="vp-gbs-gateway-form__title">{{ t('industry.gbs.gatewayId') }}</legend>
      <label class="vp-gbs-gateway-form__field">
        <span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.gatewayId') }}</span>
        <input
          class="vp-gbs-gateway-form__input"
          :value="form.gatewayId"
          :disabled="disabled"
          :readonly="readonly"
          @input="patch('gatewayId', $event)"
        />
      </label>
      <label class="vp-gbs-gateway-form__field">
        <span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.sipDomain') }}</span>
        <input
          class="vp-gbs-gateway-form__input"
          :value="form.sipDomain"
          :disabled="disabled"
          :readonly="readonly"
          @input="patch('sipDomain', $event)"
        />
      </label>
      <label class="vp-gbs-gateway-form__field">
        <span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.sipPort') }}</span>
        <input
          class="vp-gbs-gateway-form__input"
          type="number"
          min="1"
          max="65535"
          :value="form.sipPort"
          :disabled="disabled"
          :readonly="readonly"
          @input="patch('sipPort', $event)"
        />
      </label>
      <label class="vp-gbs-gateway-form__field">
        <span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.realm') }}</span>
        <input
          class="vp-gbs-gateway-form__input"
          :value="form.realm"
          :disabled="disabled"
          :readonly="readonly"
          @input="patch('realm', $event)"
        />
      </label>
      <label class="vp-gbs-gateway-form__field">
        <span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.password') }}</span>
        <div class="vp-gbs-gateway-form__password">
          <input
            class="vp-gbs-gateway-form__input"
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
            class="vp-gbs-gateway-form__toggle"
            :aria-label="t('component.login-panel.showPassword')"
            :disabled="disabled"
            @click="togglePassword"
          >
            {{ revealPassword ? t('component.login-panel.hidePassword') : t('component.login-panel.showPassword') }}
          </button>
        </div>
      </label>
      <div class="vp-gbs-gateway-form__actions">
        <button type="submit" class="vp-gbs-gateway-form__btn" :disabled="disabled">
          {{ t('button.save') }}
        </button>
        <button type="reset" class="vp-gbs-gateway-form__btn vp-gbs-gateway-form__btn--ghost" :disabled="disabled || readonly">
          {{ t('button.reset') }}
        </button>
      </div>
    </fieldset>
  </form>
</template>
