<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifUrlFormProps, OnvifUrlFormEmits } from './types'
import './style.scss'

const BLOCKED = /^javascript:/i
const props = withDefaults(defineProps<OnvifUrlFormProps>(), {
  modelValue: 'rtsp://192.168.1.101/stream1',
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifUrlFormEmits>()
const { t } = useLocale()
const url = ref(props.modelValue ?? '')
const invalid = computed(() => BLOCKED.test(url.value.trim()))

watch(() => props.modelValue, (v) => { url.value = v ?? '' })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.url))

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  url.value = v
  emit('update:modelValue', v)
}

function test() {
  if (props.disabled || props.loading) return
  if (invalid.value) {
    emit('invalid')
    trackEmit({ component: 'OnvifUrlForm', type: 'invalid', trackId: props.trackId, telemetry: props.telemetry })
    return
  }
  emit('test', url.value.trim())
  trackEmit({ component: 'OnvifUrlForm', type: 'test', trackId: props.trackId, telemetry: props.telemetry })
}

function resetUrl() {
  if (props.disabled || props.loading) return
  url.value = props.modelValue ?? ''
  trackEmit({ component: 'OnvifUrlForm', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-onvif-url-form', 'vp-onvif-url-form__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-url-form-title"
    data-component="OnvifUrlForm"
  >
    <header class="vp-onvif-url-form__header">
      <h3 id="vp-onvif-url-form-title" class="vp-onvif-url-form__title">{{ titleText }}</h3>
      <div class="vp-onvif-url-form__status" role="status" aria-live="polite">
        {{ invalid ? t(LocaleKeys.industry.onvif.invalidProtocol) : t(LocaleKeys.industry.onvif.testConnection) }}
      </div>
    </header>
    <div v-if="loading" class="vp-onvif-url-form__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <form v-else class="vp-onvif-url-form__body" @submit.prevent="test">
      <input class="vp-onvif-url-form__input" type="url" :value="url" :disabled="disabled" :aria-invalid="invalid" @input="onInput" />
      <p v-if="invalid" class="vp-onvif-url-form__error" role="alert">{{ t(LocaleKeys.industry.onvif.invalidProtocol) }}</p>
      <div class="vp-onvif-url-form__toolbar">
        <button type="submit" class="vp-onvif-url-form__btn" :disabled="disabled || invalid">{{ t(LocaleKeys.industry.onvif.testConnection) }}</button>
        <button type="button" class="vp-onvif-url-form__btn vp-onvif-url-form__btn--ghost" :disabled="disabled" @click="resetUrl">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </form>
  </section>
</template>
