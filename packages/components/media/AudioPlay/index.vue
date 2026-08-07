<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { AudioPlayProps, AudioPlayEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<AudioPlayProps>(), {
  src: null, controls: true, autoplay: false, loop: false, loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<AudioPlayEmits>()
const { t } = useLocale()
const url = ref('')
const audioRef = ref<HTMLAudioElement | null>(null)

watch(toRef(props, 'src'), (val) => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  if (!val) return
  url.value = typeof val === 'string' ? val : URL.createObjectURL(val)
}, { immediate: true })

onBeforeUnmount(() => { if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value) })

const titleText = computed(() => props.title ?? t('component.audio-play.lead'))

function playAudio() {
  if (props.disabled || !audioRef.value) return
  audioRef.value.play()
  trackEmit({ component: 'AudioPlay', type: 'play', trackId: props.trackId, telemetry: props.telemetry })
}

function pauseAudio() {
  if (!audioRef.value) return
  audioRef.value.pause()
  trackEmit({ component: 'AudioPlay', type: 'pause', trackId: props.trackId, telemetry: props.telemetry })
}

function clearAudio() {
  if (props.disabled) return
  pauseAudio()
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  emit('clear')
  trackEmit({ component: 'AudioPlay', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section :class="['vp-audio-play', 'vp-audio-play__panel', props.class]" :style="style" role="region" aria-labelledby="vp-audio-play-title" data-component="AudioPlay">
    <header class="vp-audio-play__header">
      <h3 id="vp-audio-play-title" class="vp-audio-play__title">{{ titleText }}</h3>
    </header>
    <div v-if="loading" class="vp-audio-play__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-audio-play__body">
      <audio v-if="url" ref="audioRef" class="vp-audio-play__audio" :src="url" :controls="controls" :autoplay="autoplay" :loop="loop" :disabled="disabled" @play="emit('play')" @pause="emit('pause')" @ended="emit('ended')" />
      <p v-else class="vp-audio-play__empty">{{ t('component.audio-play.lead') }}</p>
      <div class="vp-audio-play__toolbar">
        <button type="button" class="vp-audio-play__btn" :disabled="disabled || !url" @click="playAudio">{{ t(LocaleKeys.industry.video.play) }}</button>
        <button type="button" class="vp-audio-play__btn vp-audio-play__btn--ghost" :disabled="disabled || !url" @click="pauseAudio">{{ t(LocaleKeys.industry.video.pause) }}</button>
        <button type="button" class="vp-audio-play__btn vp-audio-play__btn--ghost" :disabled="disabled" @click="clearAudio">{{ t(LocaleKeys.button.reset) }}</button>
      </div>
      <slot />
    </div>
  </section>
</template>
