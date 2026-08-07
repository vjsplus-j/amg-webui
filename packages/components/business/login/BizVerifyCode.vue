<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizVerifyCodeEmits, BizVerifyCodeProps } from './types'
import { useVerifyCode } from './composables/useVerifyCode'

const props = withDefaults(defineProps<BizVerifyCodeProps>(), {
  modelValue: '',
  placeholder: undefined,
  sendLabel: undefined,
  cooldown: 60,
  loading: false,
  disabled: false,
  sending: false
})

const emit = defineEmits<BizVerifyCodeEmits>()
const { t } = useLocale()
const { remain, startCooldown } = useVerifyCode({ cooldown: props.cooldown })

const code = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v)
})

const displayPlaceholder = computed(() => props.placeholder ?? t(LocaleKeys.auth.verifyCode))
const displaySendLabel = computed(() => props.sendLabel ?? t(LocaleKeys.auth.sendCode))

const sendText = computed(() =>
  remain.value > 0
    ? t(LocaleKeys.auth.resendIn, { n: remain.value })
    : displaySendLabel.value
)

function onSend() {
  if (props.disabled || props.sending || remain.value > 0) return
  emit('send')
  startCooldown(props.cooldown)
}
</script>

<template>
  <div class="biz-verify">
    <InputText
      v-model="code"
      class="biz-verify__input"
      :placeholder="displayPlaceholder"
      :disabled="disabled"
      autocomplete="one-time-code"
      fluid
    />
    <Button
      type="button"
      severity="secondary"
      variant="outlined"
      class="biz-verify__send"
      :disabled="disabled || sending || remain > 0"
      :loading="sending"
      @click="onSend"
    >
      {{ sendText }}
    </Button>
  </div>
</template>
