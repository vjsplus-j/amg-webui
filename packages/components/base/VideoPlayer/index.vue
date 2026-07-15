<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoPlayerProps, VideoPlayerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VideoPlayerProps>(), { autoplay: false, loop: false, muted: false, disabled: false })
const emit = defineEmits<VideoPlayerEmits>()
const { t } = useLocale()
const videoRef = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
const progress = ref(0)
const volume = ref(1)
const duration = ref(0)
const isFs = ref(false)

const playLabel = computed(() => (playing.value ? t('industry.video.pause') : t('industry.video.play')))
const fsLabel = computed(() => (isFs.value ? t('industry.video.exitFullscreen') : t('industry.video.fullscreen')))

function togglePlay() {
  const v = videoRef.value
  if (!v || props.disabled) return
  if (v.paused) { v.play(); playing.value = true; emit('play') }
  else { v.pause(); playing.value = false; emit('pause') }
}
function onTimeUpdate() {
  const v = videoRef.value
  if (!v || !v.duration) return
  progress.value = (v.currentTime / v.duration) * 100
  emit('timeupdate', v.currentTime)
}
function onLoaded() { duration.value = videoRef.value?.duration ?? 0 }
function onSeek(e: Event) {
  const v = videoRef.value
  if (!v || !v.duration) return
  v.currentTime = (Number((e.target as HTMLInputElement).value) / 100) * v.duration
}
function onVolume(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  volume.value = val
  if (videoRef.value) videoRef.value.volume = val
  emit('volumechange', val)
}
function toggleFs() {
  const el = videoRef.value?.parentElement
  if (!el) return
  if (!document.fullscreenElement) { el.requestFullscreen?.(); isFs.value = true }
  else { document.exitFullscreen?.(); isFs.value = false }
  emit('fullscreen', isFs.value)
}
function onFsChange() { isFs.value = !!document.fullscreenElement }

onMounted(() => document.addEventListener('fullscreenchange', onFsChange))
onBeforeUnmount(() => document.removeEventListener('fullscreenchange', onFsChange))
watch(() => props.src, () => { playing.value = false; progress.value = 0 })
defineExpose({ videoRef })
</script>

<template>
  <div :class="['vp-video-player', { 'vp-video-player--disabled': disabled }, props.class]" :style="style" data-component="VideoPlayer">
    <div class="vp-video-player__viewport">
      <video ref="videoRef" class="vp-video-player__video" :src="src" :poster="poster" :autoplay="autoplay" :loop="loop" :muted="muted" @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded" @play="playing = true" @pause="playing = false" />
      <slot name="poster" />
    </div>
    <div class="vp-video-player__toolbar">
      <button type="button" class="vp-video-player__btn" :disabled="disabled" @click="togglePlay">{{ playLabel }}</button>
      <label class="vp-video-player__control vp-video-player__muted">
        <span>{{ t('industry.video.progress') }}</span>
        <input class="vp-video-player__range" type="range" min="0" max="100" :value="progress" :disabled="disabled" @input="onSeek" />
      </label>
      <label class="vp-video-player__control vp-video-player__muted">
        <span>{{ t('industry.video.volume') }}</span>
        <input class="vp-video-player__range" type="range" min="0" max="1" step="0.05" :value="volume" :disabled="disabled" @input="onVolume" />
      </label>
      <button type="button" class="vp-video-player__btn vp-video-player__btn--ghost" :disabled="disabled" @click="toggleFs">{{ fsLabel }}</button>
    </div>
    <slot />
  </div>
</template>
