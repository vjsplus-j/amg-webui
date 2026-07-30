<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { DragWrapperProps, DragWrapperEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragWrapperProps>(), { label: '', nested: true, loading: false, disabled: false, telemetry: undefined })
const emit = defineEmits<DragWrapperEmits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? (props.label || t('component.drag-wrapper.title')))

function onDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (props.disabled) return
  const type = e.dataTransfer?.getData('application/vp-material-type')
  if (type) { emit('drop', type); trackEmit({ component: 'DragWrapper', type: 'drop', trackId: props.trackId, telemetry: props.telemetry, payload: { type } }) }
}
function onDragOver(e: DragEvent) { e.preventDefault(); e.stopPropagation() }
function clearZone() { if (!props.disabled) { emit('clear'); trackEmit({ component: 'DragWrapper', type: 'clear', trackId: props.trackId, telemetry: props.telemetry }) } }
</script>

<template>
  <section :class="['vp-drag-wrapper', { 'vp-drag-wrapper--nested': nested }, props.class]" :style="style" role="region" aria-labelledby="vp-drag-wrapper-title" data-component="DragWrapper" @dragover="onDragOver" @drop="onDrop">
    <header class="vp-drag-wrapper__header"><h3 id="vp-drag-wrapper-title" class="vp-drag-wrapper__title">{{ titleText }}</h3></header>
    <div v-if="loading" class="vp-drag-wrapper__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-drag-wrapper__body">
      <div class="vp-drag-wrapper__slot"><slot /></div>
      <p v-if="!$slots.default" class="vp-drag-wrapper__empty">{{ t('component.drag-wrapper.hint') }}</p>
      <button type="button" class="vp-drag-wrapper__btn vp-drag-wrapper__btn--ghost" :disabled="disabled" @click="clearZone">{{ t(LocaleKeys.button.reset) }}</button>
    </div>
  </section>
</template>
