<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoVolumeProps, VideoVolumeEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VideoVolumeProps>(), { modelValue: 1, muted: false, disabled: false })
const emit = defineEmits<VideoVolumeEmits>()
const { t } = useLocale()
const vol = ref(props.modelValue)
const isMuted = ref(props.muted)
watch(() => props.modelValue, v => { vol.value = v ?? 1 })
watch(() => props.muted, v => { isMuted.value = !!v })
const muteLabel = computed(() => isMuted.value ? t('industry.video.unmute') : t('industry.video.mute'))
function onVol(e: Event) { const v = Number((e.target as HTMLInputElement).value); vol.value = v; emit('update:modelValue', v); emit('change', v) }
function toggleMute() { isMuted.value = !isMuted.value; emit('update:muted', isMuted.value) }
</script>
<template>
  <div :class="['vp-video-volume', props.class]" :style="style" data-component="VideoVolume">
    <button type="button" class="vp-video-volume__btn vp-video-volume__btn--ghost" :disabled="disabled" @click="toggleMute">{{ muteLabel }}</button>
    <label class="vp-video-volume__control vp-video-volume__muted">
      <span>{{ t('industry.video.volume') }}</span>
      <input class="vp-video-volume__range" type="range" min="0" max="1" step="0.05" :value="vol" :disabled="disabled || isMuted" @input="onVol" />
    </label>
  </div>
</template>