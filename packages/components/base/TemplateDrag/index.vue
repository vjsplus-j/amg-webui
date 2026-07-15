<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { TemplateDragProps, TemplateDragEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TemplateDragProps>(), {
  templates: () => []
})

const emit = defineEmits<TemplateDragEmits>()
const { t } = useLocale()

function onDragStart(e: DragEvent, id: string) {
  e.dataTransfer?.setData('application/vp-template-id', id)
}

function onClick(tpl: (typeof props.templates)[number]) {
  emit('apply', tpl)
}
</script>

<template>
  <ul :class="['vp-template-drag', props.class]" :style="style" data-component="TemplateDrag">
    <li
      v-for="tpl in templates"
      :key="tpl.id"
      class="vp-template-drag__item"
      draggable="true"
      @dragstart="onDragStart($event, tpl.id)"
      @click="onClick(tpl)"
    >
      {{ tpl.name }}
    </li>
    <p v-if="!templates.length" class="vp-template-drag__muted">{{ t('common.noData') }}</p>
  </ul>
</template>
