<script setup lang="ts">
import { computed } from 'vue'
import type { LoadingProps } from './types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import './style.scss'

const props = withDefaults(defineProps<LoadingProps>(), {
  visible: true,
  fullscreen: false,
  size: 'md',
  lockScroll: true
})

/** Inline emits — SFC compiler may fail to resolve imported call-signature Emits. */
const emit = defineEmits<{
  (e: 'after-enter'): void
  (e: 'after-leave'): void
}>()
const { t } = useLocale()

const loadingText = computed(() => props.text ?? t(LocaleKeys.common.loading))

const loadingClass = computed(() => [
  'vp-loading',
  `vp-loading--size-${props.size}`,
  {
    'vp-loading--fullscreen': props.fullscreen,
    'vp-loading--inline': !props.fullscreen,
    'vp-loading--lock': props.lockScroll && props.fullscreen
  },
  props.class
])

function onAfterEnter() {
  emit('after-enter')
}

function onAfterLeave() {
  emit('after-leave')
}
</script>

<template>
  <Transition name="vp-loading-fade" @after-enter="onAfterEnter" @after-leave="onAfterLeave">
    <div
      v-if="visible"
      :class="loadingClass"
      :style="style"
      role="status"
      aria-live="polite"
      :aria-busy="true"
      :aria-label="loadingText"
    >
      <div class="vp-loading__overlay">
        <span class="vp-loading__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
            <path
              fill="currentColor"
              opacity="0.75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
        <span v-if="loadingText" class="vp-loading__text">{{ loadingText }}</span>
      </div>
    </div>
  </Transition>
</template>
