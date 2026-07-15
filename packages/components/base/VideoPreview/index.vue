<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoPreviewProps, VideoPreviewEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VideoPreviewProps>(), { src: null, poster: '', controls: true, autoplay: false, loop: false, muted: false })
const emit = defineEmits<VideoPreviewEmits>()
const { t } = useLocale()
const url = ref('')
const videoRef = ref<HTMLVideoElement | null>(null)
const isFs = ref(false)
const fsLabel = computed(() => isFs.value ? t('industry.video.exitFullscreen') : t('industry.video.fullscreen'))
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
  if (!document.fullscreenElement) { el.requestFullscreen?.(); isFs.value = true }
  else { document.exitFullscreen?.(); isFs.value = false }
  emit('fullscreen', isFs.value)
}
onBeforeUnmount(() => { if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value) })
</script>
<template>
  <div :class="['vp-video-preview', props.class]" :style="style" data-component="VideoPreview">
    <div class="vp-video-preview__wrap">
      <video v-if="url" ref="videoRef" class="vp-video-preview__video" :src="url" :poster="poster" :controls="controls" :autoplay="autoplay" :loop="loop" :muted="muted" @play="emit('play')" @pause="emit('pause')" @error="emit('error')" />
      <p v-else class="vp-video-preview__muted">{{ t('industry.video.noSignal') }}</p>
    </div>
    <button v-if="url" type="button" class="vp-video-preview__btn" @click="toggleFs">{{ fsLabel }}</button>
    <slot />
  </div>
</template>