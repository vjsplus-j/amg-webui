<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoSnapshotProps, VideoSnapshotEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VideoSnapshotProps>(), { disabled: false })
const emit = defineEmits<VideoSnapshotEmits>()
const { t } = useLocale()
const preview = ref('')
const canvasRef = ref<HTMLCanvasElement | null>(null)
function capture() {
  if (props.disabled) return
  const v = props.videoRef
  const c = canvasRef.value
  if (!v || !c || !v.videoWidth) return
  c.width = v.videoWidth; c.height = v.videoHeight
  const ctx = c.getContext('2d')
  if (!ctx) return
  ctx.drawImage(v, 0, 0)
  preview.value = c.toDataURL('image/png')
  emit('capture', preview.value)
}
</script>
<template>
  <div :class="['vp-video-snapshot', props.class]" :style="style" data-component="VideoSnapshot">
    <button type="button" class="vp-video-snapshot__btn" :disabled="disabled" @click="capture">{{ t('industry.video.capture') }}</button>
    <canvas ref="canvasRef" class="vp-video-snapshot__canvas" aria-hidden="true" />
    <img v-if="preview" class="vp-video-snapshot__preview" :src="preview" :alt="t('industry.video.snapshot')" />
  </div>
</template>