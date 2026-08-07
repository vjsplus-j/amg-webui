<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { generateBarcodeSvg } from '@amg-webui/utils'
import type { BarcodeProps, BarcodeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<BarcodeProps>(), {
  modelValue: '',
  value: '',
  barWidth: 2,
  height: 48,
  showLabel: true,
  format: 'code128',
  editable: true,
  quietZone: 10,
  loading: false,
  disabled: false
})

const emit = defineEmits<BarcodeEmits>()
const { t } = useLocale()

function normalizeText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

const text = computed(() => normalizeText(props.modelValue) || normalizeText(props.value))

const renderResult = computed(() => {
  if (!text.value) return { svg: '', error: '' }
  try {
    return {
      svg: generateBarcodeSvg({
        text: text.value,
        format: props.format,
        barWidth: props.barWidth,
        height: props.height,
        showLabel: props.showLabel,
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
      emit('error', { format: props.format, value: text.value, message })
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
    :class="['vp-barcode', { 'vp-barcode--disabled': disabled }, props.class]"
    :style="style"
    data-component="Barcode"
  >
    <input
      v-if="editable"
      class="vp-barcode__input"
      type="text"
      :disabled="disabled || loading"
      :value="text"
      :placeholder="t('common.value')"
      :aria-label="t('component.barcode.title')"
      @input="onInput"
    />
    <div
      v-if="svgHtml"
      class="vp-barcode__bars"
      role="img"
      :aria-label="ariaLabel || t('component.barcode.image', { format, value: text })"
    >
      <div class="vp-barcode__canvas" v-html="svgHtml" />
    </div>
    <p v-else-if="hasError" class="vp-barcode__error" role="alert">
      {{ t('component.barcode.invalid', { format }) }}
    </p>
    <p v-else class="vp-barcode__muted">{{ t('component.barcode.lead') }}</p>
  </div>
</template>
