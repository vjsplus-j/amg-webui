<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { buildBarcodeBars, barsToSvg } from '@amg-webui/utils'
import type { BarcodeProps, BarcodeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<BarcodeProps>(), {
  modelValue: '',
  value: '',
  barWidth: 2,
  height: 48,
  showLabel: true,
  loading: false,
  disabled: false
})

const emit = defineEmits<BarcodeEmits>()
const { t } = useLocale()

const text = computed(() => props.modelValue || props.value || '')

const svgHtml = computed(() => {
  if (!text.value) return ''
  const bars = buildBarcodeBars(text.value)
  return barsToSvg(bars, props.barWidth, props.height, 'var(--text-primary)')
})

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
      class="vp-barcode__input"
      type="text"
      :disabled="disabled || loading"
      :value="text"
      :placeholder="t('common.value')"
      :aria-label="t('component.barcode.title')"
      @input="onInput"
    />
    <div v-if="svgHtml" class="vp-barcode__bars">
      <div v-html="svgHtml" />
      <span v-if="showLabel && text" class="vp-barcode__label">{{ text }}</span>
    </div>
    <p v-else class="vp-barcode__muted">{{ t('component.barcode.lead') }}</p>
  </div>
</template>
