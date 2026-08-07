<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { PreviewProps, PreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PreviewProps>(), {
  zoom: 1,
  minZoom: 0.25,
  maxZoom: 3,
  step: 0.1,
  fullscreen: false,
  disabled: false,
  keyboard: true,
  rotatable: true,
  showToolbar: true
})

const emit = defineEmits<PreviewEmits>()
const { t } = useLocale()
const scale = ref(props.modelValue ?? props.zoom)
const isFs = ref(props.fullscreen)
const rotation = ref(0)
const hostRef = ref<HTMLElement | null>(null)

const minZoom = computed(() => Math.max(0.05, props.minZoom))
const maxZoom = computed(() => Math.max(minZoom.value, props.maxZoom))
const step = computed(() => Math.max(0.01, props.step))
const canZoomOut = computed(() => !props.disabled && scale.value > minZoom.value)
const canZoomIn = computed(() => !props.disabled && scale.value < maxZoom.value)
const zoomText = computed(() => `${Math.round(scale.value * 100)}%`)
const transform = computed(() => `rotate(${rotation.value}deg) scale(${scale.value})`)

const rootClass = computed(() => [
  'vp-preview',
  {
    'vp-preview--fullscreen': isFs.value,
    'vp-preview--disabled': props.disabled
  },
  props.class
])

function clampZoom(value: number) {
  return Math.min(maxZoom.value, Math.max(minZoom.value, Number(value) || 1))
}

function commitZoom(value: number) {
  const next = Number(clampZoom(value).toFixed(3))
  if (next === scale.value) return
  scale.value = next
  emit('update:modelValue', next)
  emit('update:zoom', next)
  emit('zoom-change', next)
  emit('change', { zoom: next, fullscreen: isFs.value, rotation: rotation.value })
}

function zoomIn() {
  if (!canZoomIn.value) return
  commitZoom(scale.value + step.value)
}

function zoomOut() {
  if (!canZoomOut.value) return
  commitZoom(scale.value - step.value)
}

function reset() {
  if (props.disabled) return
  rotation.value = 0
  commitZoom(props.zoom)
  emit('reset')
}

function rotate() {
  if (props.disabled || !props.rotatable) return
  rotation.value = (rotation.value + 90) % 360
  emit('rotate', rotation.value)
  emit('change', { zoom: scale.value, fullscreen: isFs.value, rotation: rotation.value })
}

async function setFullscreen(value: boolean) {
  if (props.disabled || !hostRef.value || isFs.value === value) return
  if (value) {
    await hostRef.value.requestFullscreen?.()
  } else {
    await document.exitFullscreen?.()
  }
  isFs.value = value
  emit('update:fullscreen', value)
  emit('fullscreen-change', value)
  emit('change', { zoom: scale.value, fullscreen: value, rotation: rotation.value })
}

function toggleFs() {
  void setFullscreen(!isFs.value)
}

function onFullscreenChange() {
  const next = Boolean(document.fullscreenElement && hostRef.value?.contains(document.fullscreenElement))
  if (next === isFs.value) return
  isFs.value = next
  emit('update:fullscreen', next)
  emit('fullscreen-change', next)
}

function onKeydown(event: KeyboardEvent) {
  if (!props.keyboard || props.disabled) return
  if (event.key === '+' || event.key === '=') {
    event.preventDefault()
    zoomIn()
  } else if (event.key === '-' || event.key === '_') {
    event.preventDefault()
    zoomOut()
  } else if (event.key === '0') {
    event.preventDefault()
    reset()
  } else if (event.key.toLowerCase() === 'r') {
    event.preventDefault()
    rotate()
  }
}

watch(() => props.modelValue, (value) => {
  if (value !== undefined) scale.value = clampZoom(value)
})

watch(() => props.zoom, (value) => {
  if (props.modelValue === undefined) scale.value = clampZoom(value)
})

watch(() => props.fullscreen, (value) => {
  isFs.value = value
})

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})

defineExpose({ zoomIn, zoomOut, reset, rotate, setFullscreen })
</script>

<template>
  <div
    ref="hostRef"
    :class="rootClass"
    :style="style"
    data-component="Preview"
    role="region"
    :aria-label="t('component.preview.title')"
    :aria-disabled="disabled || undefined"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div v-if="showToolbar" class="vp-preview__toolbar" role="toolbar" :aria-label="t('component.preview.title')">
      <button
        type="button"
        class="vp-preview__btn"
        :disabled="!canZoomOut"
        :aria-label="t('component.image-viewer.zoomOut')"
        @click="zoomOut"
      >
        −
      </button>
      <span class="vp-preview__zoom" aria-live="polite">{{ zoomText }}</span>
      <button
        type="button"
        class="vp-preview__btn"
        :disabled="!canZoomIn"
        :aria-label="t('component.image-viewer.zoomIn')"
        @click="zoomIn"
      >
        +
      </button>
      <button
        v-if="rotatable"
        type="button"
        class="vp-preview__btn vp-preview__btn--ghost"
        :disabled="disabled"
        :aria-label="t('component.image-viewer.rotate')"
        @click="rotate"
      >
        {{ t('component.image-viewer.rotate') }}
      </button>
      <button
        type="button"
        class="vp-preview__btn vp-preview__btn--ghost"
        :disabled="disabled"
        @click="reset"
      >
        {{ t('button.reset') }}
      </button>
      <button type="button" class="vp-preview__btn vp-preview__btn--ghost" :disabled="disabled" @click="toggleFs">
        {{ t('component.preview.fullscreen') }}
      </button>
    </div>
    <div class="vp-preview__stage">
      <div class="vp-preview__content" :style="{ transform }" :data-rotation="rotation">
        <slot :zoom="scale" :fullscreen="isFs" :rotation="rotation" />
      </div>
    </div>
  </div>
</template>
