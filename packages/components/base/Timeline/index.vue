<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { TimelineProps } from './types'
import { TIMELINE_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(defineProps<TimelineProps>(), {
  mode: 'left',
  pending: false,
  reverse: false
})

const { t } = useLocale()
const itemCount = ref(0)

const claimIndex = () => itemCount.value++

provide(TIMELINE_INJECTION_KEY, {
  mode: computed(() => props.mode),
  pending: computed(() => props.pending),
  reverse: computed(() => props.reverse),
  claimIndex
})

const rootClass = computed(() => [
  'vp-timeline',
  `vp-timeline--mode-${props.mode}`,
  {
    'vp-timeline--reverse': props.reverse,
    'vp-timeline--pending': Boolean(props.pending)
  },
  props.class
])

const showPending = computed(() => props.pending !== false && props.pending !== '')

const pendingLabel = computed(() => {
  if (typeof props.pending === 'string' && props.pending.length > 0) {
    return props.pending
  }
  return t(LocaleKeys.component.timeline.pending)
})
</script>

<template>
  <ul
    :class="rootClass"
    :style="style"
    role="list"
    data-component="Timeline"
  >
    <slot />
    <li
      v-if="showPending"
      class="vp-timeline__pending"
      role="listitem"
      aria-live="polite"
    >
      <div class="vp-timeline-item__axis">
        <span
          class="vp-timeline-item__dot vp-timeline-item__dot--pending"
          aria-hidden="true"
        />
      </div>
      <div class="vp-timeline-item__content">
        <span class="vp-timeline__pending-text">{{ pendingLabel }}</span>
      </div>
    </li>
  </ul>
</template>
