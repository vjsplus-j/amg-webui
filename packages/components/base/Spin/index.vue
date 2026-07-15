<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { SpinSize } from './types'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    spinning?: boolean
    tip?: string
    size?: SpinSize
    delay?: number
    fullscreen?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    spinning: true,
    size: 'md',
    delay: 0,
    fullscreen: false
  }
)

const { t } = useLocale()
const delayedSpinning = ref(false)
let timer: ReturnType<typeof setTimeout> | 0 = 0

watch(
  () => props.spinning,
  (v) => {
    if (timer) {
      clearTimeout(timer)
      timer = 0
    }
    if (!v) {
      delayedSpinning.value = false
      return
    }
    if (!props.delay) {
      delayedSpinning.value = true
      return
    }
    timer = setTimeout(() => {
      delayedSpinning.value = true
      timer = 0
    }, props.delay)
  },
  { immediate: true }
)

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

const tipText = computed(() => props.tip ?? t(LocaleKeys.common.loading))

const rootClass = computed(() => [
  'vp-spin',
  `vp-spin--${props.size}`,
  {
    'vp-spin--spinning': delayedSpinning.value,
    'vp-spin--fullscreen': props.fullscreen,
    'vp-spin--nested': true
  },
  props.class
])
</script>

<template>
  <div :class="rootClass" :style="style">
    <div
      v-if="delayedSpinning"
      class="vp-spin__mask"
      role="status"
      aria-live="polite"
      :aria-busy="true"
    >
      <span class="vp-spin__indicator" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            stroke-width="3"
            opacity="0.2"
          />
          <path
            d="M21 12a9 9 0 00-9-9"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </span>
      <span v-if="tipText" class="vp-spin__tip">{{ tipText }}</span>
    </div>
    <div v-if="$slots.default" class="vp-spin__container" :aria-hidden="delayedSpinning || undefined">
      <slot />
    </div>
  </div>
</template>
