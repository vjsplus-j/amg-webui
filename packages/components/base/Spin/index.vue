<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { SpinProps } from './types'
import { useSpin } from './useSpin'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SpinProps>(), {
  spinning: true,
  size: 'md',
  delay: 0,
  fullscreen: false,
  telemetry: undefined
})

/** Inline — imported `SpinEmits` is not expanded into runtime emits. */
const emit = defineEmits<{
  visibleChange: [visible: boolean]
}>()

const { t } = useLocale()

const { delayedSpinning, tipText, statusLabel, motionAllowed } = useSpin(() => ({
  spinning: props.spinning,
  delay: props.delay,
  tip: props.tip,
  tipFallback: t(LocaleKeys.common.loading),
  ariaLabel: props.ariaLabel
}))

watch(delayedSpinning, (v) => {
  emit('visibleChange', v)
})

const rootClass = computed(() => [
  'vp-spin',
  `vp-spin--${props.size}`,
  {
    'vp-spin--spinning': delayedSpinning.value,
    'vp-spin--fullscreen': props.fullscreen,
    'vp-spin--nested': true,
    'vp-spin--motion-off': !motionAllowed.value
  },
  props.class
])
</script>

<template>
  <div :class="rootClass" :style="props.style">
    <div
      v-if="delayedSpinning"
      class="vp-spin__mask"
      role="status"
      aria-live="polite"
      :aria-busy="true"
      :aria-label="statusLabel"
    >
      <span class="vp-spin__indicator" aria-hidden="true">
        <slot name="indicator">
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
        </slot>
      </span>
      <span v-if="tipText" class="vp-spin__tip">{{ tipText }}</span>
    </div>
    <div
      v-if="$slots.default"
      class="vp-spin__container"
      :aria-hidden="delayedSpinning || undefined"
    >
      <slot />
    </div>
  </div>
</template>
