<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VideoPreviewProps, VideoPreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VideoPreviewProps>(), {
  src: null,
  poster: '',
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VideoPreviewEmits>()
const { t } = useLocale()
const url = ref('')
const videoRef = ref<HTMLVideoElement | null>(null)
const isFs = ref(false)
const playing = ref(false)

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.video.cell))
const fsLabel = computed(() => (isFs.value ? t(LocaleKeys.industry.video.exitFullscreen) : t(LocaleKeys.industry.video.fullscreen)))
const statusLabel = computed(() => (url.value ? (playing.value ? t(LocaleKeys.industry.video.play) : t(LocaleKeys.industry.video.pause)) : t(LocaleKeys.industry.video.noSignal)))

watch(toRef(props, 'src'), (val) => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  if (!val) return
  if (typeof val === 'string') url.value = val
  else url.value = URL.createObjectURL(val)
}, { immediate: true })

function toggleFs() {
  const el = videoRef.value?.parentElement
  if (!el) return
  if (!document.fullscreenElement) {
    el.requestFullscreen?.()
    isFs.value = true
  } else {
    document.exitFullscreen?.()
    isFs.value = false
  }
  emit('fullscreen', isFs.value)
  trackEmit({ component: 'VideoPreview', type: 'fullscreen', trackId: props.trackId, telemetry: props.telemetry })
}

function togglePlay() {
  const v = videoRef.value
  if (!v) return
  if (v.paused) {
    v.play()
    playing.value = true
    emit('play')
  } else {
    v.pause()
    playing.value = false
    emit('pause')
  }
  trackEmit({ component: 'VideoPreview', type: playing.value ? 'play' : 'pause', trackId: props.trackId, telemetry: props.telemetry })
}

onBeforeUnmount(() => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
})
</script>

<template>
  <section
    :class="['vp-video-preview', 'vp-video-preview__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-video-preview-title"
    data-component="VideoPreview"
  >
    <header class="vp-video-preview__header">
      <h3 id="vp-video-preview-title" class="vp-video-preview__title">{{ titleText }}</h3>
      <div class="vp-video-preview__status" role="status" aria-live="polite">{{ statusLabel }}</div>
    </header>
    <div v-if="loading" class="vp-video-preview__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-video-preview__body">
      <div class="vp-video-preview__wrap">
        <video
          v-if="url"
          ref="videoRef"
          class="vp-video-preview__video"
          :src="url"
          :poster="poster"
          :controls="controls"
          :autoplay="autoplay"
          :loop="loop"
          :muted="muted"
          @play="playing = true; emit('play')"
          @pause="playing = false; emit('pause')"
          @error="emit('error')"
        />
        <p v-else class="vp-video-preview__empty" role="status">{{ t(LocaleKeys.industry.video.noSignal) }}</p>
      </div>
      <div v-if="url" class="vp-video-preview__controls">
        <button type="button" class="vp-video-preview__btn" @click="togglePlay">
          {{ playing ? t(LocaleKeys.industry.video.pause) : t(LocaleKeys.industry.video.play) }}
        </button>
        <button type="button" class="vp-video-preview__btn vp-video-preview__btn--ghost" @click="toggleFs">{{ fsLabel }}</button>
      </div>
      <slot />
    </div>
  </section>
</template>
