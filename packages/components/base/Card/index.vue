<script setup lang="ts">
import { computed } from 'vue'
import Skeleton from '../Skeleton/index.vue'
import type { SkeletonVariant } from '../Skeleton/types'
import type { CardSkeleton } from './types'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    header?: string
    footer?: string
    title?: string
    subTitle?: string
    subtitle?: string
    raised?: boolean
    hover?: boolean
    hoverable?: boolean
    bordered?: boolean
    loading?: boolean
    skeleton?: CardSkeleton
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    telemetry: undefined,
    raised: false,
    hover: false,
    hoverable: false,
    bordered: true,
    loading: false,
    skeleton: 'basic'
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isHoverable = computed(() => props.hover || props.hoverable)
const resolvedSubtitle = computed(() => props.subTitle ?? props.subtitle)

const SKELETON_MAP: Record<CardSkeleton, SkeletonVariant> = {
  basic: 'card-basic',
  profile: 'card-profile',
  metric: 'card-metric',
  duo: 'card-duo',
  stats: 'card-stats',
  media: 'card-media',
  actions: 'card-actions',
  list: 'card-list',
  table: 'card-table',
  chart: 'card-chart',
  form: 'card-form',
  notice: 'card-notice',
  product: 'card-product',
  article: 'card-article',
  comment: 'card-comment',
  timeline: 'card-timeline',
  toolbar: 'card-toolbar'
}

const skeletonVariant = computed(
  () => SKELETON_MAP[props.skeleton] ?? ('card-basic' as SkeletonVariant)
)

const rootClass = computed(() => [
  'vp-card',
  'p-card',
  {
    'vp-card--hover': isHoverable.value,
    'p-card-hover': isHoverable.value,
    'vp-card--raised': props.raised,
    'p-card-raised': props.raised,
    'vp-card--bordered': props.bordered,
    'vp-card--loading': props.loading
  },
  props.class
])

function onClick(event: MouseEvent) {
  if (!isHoverable.value) return
  trackEmit({
    component: 'Card',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry,
    name: props.header || props.title
  })
  emit('click', event)
}

function onKeydown(event: KeyboardEvent) {
  if (!isHoverable.value) return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onClick(event as unknown as MouseEvent)
  }
}
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    :role="isHoverable ? 'button' : undefined"
    :tabindex="isHoverable ? 0 : undefined"
    :aria-disabled="loading || undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <div v-if="header || $slots.header || $slots.extra" class="vp-card__header p-card-header">
      <div class="vp-card__header-main">
        <slot name="header">
          <span v-if="header" class="vp-card__header-title p-card-header-title">{{ header }}</span>
        </slot>
      </div>
      <div v-if="$slots.extra" class="vp-card__extra">
        <slot name="extra" />
      </div>
    </div>

    <div v-if="$slots.cover" class="vp-card__cover">
      <slot name="cover" />
    </div>

    <div v-if="title" class="vp-card__title p-card-title">{{ title }}</div>
    <div v-if="resolvedSubtitle" class="vp-card__subtitle p-card-subtitle">
      {{ resolvedSubtitle }}
    </div>

    <div class="vp-card__body p-card-body">
      <Skeleton
        v-if="loading"
        :variant="skeletonVariant"
        :rows="2"
        class="vp-skeleton--in-card"
      />
      <slot v-else />
    </div>

    <div v-if="footer || $slots.footer" class="vp-card__footer p-card-footer">
      <slot name="footer">
        <span>{{ footer }}</span>
      </slot>
    </div>
  </div>
</template>
