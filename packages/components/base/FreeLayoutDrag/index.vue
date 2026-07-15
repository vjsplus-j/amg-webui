<script setup lang="ts">
import { watch } from 'vue'
import { useCanvasEditor } from '@amg-webui/hooks'
import type { FreeLayoutDragProps, FreeLayoutDragEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FreeLayoutDragProps>(), {
  enabled: true
})

const emit = defineEmits<FreeLayoutDragEmits>()
const editor = useCanvasEditor()

watch(
  () => props.enabled,
  (on) => {
    if (on && editor) {
      editor.mode.value = 'free'
      emit('mode', 'free')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div :class="['vp-free-layout-drag', { 'vp-free-layout-drag--active': enabled }, props.class]" :style="style" data-component="FreeLayoutDrag">
    <slot />
  </div>
</template>
