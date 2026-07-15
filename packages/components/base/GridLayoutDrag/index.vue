<script setup lang="ts">
import { computed, watch } from 'vue'
import { useCanvasEditor } from '@amg-webui/hooks'
import type { GridLayoutDragProps, GridLayoutDragEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GridLayoutDragProps>(), {
  cols: 24,
  enabled: true
})

const emit = defineEmits<GridLayoutDragEmits>()
const editor = useCanvasEditor()

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.cols}, 1fr)`
}))

watch(
  () => props.enabled,
  (on) => {
    if (on && editor) {
      editor.mode.value = 'grid'
      emit('mode', 'grid')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    :class="['vp-grid-layout-drag', { 'vp-grid-layout-drag--active': enabled }, props.class]"
    :style="[gridStyle, style]"
    data-component="GridLayoutDrag"
  >
    <slot />
  </div>
</template>
