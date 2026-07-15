<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ScrollNoticeProps, ScrollNoticeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ScrollNoticeProps & { text?: string; speed?: number }>(), {
  text: '',
  speed: 40,
  disabled: false
})
const emit = defineEmits<ScrollNoticeEmits>()
const { t } = useLocale()
const paused = ref(false)

const message = computed(() => {
  if (props.text) return props.text
  if (typeof props.data === 'string') return props.data
  return t('component.scroll-notice.lead')
})

const duration = computed(() => `${Math.max(8, message.value.length / props.speed * 10)}s`)

const titleText = computed(() => props.title ?? t('component.scroll-notice.title'))
</script>

<template>
  <div
    :class="['vp-scroll-notice', 'vp-scroll-notice__panel', { 'vp-scroll-notice--disabled': disabled, 'vp-scroll-notice--paused': paused }, props.class]"
    :style="style"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @click="emit('click', $event)"
  >
    <span class="vp-scroll-notice__label">{{ titleText }}</span>
    <div class="vp-scroll-notice__track">
      <p class="vp-scroll-notice__text" :style="{ animationDuration: duration }">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.vp-scroll-notice {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  overflow: hidden;
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--spacing-sm) var(--spacing-md);
}
.vp-scroll-notice__label {
  flex-shrink: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary-500);
}
.vp-scroll-notice__track {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
}
.vp-scroll-notice__text {
  display: inline-block;
  margin: 0;
  padding-left: 100%;
  animation: vp-scroll-notice-marquee linear infinite;
  font-size: var(--font-size-md);
  color: var(--text-primary);
}
.vp-scroll-notice--paused .vp-scroll-notice__text {
  animation-play-state: paused;
}
@keyframes vp-scroll-notice-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
</style>
