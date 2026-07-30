<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { TemplateDragProps, TemplateDragEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TemplateDragProps>(), {
  templates: () => [{ id: 't1', name: 'Form A' }, { id: 't2', name: 'Form B' }],
  loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<TemplateDragEmits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('component.template-drag.title'))

function onDragStart(e: DragEvent, id: string) { e.dataTransfer?.setData('application/vp-template-id', id) }
function onClick(tpl: (typeof props.templates)[number]) {
  if (props.disabled) return
  emit('apply', tpl)
  trackEmit({ component: 'TemplateDrag', type: 'apply', trackId: props.trackId, telemetry: props.telemetry, payload: { id: tpl.id } })
}
function refresh() { emit('refresh'); trackEmit({ component: 'TemplateDrag', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry }) }
</script>

<template>
  <section class="vp-template-drag vp-template-drag__panel" role="region" aria-labelledby="vp-template-drag-title" data-component="TemplateDrag">
    <header class="vp-template-drag__header"><h3 id="vp-template-drag-title" class="vp-template-drag__title">{{ titleText }}</h3></header>
    <div v-if="loading" class="vp-template-drag__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <ul v-else class="vp-template-drag__list" role="listbox">
      <li v-for="tpl in templates" :key="tpl.id" class="vp-template-drag__item" draggable="true" role="option" @dragstart="onDragStart($event, tpl.id)" @click="onClick(tpl)">{{ tpl.name }}</li>
      <p v-if="!templates.length" class="vp-template-drag__empty">{{ t(LocaleKeys.common.noData) }}</p>
    </ul>
    <div class="vp-template-drag__toolbar"><button type="button" class="vp-template-drag__btn vp-template-drag__btn--ghost" :disabled="disabled" @click="refresh">{{ t(LocaleKeys.button.refresh) }}</button></div>
  </section>
</template>
