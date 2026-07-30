<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VideoSnapshotProps, VideoSnapshotEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VideoSnapshotProps>(), {
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VideoSnapshotEmits>()
const { t } = useLocale()
const preview = ref('')
const canvasRef = ref<HTMLCanvasElement | null>(null)

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.video.snapshot))
const hasPreview = computed(() => !!preview.value)

function capture() {
  if (props.disabled || props.loading) return
  const v = props.videoRef
  const c = canvasRef.value
  if (!v || !c || !v.videoWidth) return
  c.width = v.videoWidth
  c.height = v.videoHeight
  const ctx = c.getContext('2d')
  if (!ctx) return
  ctx.drawImage(v, 0, 0)
  preview.value = c.toDataURL('image/png')
  emit('capture', preview.value)
  trackEmit({ component: 'VideoSnapshot', type: 'capture', trackId: props.trackId, telemetry: props.telemetry })
}

function clearPreview() {
  preview.value = ''
  trackEmit({ component: 'VideoSnapshot', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-video-snapshot', 'vp-video-snapshot__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-video-snapshot-title"
    data-component="VideoSnapshot"
  >
    <header class="vp-video-snapshot__header">
      <h3 id="vp-video-snapshot-title" class="vp-video-snapshot__title">{{ titleText }}</h3>
      <div class="vp-video-snapshot__status" role="status" aria-live="polite">
        {{ hasPreview ? t(LocaleKeys.industry.video.capture) : t(LocaleKeys.industry.common.noData) }}
      </div>
    </header>
    <div v-if="loading" class="vp-video-snapshot__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-video-snapshot__body">
      <div class="vp-video-snapshot__toolbar">
        <button type="button" class="vp-video-snapshot__btn" :disabled="disabled" @click="capture">
          {{ t(LocaleKeys.industry.video.capture) }}
        </button>
        <button type="button" class="vp-video-snapshot__btn vp-video-snapshot__btn--ghost" :disabled="disabled || !hasPreview" @click="clearPreview">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <canvas ref="canvasRef" class="vp-video-snapshot__canvas" aria-hidden="true" />
      <div v-if="hasPreview" class="vp-video-snapshot__preview">
        <img :src="preview" :alt="t(LocaleKeys.industry.video.snapshot)" />
      </div>
      <p v-else class="vp-video-snapshot__empty" role="status">{{ t(LocaleKeys.industry.common.noData) }}</p>
      <slot />
    </div>
  </section>
</template>
