<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { generateMatrixCodeSvg } from '@amg-webui/utils'
import type { MatrixCodeEmits, MatrixCodeProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<MatrixCodeProps>(), {
  modelValue: '',
  value: '',
  format: 'qrcode',
  pixelSize: 4,
  quietZone: 8,
  editable: true,
  loading: false,
  disabled: false
})

const emit = defineEmits<MatrixCodeEmits>()
const { t } = useLocale()

function normalizeText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

const text = computed(() => normalizeText(props.modelValue) || normalizeText(props.value))

const renderResult = computed(() => {
  if (!text.value) return { svg: '', error: '' }
  try {
    return {
      svg: generateMatrixCodeSvg({
        text: text.value,
        format: props.format,
        pixelSize: props.pixelSize,
        quietZone: props.quietZone,
        errorCorrection: props.errorCorrection,
        version: props.version
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
    :class="['vp-matrix-code', { 'vp-matrix-code--disabled': disabled }, props.class]"
    :style="style"
    data-component="MatrixCode"
  >
    <input
      v-if="editable"
      class="vp-matrix-code__input"
      type="text"
      :disabled="disabled || loading"
      :value="text"
      :placeholder="t('common.value')"
      :aria-label="t('component.matrix-code.title')"
      @input="onInput"
    />
    <div
      v-if="svgHtml"
      class="vp-matrix-code__symbol"
      role="img"
      :aria-label="ariaLabel || t('component.matrix-code.image', { format, value: text })"
    >
      <div class="vp-matrix-code__canvas" v-html="svgHtml" />
    </div>
    <p v-else-if="hasError" class="vp-matrix-code__error" role="alert">
      {{ t('component.matrix-code.invalid', { format }) }}
    </p>
    <p v-else class="vp-matrix-code__muted">{{ t('component.matrix-code.lead') }}</p>
  </div>
</template>
