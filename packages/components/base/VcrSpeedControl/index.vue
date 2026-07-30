<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrSpeedControlProps, VcrSpeedControlEmits, VcrSpeed } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrSpeedControlProps>(), {
  modelValue: 1,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrSpeedControlEmits>()
const { t } = useLocale()
const speeds: VcrSpeed[] = [0.5, 1, 2, 4, 8]

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.speed))
const currentLabel = computed(() => String(props.modelValue ?? 1))

function pickSpeed(s: VcrSpeed) {
  if (props.disabled || props.loading) return
  emit('update:modelValue', s)
  emit('change', s)
  trackEmit({ component: 'VcrSpeedControl', type: 'change', trackId: props.trackId, telemetry: props.telemetry })
}

function resetSpeed() {
  if (props.disabled || props.loading) return
  emit('update:modelValue', 1)
  emit('change', 1)
  trackEmit({ component: 'VcrSpeedControl', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-vcr-speed-control', 'vp-vcr-speed-control__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-speed-control-title"
    data-component="VcrSpeedControl"
  >
    <header class="vp-vcr-speed-control__header">
      <h3 id="vp-vcr-speed-control-title" class="vp-vcr-speed-control__title">{{ titleText }}</h3>
      <div class="vp-vcr-speed-control__status" role="status" aria-live="polite">{{ currentLabel }}x</div>
    </header>
    <div v-if="loading" class="vp-vcr-speed-control__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-speed-control__body">
      <div class="vp-vcr-speed-control__speeds" role="group" :aria-label="titleText">
        <button
          v-for="s in speeds"
          :key="s"
          type="button"
          :class="['vp-vcr-speed-control__btn', { 'vp-vcr-speed-control__btn--active': modelValue === s }]"
          :disabled="disabled"
          :aria-pressed="modelValue === s"
          @click="pickSpeed(s)"
        >
          {{ s }}x
        </button>
      </div>
      <div class="vp-vcr-speed-control__toolbar">
        <button type="button" class="vp-vcr-speed-control__btn vp-vcr-speed-control__btn--ghost" :disabled="disabled" @click="resetSpeed">
          {{ t(LocaleKeys.button.reset) }}
        </button>
        <button type="button" class="vp-vcr-speed-control__btn" :disabled="disabled" @click="pickSpeed(1)">
          {{ t(LocaleKeys.button.confirm) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
