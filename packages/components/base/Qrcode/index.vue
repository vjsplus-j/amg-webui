<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { buildQrcodeMatrix, matrixToSvg } from '@amg-webui/utils'
import type { QrcodeProps, QrcodeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<QrcodeProps>(), {
  modelValue: '',
  value: '',
  size: 21,
  pixelSize: 4,
  loading: false,
  disabled: false
})

const emit = defineEmits<QrcodeEmits>()
const { t } = useLocale()

const text = computed(() => props.modelValue || props.value || '')

const svgHtml = computed(() => {
  if (!text.value) return ''
  const matrix = buildQrcodeMatrix(text.value, props.size)
  return matrixToSvg(matrix, props.pixelSize, 'var(--text-primary)', 'var(--surface-0, var(--surface-1))')
})

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
        class="vp-qrcode__input"
        type="text"
        :disabled="disabled || loading"
        :value="text"
        :placeholder="t('common.search')"
        :aria-label="t('component.qrcode.title')"
        @input="onInput"
      />
      <div v-if="svgHtml" class="vp-qrcode__matrix" v-html="svgHtml" />
      <p v-else class="vp-qrcode__muted">{{ t('component.qrcode.lead') }}</p>
    </div>
  </div>
</template>
