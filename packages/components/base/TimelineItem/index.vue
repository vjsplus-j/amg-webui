<script setup lang="ts">
import { inject, computed, onMounted, ref } from 'vue'
import type { Severity } from '@amg-webui/types'
import type { TimelineItemProps } from './types'
import { TIMELINE_INJECTION_KEY } from '../Timeline/types'
import './style.scss'

const SEMANTIC_COLORS: Severity[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info'
]

const props = withDefaults(defineProps<TimelineItemProps>(), {
  type: 'primary',
  hollow: false,
  placement: 'bottom'
})

const timeline = inject(TIMELINE_INJECTION_KEY, null)
const itemIndex = ref(0)

onMounted(() => {
  if (timeline) {
    itemIndex.value = timeline.claimIndex()
  }
})

function isSemanticColor(value?: string): value is Severity {
  return Boolean(value && SEMANTIC_COLORS.includes(value as Severity))
}

const resolvedType = computed(() => {
  if (isSemanticColor(props.color)) return props.color
  return props.type ?? 'primary'
})

const dotStyle = computed(() => {
  if (props.color && !isSemanticColor(props.color)) {
    return { '--vp-timeline-color': props.color }
  }
  return undefined
})

const dotClass = computed(() => [
  'vp-timeline-item__dot',
  `vp-timeline-item__dot--${resolvedType.value}`,
  { 'vp-timeline-item__dot--hollow': props.hollow }
])

const resolvedSide = computed(() => {
  if (props.side) return props.side
  if (timeline?.mode.value === 'alternate') {
    return itemIndex.value % 2 === 0 ? 'left' : 'right'
  }
  if (timeline?.mode.value === 'right') return 'right'
  return 'left'
})

const rootClass = computed(() => [
  'vp-timeline-item',
  `vp-timeline-item--placement-${props.placement}`,
  `vp-timeline-item--side-${resolvedSide.value}`,
  props.class
])
</script>

<template>
  <li :class="rootClass" :style="style" role="listitem">
    <div class="vp-timeline-item__axis" aria-hidden="true">
      <slot name="dot">
        <span :class="dotClass" :style="dotStyle" />
      </slot>
      <span class="vp-timeline-item__tail" />
    </div>
    <div class="vp-timeline-item__content">
      <div
        v-if="label"
        class="vp-timeline-item__label"
      >
        {{ label }}
      </div>
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
