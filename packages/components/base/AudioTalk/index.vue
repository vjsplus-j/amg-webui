<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { AudioTalkProps, AudioTalkEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<AudioTalkProps>(), { active: false, disabled: false })
const emit = defineEmits<AudioTalkEmits>()
const { t } = useLocale()
const talking = ref(props.active)
watch(() => props.active, v => { talking.value = !!v })
const label = computed(() => talking.value ? t('industry.audioTalk.talking') : t('industry.audioTalk.idle'))
function toggle() {
  if (props.disabled) return
  talking.value = !talking.value
  emit('update:active', talking.value)
  if (talking.value) emit('start'); else emit('stop')
}
</script>
<template>
  <div :class="['vp-audio-talk', { 'vp-audio-talk--active': talking }, props.class]" :style="style" data-component="AudioTalk">
    <span class="vp-audio-talk__badge" :class="talking ? 'vp-audio-talk__badge--on' : 'vp-audio-talk__badge--off'">{{ label }}</span>
    <button type="button" class="vp-audio-talk__btn" :disabled="disabled" @click="toggle">{{ talking ? t('industry.audioTalk.stop') : t('industry.audioTalk.start') }}</button>
  </div>
</template>