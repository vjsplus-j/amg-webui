<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { generateQrcodeSvg } from '@amg-webui/utils'
import type { QrcodeProps, QrcodeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<QrcodeProps>(), {
  modelValue: '',
  value: '',
  pixelSize: 4,
  standard: 'iso',
  quietZone: 8,
  editable: true,
  loading: false,
  disabled: false
})

const emit = defineEmits<QrcodeEmits>()
const { t } = useLocale()

function normalizeText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

const text = computed(() => normalizeText(props.modelValue) || normalizeText(props.value))

const renderResult = computed(() => {
  if (!text.value) return { svg: '', error: '' }
  try {
    return {
      svg: generateQrcodeSvg({
        text: text.value,
        standard: props.standard,
        errorCorrection: props.errorCorrection,
        pixelSize: props.pixelSize,
        quietZone: props.quietZone
      }),
      error: ''
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { svg: '', error: message }
  }
})

const svgHtml = computed(() => renderResult.value.svg)
const hasError = computed(() => Boolean(renderResult.value.error))

watch(
  () => renderResult.value.error,
  (message, previous) => {
    if (message && message !== previous) {
      emit('error', { standard: props.standard, value: text.value, message })
    }
  },
  { immediate: true }
)

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <div
    :class="['vp-qrcode', { 'vp-qrcode--disabled': disabled, 'vp-qrcode--loading': loading }, props.class]"
    :style="style"
    data-component="Qrcode"
  >
    <div class="vp-qrcode__body">
      <input
        v-if="editable"
        class="vp-qrcode__input"
        type="text"
        :disabled="disabled || loading"
        :value="text"
        :placeholder="t('common.search')"
        :aria-label="t('component.qrcode.title')"
        @input="onInput"
      />
      <div
        v-if="svgHtml"
        class="vp-qrcode__matrix"
        role="img"
        :aria-label="ariaLabel || t('component.qrcode.image', { standard, value: text })"
      >
        <div class="vp-qrcode__canvas" v-html="svgHtml" />
      </div>
      <p v-else-if="hasError" class="vp-qrcode__error" role="alert">
        {{ t('component.qrcode.invalid', { standard }) }}
      </p>
      <p v-else class="vp-qrcode__muted">{{ t('component.qrcode.lead') }}</p>
    </div>
  </div>
</template>
