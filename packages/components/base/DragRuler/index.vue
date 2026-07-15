<script setup lang="ts">
import { computed } from 'vue'
import type { DragRulerProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragRulerProps>(), {
  scale: 1,
  showGuides: true
})

const ticks = computed(() => Array.from({ length: 25 }, (_, i) => i * 10 * props.scale))
</script>

<template>
  <div :class="['vp-drag-ruler', props.class]" :style="style" data-component="DragRuler">
    <div class="vp-drag-ruler__h">
      <span v-for="tick in ticks" :key="'h' + tick" class="vp-drag-ruler__tick" :style="{ left: `${tick}px` }">{{ tick }}</span>
    </div>
    <div class="vp-drag-ruler__v">
      <span v-for="tick in ticks" :key="'v' + tick" class="vp-drag-ruler__tick" :style="{ top: `${tick}px` }">{{ tick }}</span>
    </div>
    <div v-if="showGuides" class="vp-drag-ruler__guides">
      <slot />
    </div>
  </div>
</template>
