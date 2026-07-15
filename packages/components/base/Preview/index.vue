<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { PreviewProps, PreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PreviewProps>(), {
  zoom: 1,
  fullscreen: false
})

const emit = defineEmits<PreviewEmits>()
const { t } = useLocale()
const scale = ref(props.zoom)
const isFs = ref(props.fullscreen)
const hostRef = ref<HTMLElement | null>(null)

const transform = computed(() => `scale(${scale.value})`)

function zoomIn() {
  scale.value = Math.min(3, scale.value + 0.1)
  emit('zoom-change', scale.value)
}

function zoomOut() {
  scale.value = Math.max(0.25, scale.value - 0.1)
  emit('zoom-change', scale.value)
}

function toggleFs() {
  if (!hostRef.value) return
  if (!document.fullscreenElement) {
    hostRef.value.requestFullscreen?.()
    isFs.value = true
  } else {
    document.exitFullscreen?.()
    isFs.value = false
  }
}
</script>

<template>
  <div ref="hostRef" :class="['vp-preview', { 'vp-preview--fullscreen': isFs }, props.class]" :style="style" data-component="Preview">
    <div class="vp-preview__toolbar">
      <button type="button" class="vp-preview__btn" @click="zoomOut">‹</button>
      <span class="vp-preview__zoom">{{ Math.round(scale * 100) }}%</span>
      <button type="button" class="vp-preview__btn" @click="zoomIn">+</button>
      <button type="button" class="vp-preview__btn vp-preview__btn--ghost" @click="toggleFs">
        {{ t('component.preview.fullscreen') }}
      </button>
    </div>
    <div class="vp-preview__stage">
      <div class="vp-preview__content" :style="{ transform }">
        <slot />
      </div>
    </div>
  </div>
</template>
