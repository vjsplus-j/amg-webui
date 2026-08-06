<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import InputText from '../InputText/index.vue'
import Button from '../Button/index.vue'
import type { SmsCodeProps, SmsCodeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<SmsCodeProps>(), {
  modelValue: '',
  countdown: 60,
  length: 6,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<SmsCodeEmits>()
const { t } = useLocale()

const remaining = ref(0)
const hasSent = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const countdownActive = computed(() => remaining.value > 0)

const canSend = computed(
  () => remaining.value <= 0 && !props.disabled && !props.loading
)

const sendLabel = computed(() => {
  if (remaining.value > 0) {
    return t(LocaleKeys.auth.resendIn, { n: remaining.value })
  }
  return hasSent.value
    ? t(LocaleKeys.auth.resendCode)
    : t(LocaleKeys.auth.sendCode)
})

const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const startCountdown = () => {
  clearTimer()
  remaining.value = props.countdown
  timer = setInterval(() => {
    remaining.value -= 1
    emit('countdown', Math.max(0, remaining.value))
    if (remaining.value <= 0) clearTimer()
  }, 1000)
}

const onSend = async () => {
  if (!canSend.value) return
  try {
    const allowed = await props.beforeSend?.()
    if (allowed === false) return
    emit('send')
    hasSent.value = true
    startCountdown()
    trackEmit({ component: 'SmsCode', type: 'send', trackId: props.trackId, telemetry: props.telemetry })
  } catch (error) {
    emit('send-error', error)
  }
}

const onInput = (val: string) => {
  const digits = val.replace(/\D/g, '').slice(0, props.length)
  emit('update:modelValue', digits)
  emit('change', digits)
  if (digits.length === props.length) {
    emit('complete', digits)
    trackEmit({
      component: 'SmsCode',
      type: 'complete',
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { length: props.length }
    })
  }
}

onUnmounted(clearTimer)
</script>

<template>
  <div
    :class="[
      'vp-sms-code',
      props.class,
      { 'vp-sms-code--disabled': disabled, 'vp-sms-code--countdown': countdownActive }
    ]"
    :style="style"
    data-component="SmsCode"
    role="group"
    :aria-label="ariaLabel"
    :aria-invalid="invalid || undefined"
  >
    <InputText
      class="vp-sms-code__input"
      :model-value="modelValue"
      :disabled="disabled"
      :maxlength="length"
      type="tel"
      :placeholder="t(LocaleKeys.auth.verifyCode)"
      @update:model-value="onInput"
    />
    <Button
      class="vp-sms-code__send"
      variant="outlined"
      size="md"
      :label="sendLabel"
      :disabled="!canSend"
      :loading="loading"
      @click="onSend"
    />
  </div>
</template>
