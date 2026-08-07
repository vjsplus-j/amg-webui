<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { AudioTalkProps, AudioTalkEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<AudioTalkProps>(), {
  active: false,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<AudioTalkEmits>()
const { t } = useLocale()

const talking = ref(props.active)
const pulseTimer = ref<ReturnType<typeof setInterval> | null>(null)

watch(
  () => props.active,
  (v) => {
    talking.value = !!v
  }
)

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.audioTalk.start))
const statusLabel = computed(() =>
  talking.value ? t(LocaleKeys.industry.audioTalk.talking) : t(LocaleKeys.industry.audioTalk.idle)
)

function clearPulse() {
  if (pulseTimer.value) {
    clearInterval(pulseTimer.value)
    pulseTimer.value = null
  }
}

function toggle() {
  if (props.disabled || props.loading) return
  talking.value = !talking.value
  emit('update:active', talking.value)
  if (talking.value) {
    emit('start')
    clearPulse()
    pulseTimer.value = setInterval(() => {}, 1000)
  } else {
    emit('stop')
    clearPulse()
  }
  trackEmit({
    component: 'AudioTalk',
    type: talking.value ? 'start' : 'stop',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

function reset() {
  if (props.disabled || props.loading) return
  talking.value = false
  clearPulse()
  emit('update:active', false)
  emit('stop')
  trackEmit({ component: 'AudioTalk', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}

onUnmounted(clearPulse)
</script>

<template>
  <section
    :class="['vp-audio-talk', 'vp-audio-talk__panel', { 'vp-audio-talk--active': talking, 'vp-audio-talk--disabled': disabled }, props.class]"
    :style="style"
    role="region"
    :aria-labelledby="'vp-audio-talk-title'"
    data-component="AudioTalk"
  >
    <header class="vp-audio-talk__header">
      <h3 id="vp-audio-talk-title" class="vp-audio-talk__title">{{ titleText }}</h3>
      <div class="vp-audio-talk__status" role="status" aria-live="polite">
        <span
          :class="['vp-audio-talk__badge', talking ? 'vp-audio-talk__badge--on' : 'vp-audio-talk__badge--off']"
        >
          {{ statusLabel }}
        </span>
      </div>
    </header>

    <div v-if="loading" class="vp-audio-talk__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>

    <div v-else class="vp-audio-talk__body">
      <div class="vp-audio-talk__toolbar">
        <button
          type="button"
          class="vp-audio-talk__btn"
          :disabled="disabled"
          :aria-pressed="talking"
          @click="toggle"
        >
          {{ talking ? t(LocaleKeys.industry.audioTalk.stop) : t(LocaleKeys.industry.audioTalk.start) }}
        </button>
        <button type="button" class="vp-audio-talk__btn vp-audio-talk__btn--ghost" :disabled="disabled" @click="reset">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
