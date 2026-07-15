<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OcrScanProps, OcrScanEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<OcrScanProps>(), {
  disabled: false
})

const emit = defineEmits<OcrScanEmits>()
const { t } = useLocale()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const previewUrl = ref('')
const result = ref('')
const busy = ref(false)

onBeforeUnmount(() => {
  if (previewUrl.value.startsWith('blob:')) URL.revokeObjectURL(previewUrl.value)
})

function mockOcrFromImageData(data: Uint8ClampedArray): string {
  let sum = 0
  for (let i = 0; i < data.length; i += 4) sum += data[i] + data[i + 1] + data[i + 2]
  const code = (sum % 9973).toString(36).toUpperCase()
  return `SCAN-${code}`
}

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file || props.disabled) return
  busy.value = true
  if (previewUrl.value.startsWith('blob:')) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    const canvas = canvasRef.value
    if (!canvas) return
    const maxW = 320
    const scale = Math.min(1, maxW / img.width)
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    result.value = mockOcrFromImageData(pixels)
    emit('scan', result.value)
    busy.value = false
  }
  img.onerror = () => {
    emit('error', new Error('image load failed'))
    busy.value = false
  }
  img.src = previewUrl.value
  ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <div :class="['vp-ocr-scan', { 'vp-ocr-scan--disabled': disabled }, props.class]" :style="style" data-component="OcrScan">
    <input type="file" accept="image/*" class="vp-ocr-scan__file" :disabled="disabled || busy" @change="onFile" />
    <canvas ref="canvasRef" class="vp-ocr-scan__canvas" />
    <img v-if="previewUrl" :src="previewUrl" alt="" class="vp-ocr-scan__preview" />
    <p v-if="result" class="vp-ocr-scan__result">{{ result }}</p>
    <p v-else class="vp-ocr-scan__muted">{{ t('component.ocr-scan.lead') }}</p>
  </div>
</template>
