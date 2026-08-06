<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import InputText from '../InputText/index.vue'
import Button from '../Button/index.vue'
import type { InputCaptchaProps, InputCaptchaEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<InputCaptchaProps>(), {
  modelValue: '',
  length: 4,
  caseSensitive: false,
  refreshDelay: 300,
  showRefreshButton: false
})

const emit = defineEmits<InputCaptchaEmits>()
const { t } = useLocale()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const code = ref('')
let refreshTimer: ReturnType<typeof setTimeout> | null = null

const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const generateCode = () => {
  let next = props.generator?.(props.length) ?? ''
  if (!next) {
    for (let i = 0; i < props.length; i++) {
      next += chars[Math.floor(Math.random() * chars.length)]
    }
  }
  code.value = next.slice(0, props.length)
  drawCaptcha()
  emit('refresh')
  emit('generated', code.value)
}

const drawCaptcha = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--surface-2').trim() || 'transparent'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--ds-border').trim()
    ctx.beginPath()
    ctx.moveTo(Math.random() * w, Math.random() * h)
    ctx.lineTo(Math.random() * w, Math.random() * h)
    ctx.stroke()
  }
  ctx.font = `600 ${Math.floor(h * 0.55)}px var(--font-family-sans)`
  ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--text-primary').trim()
  ctx.textBaseline = 'middle'
  const gap = w / (code.value.length + 1)
  code.value.split('').forEach((ch, i) => {
    const x = gap * (i + 1) - ctx.measureText(ch).width / 2
    const y = h / 2 + (Math.random() - 0.5) * 6
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((Math.random() - 0.5) * 0.4)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  })
}

const refreshDebounced = () => {
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(generateCode, Math.max(0, props.refreshDelay))
}

const onInput = (val: string) => {
  emit('update:modelValue', val)
  emit('change', val)
  if (val.length >= props.length) {
    const valid = props.caseSensitive
      ? val === code.value
      : val.toUpperCase() === code.value.toUpperCase()
    emit('verify', valid)
  }
}

onMounted(generateCode)
onUnmounted(() => {
  if (refreshTimer) clearTimeout(refreshTimer)
})

watch(() => props.length, generateCode)
</script>

<template>
  <div :class="['vp-input-captcha', props.class]" :style="style" data-component="InputCaptcha">
    <InputText
      class="vp-input-captcha__input"
      :model-value="modelValue"
      :disabled="disabled"
      :maxlength="length"
      :aria-label="ariaLabel"
      :placeholder="t(LocaleKeys.auth.captcha)"
      @update:model-value="onInput"
    />
    <button
      type="button"
      class="vp-input-captcha__canvas-wrap"
      :disabled="disabled"
      :title="t(LocaleKeys.auth.captchaRefresh)"
      :aria-label="t(LocaleKeys.auth.captchaRefresh)"
      @click="refreshDebounced"
    >
      <canvas ref="canvasRef" class="vp-input-captcha__canvas" width="120" height="40" />
    </button>
    <Button
      v-if="showRefreshButton"
      variant="outlined"
      size="sm"
      :label="t(LocaleKeys.button.refresh)"
      :disabled="disabled"
      @click="refreshDebounced"
    />
  </div>
</template>
