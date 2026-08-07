<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ImageCropProps, ImageCropEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ImageCropProps>(), {
  src: null,
  aspectRatio: 1,
  disabled: false
})

const emit = defineEmits<ImageCropEmits>()
const { t } = useLocale()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const objectUrl = ref('')
const crop = ref({ x: 20, y: 20, w: 120, h: 120 })
const dragging = ref(false)
const dragStart = ref({ x: 0, y: 0, cx: 0, cy: 0 })

const displayUrl = computed(() => {
  if (!props.src) return ''
  if (typeof props.src === 'string') return props.src
  return objectUrl.value
})

watch(
  () => props.src,
  (val) => {
    if (objectUrl.value.startsWith('blob:')) URL.revokeObjectURL(objectUrl.value)
    objectUrl.value = ''
    if (val && typeof val !== 'string') objectUrl.value = URL.createObjectURL(val)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (objectUrl.value.startsWith('blob:')) URL.revokeObjectURL(objectUrl.value)
})

function onImgLoad() {
  const img = imgRef.value
  if (!img) return
  const ratio = props.aspectRatio || 1
  const w = Math.min(img.naturalWidth * 0.6, 200)
  crop.value = { x: 10, y: 10, w, h: w / ratio }
  draw()
}

function draw() {
  const canvas = canvasRef.value
  const img = imgRef.value
  if (!canvas || !img) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  canvas.width = img.clientWidth
  canvas.height = img.clientHeight
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--primary-500') || 'currentColor'
  ctx.lineWidth = 2
  ctx.strokeRect(crop.value.x, crop.value.y, crop.value.w, crop.value.h)
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled) return
  dragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY, cx: crop.value.x, cy: crop.value.y }
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  crop.value.x = dragStart.value.cx + (e.clientX - dragStart.value.x)
  crop.value.y = dragStart.value.cy + (e.clientY - dragStart.value.y)
  draw()
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false
  ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
}

function exportCrop() {
  const img = imgRef.value
  const canvas = document.createElement('canvas')
  if (!img) return
  const scaleX = img.naturalWidth / img.clientWidth
  const scaleY = img.naturalHeight / img.clientHeight
  canvas.width = crop.value.w * scaleX
  canvas.height = crop.value.h * scaleY
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.drawImage(
    img,
    crop.value.x * scaleX,
    crop.value.y * scaleY,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  )
  canvas.toBlob((blob) => {
    if (blob) emit('crop', blob)
    else emit('error', new Error('crop failed'))
  }, 'image/png')
}

function onPick(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) objectUrl.value = URL.createObjectURL(file)
}
</script>

<template>
  <div :class="['vp-image-crop', { 'vp-image-crop--disabled': disabled }, props.class]" :style="style" data-component="ImageCrop">
    <input
      type="file"
      accept="image/*"
      class="vp-image-crop__file"
      :disabled="disabled"
      :aria-label="t(LocaleKeys.component.imageCrop.fileAria)"
      @change="onPick"
    />
    <div v-if="displayUrl" class="vp-image-crop__stage">
      <img ref="imgRef" :src="displayUrl" alt="" class="vp-image-crop__img" @load="onImgLoad" />
      <canvas
        ref="canvasRef"
        class="vp-image-crop__overlay"
        role="img"
        :aria-label="t(LocaleKeys.component.imageCrop.canvasAria)"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
      />
    </div>
    <button type="button" class="vp-image-crop__btn" :disabled="disabled || !displayUrl" @click="exportCrop">
      {{ t('component.image-crop.export') }}
    </button>
    <slot />
  </div>
</template>
