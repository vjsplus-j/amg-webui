<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { AudioPlayProps, AudioPlayEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<AudioPlayProps>(), {
  src: null,
  controls: true,
  autoplay: false,
  loop: false
})

const emit = defineEmits<AudioPlayEmits>()
const { t } = useLocale()
const url = ref('')

watch(
  toRef(props, 'src'),
  (val) => {
    if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
    url.value = ''
    if (!val) return
    if (typeof val === 'string') url.value = val
    else url.value = URL.createObjectURL(val)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
})
</script>

<template>
  <div :class="['vp-audio-play', props.class]" :style="style" data-component="AudioPlay">
    <audio
      v-if="url"
      class="vp-audio-play__audio"
      :src="url"
      :controls="controls"
      :autoplay="autoplay"
      :loop="loop"
      @play="emit('play')"
      @pause="emit('pause')"
      @ended="emit('ended')"
    />
    <p v-else class="vp-audio-play__muted">{{ t('component.audio-play.lead') }}</p>
    <slot />
  </div>
</template>
