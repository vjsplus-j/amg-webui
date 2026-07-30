<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import './style.scss'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    message?: string
    /** Control size for spinner + type */
    size?: 'sm' | 'md' | 'lg'
    /** Delay ms before showing spinner (avoids flash on fast loads) */
    delay?: number
    /** Stretch to full content width */
    block?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    loading: true,
    size: 'md',
    delay: 0,
    block: false
  }
)

const { t } = useLocale()
const visible = ref(props.delay <= 0 && props.loading)
let timer: ReturnType<typeof setTimeout> | undefined

function clearTimer() {
  if (timer != null) {
    clearTimeout(timer)
    timer = undefined
  }
}

watch(
  () => [props.loading, props.delay] as const,
  ([loading, delay]) => {
    clearTimer()
    if (!loading) {
      visible.value = false
      return
    }
    if (!delay) {
      visible.value = true
      return
    }
    visible.value = false
    timer = setTimeout(() => {
      visible.value = true
      timer = undefined
    }, delay)
  },
  { immediate: true }
)

onUnmounted(clearTimer)

const rootClass = computed(() => [
  'vp-loading-tip',
  `vp-loading-tip--${props.size}`,
  {
    'vp-loading-tip--loading': visible.value,
    'vp-loading-tip--block': props.block
  },
  props.class
])

const label = computed(() => props.message ?? t(LocaleKeys.common.loading))
</script>

<template>
  <div
    v-if="visible"
    :class="rootClass"
    :style="style"
    role="status"
    aria-busy="true"
    data-component="LoadingTip"
  >
    <span class="vp-loading-tip__spinner" aria-hidden="true" />
    <span class="vp-loading-tip__text">{{ label }}</span>
    <slot />
  </div>
</template>
