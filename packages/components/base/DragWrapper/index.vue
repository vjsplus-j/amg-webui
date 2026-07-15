<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { DragWrapperProps, DragWrapperEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragWrapperProps>(), {
  label: '',
  nested: true
})

const emit = defineEmits<DragWrapperEmits>()
const { t } = useLocale()

function onDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  const type = e.dataTransfer?.getData('application/vp-material-type')
  if (type) emit('drop', type)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
}
</script>

<template>
  <div
    :class="['vp-drag-wrapper', { 'vp-drag-wrapper--nested': nested }, props.class]"
    :style="style"
    data-component="DragWrapper"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <span v-if="label" class="vp-drag-wrapper__label">{{ label }}</span>
    <div class="vp-drag-wrapper__body">
      <slot />
    </div>
    <p v-if="!$slots.default" class="vp-drag-wrapper__hint">{{ t('component.drag-wrapper.hint') }}</p>
  </div>
</template>
