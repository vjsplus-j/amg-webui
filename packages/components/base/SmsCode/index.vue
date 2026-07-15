<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import InputText from '../InputText/index.vue'
import Button from '../Button/index.vue'
import type { SmsCodeProps, SmsCodeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<SmsCodeProps>(), {
  modelValue: '',
  countdown: 60
})

const emit = defineEmits<SmsCodeEmits>()
const { t } = useLocale()

const remaining = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const canSend = computed(() => remaining.value <= 0 && !props.disabled)

const sendLabel = computed(() => {
  if (remaining.value > 0) {
    return t(LocaleKeys.auth.resendIn, { sec: remaining.value })
  }
  return t(LocaleKeys.auth.sendCode)
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
    if (remaining.value <= 0) clearTimer()
  }, 1000)
}

const onSend = () => {
  if (!canSend.value) return
  emit('send')
  startCountdown()
}

const onInput = (val: string) => {
  emit('update:modelValue', val)
  emit('change', val)
}

onUnmounted(clearTimer)
</script>

<template>
  <div :class="['vp-sms-code', props.class]" :style="style" data-component="SmsCode">
    <InputText
      class="vp-sms-code__input"
      :model-value="modelValue"
      :disabled="disabled"
      :maxlength="6"
      :placeholder="t(LocaleKeys.auth.verifyCode)"
      @update:model-value="onInput"
    />
    <Button
      class="vp-sms-code__send"
      variant="outlined"
      size="md"
      :label="sendLabel"
      :disabled="!canSend"
      @click="onSend"
    />
  </div>
</template>
