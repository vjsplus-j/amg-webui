<script setup lang="ts">
import { inject, computed } from 'vue'
import type { TimelineItemProps } from './types'
import { TIMELINE_INJECTION_KEY } from '../Timeline/types'
import './style.scss'

const props = withDefaults(defineProps<TimelineItemProps>(), {
  type: 'primary',
  hollow: false,
  placement: 'bottom'
})

inject(TIMELINE_INJECTION_KEY, null)

const dotStyle = computed(() =>
  props.color ? { '--vp-timeline-color': props.color } : undefined
)

const dotClass = computed(() => [
  'vp-timeline-item__dot',
  `vp-timeline-item__dot--${props.type}`,
  { 'vp-timeline-item__dot--hollow': props.hollow }
])

const rootClass = computed(() => [
  'vp-timeline-item',
  `vp-timeline-item--placement-${props.placement}`,
  props.class
])
</script>

<template>
  <li :class="rootClass" :style="style">
    <div class="vp-timeline-item__axis">
      <span :class="dotClass" :style="dotStyle" />
      <span class="vp-timeline-item__tail" aria-hidden="true" />
    </div>
    <div class="vp-timeline-item__content">
      <div
        v-if="timestamp && placement === 'top'"
        class="vp-timeline-item__timestamp vp-timeline-item__timestamp--top"
      >
        {{ timestamp }}
      </div>
      <div class="vp-timeline-item__body">
        <slot />
      </div>
      <div
        v-if="timestamp && placement === 'bottom'"
        class="vp-timeline-item__timestamp vp-timeline-item__timestamp--bottom"
      >
        {{ timestamp }}
      </div>
    </div>
  </li>
</template>
