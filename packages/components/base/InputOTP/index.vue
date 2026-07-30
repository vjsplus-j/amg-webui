<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { InputOTPProps, InputOTPEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<InputOTPProps>(), {
  modelValue: '',
  length: 6,
  disabled: false,
  readonly: false,
  mask: false,
  autofocus: false,
  type: 'text',
  size: 'md',
  invalid: false,
  telemetry: undefined
})

const emit = defineEmits<InputOTPEmits>()
const { t } = useLocale()

const cellRefs = ref<(HTMLInputElement | null)[]>([])

const digits = computed(() => {
  const chars = (props.modelValue ?? '').split('')
  return Array.from({ length: props.length }, (_, i) => chars[i] ?? '')
})

const rootClass = computed(() => [
  'vp-input-otp',
  `vp-input-otp--size-${props.size}`,
  {
    'vp-input-otp--disabled': props.disabled,
    'vp-input-otp--invalid': props.invalid
  },
  props.class
])

const sanitizeChar = (char: string) => {
  if (props.type === 'number') {
    return char.replace(/\D/g, '')
  }
  return char.slice(0, 1)
}

const emitValue = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  if (value.length === props.length) {
    emit('complete', value)
    trackEmit({
      component: 'InputOTP',
      type: 'complete',
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { length: props.length }
    })
  }
}

const focusCell = (index: number) => {
  nextTick(() => {
    const el = cellRefs.value[index]
    el?.focus()
    el?.select()
  })
}

const setCellRef = (el: unknown, index: number) => {
  cellRefs.value[index] = (el as HTMLInputElement | null) ?? null
}

const buildValue = (chars: string[]) => chars.join('').slice(0, props.length)

const onCellInput = (event: Event, index: number) => {
  if (props.disabled || props.readonly) return

  const target = event.target as HTMLInputElement
  const raw = sanitizeChar(target.value)
  const next = [...digits.value]
  next[index] = raw
  const value = buildValue(next)
  emitValue(value)

  if (raw && index < props.length - 1) {
    focusCell(index + 1)
  }
}

const onCellKeydown = (event: KeyboardEvent, index: number) => {
  if (props.disabled || props.readonly) return

  if (event.key === 'Backspace') {
    const next = [...digits.value]
    if (next[index]) {
      next[index] = ''
      emitValue(buildValue(next))
    } else if (index > 0) {
      next[index - 1] = ''
      emitValue(buildValue(next))
      focusCell(index - 1)
    }
    event.preventDefault()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    focusCell(index - 1)
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    event.preventDefault()
    focusCell(index + 1)
  }
}

const onPaste = (event: ClipboardEvent) => {
  if (props.disabled || props.readonly) return
  event.preventDefault()

  const pasted = event.clipboardData?.getData('text') ?? ''
  const chars = pasted
    .split('')
    .map((c) => sanitizeChar(c))
    .filter(Boolean)
    .slice(0, props.length)

  if (!chars.length) return

  const next = Array.from({ length: props.length }, (_, i) => chars[i] ?? '')
  emitValue(buildValue(next))
  focusCell(Math.min(chars.length, props.length - 1))
}

onMounted(() => {
  if (props.autofocus && !props.disabled) {
    focusCell(0)
  }
})

watch(
  () => props.length,
  () => {
    cellRefs.value = []
  }
)
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    role="group"
    :aria-label="t(LocaleKeys.component.inputOtp.aria)"
    data-component="InputOTP"
  >
    <input
      v-for="(_, index) in length"
      :key="index"
      :ref="(el) => setCellRef(el, index)"
      class="vp-input-otp__cell"
      :type="mask ? 'password' : 'text'"
      :inputmode="type === 'number' ? 'numeric' : 'text'"
      maxlength="1"
      autocomplete="one-time-code"
      :value="digits[index]"
      :disabled="disabled"
      :readonly="readonly"
      :aria-label="t(LocaleKeys.component.inputOtp.digit, { n: index + 1 })"
      @input="onCellInput($event, index)"
      @keydown="onCellKeydown($event, index)"
      @paste="onPaste"
    />
  </div>
</template>
