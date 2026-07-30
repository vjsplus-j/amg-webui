<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { InfiniteScrollProps, InfiniteScrollEmits } from './types'
import { createInfiniteScrollObserver } from './useInfiniteScrollObserver'
import './style.scss'

const props = withDefaults(defineProps<InfiniteScrollProps>(), {
  distance: 0,
  disabled: false,
  immediate: true,
  loading: false,
  finished: false,
  telemetry: undefined
})

const emit = defineEmits<InfiniteScrollEmits>()
const { t } = useLocale()

const rootRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)

let controller: ReturnType<typeof createInfiniteScrollObserver> | null = null

const showLoadingTip = computed(() => props.loading && !props.finished)
const showFinishedTip = computed(() => props.finished)

function resolveScrollRoot(): Element | null {
  const target = props.scrollTarget
  if (!target) {
    const el = rootRef.value
    if (!el) return null
    return el.scrollHeight > el.clientHeight ? el : null
  }
  if (typeof target === 'string') {
    if (typeof document === 'undefined') return null
    const el = document.querySelector(target)
    return el
  }
  return target
}

function mountObserver() {
  controller?.destroy()
  if (!sentinelRef.value) return

  controller = createInfiniteScrollObserver(sentinelRef.value, {
    distance: props.distance,
    disabled: props.disabled,
    loading: props.loading,
    finished: props.finished,
    immediate: props.immediate,
    scrollRoot: resolveScrollRoot(),
    onLoad: () => emit('load')
  })
}

watch(
  () => [props.distance, props.disabled, props.loading, props.finished, props.scrollTarget] as const,
  () => {
    controller?.unlock()
    mountObserver()
  }
)

watch(
  () => props.loading,
  (loading) => {
    if (!loading) controller?.unlock()
  }
)

onMounted(() => {
  mountObserver()
})

onUnmounted(() => {
  controller?.destroy()
  controller = null
})
</script>

<template>
  <div
    ref="rootRef"
    :class="['vp-infinite-scroll', props.class]"
    :style="props.style"
    data-component="InfiniteScroll"
  >
    <slot />
    <div ref="sentinelRef" class="vp-infinite-scroll__sentinel" aria-hidden="true" />
    <div v-if="showLoadingTip || $slots.loading" class="vp-infinite-scroll__tip">
      <slot name="loading">{{ t(LocaleKeys.component.infiniteScroll.loading) }}</slot>
    </div>
    <div v-else-if="showFinishedTip || $slots.finished" class="vp-infinite-scroll__tip">
      <slot name="finished">{{ t(LocaleKeys.component.infiniteScroll.finished) }}</slot>
    </div>
  </div>
</template>
