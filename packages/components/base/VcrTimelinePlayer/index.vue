<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VcrTimelinePlayerProps, VcrTimelinePlayerEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrTimelinePlayerProps>(), { currentTime: 0, duration: 3600, disabled: false })
const emit = defineEmits<VcrTimelinePlayerEmits>()
const { t } = useLocale()
const pos = ref(props.currentTime)
watch(() => props.currentTime, v => { pos.value = v ?? 0 })
const label = computed(() => {
  const fmt = (s: number) => { const m = Math.floor(s/60), sec = Math.floor(s%60); return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0') }
  return fmt(pos.value) + ' / ' + fmt(props.duration ?? 0)
})
function onSeek(e: Event) { const v = Number((e.target as HTMLInputElement).value); pos.value = v; emit('update:currentTime', v); emit('seek', v) }
</script>
<template>
  <div :class="['vp-vcr-timeline-player', 'vp-vcr-timeline-player__panel', props.class]" :style="style" data-component="VcrTimelinePlayer">
    <h3 class="vp-vcr-timeline-player__title">{{ t('industry.vcr.timeline') }}</h3>
    <p class="vp-vcr-timeline-player__muted">{{ t('industry.vcr.currentTime') }}: {{ label }}</p>
    <div class="vp-vcr-timeline-player__timeline">
      <input class="vp-vcr-timeline-player__scrubber" type="range" min="0" :max="duration" :value="pos" :disabled="disabled" @input="onSeek" />
    </div>
    <slot />
  </div>
</template>