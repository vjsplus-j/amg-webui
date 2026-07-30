<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { NoticeBarProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<NoticeBarProps>(), {
  severity: 'info',
  closable: true,
  scrollable: true,
  speed: 50,
  pauseOnHover: true
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'click', event: MouseEvent): void
}>()
const { t } = useLocale()
const visible = ref(true)

const rootClass = computed(() => [
  'vp-notice-bar',
  `vp-notice-bar--${props.severity}`,
  {
    'vp-notice-bar--scroll': props.scrollable && visible.value,
    'vp-notice-bar--hidden': !visible.value
  },
  props.class
])

function close() {
  visible.value = false
  emit('close')
}

function onTrackClick(e: MouseEvent) {
  emit('click', e)
}

onUnmounted(() => {
  visible.value = false
})
</script>

<template>
  <div v-if="visible" :class="rootClass" :style="style" role="status" aria-live="polite">
    <div
      class="vp-notice-bar__track"
      :class="{ 'vp-notice-bar__track--pause': pauseOnHover }"
      :style="scrollable ? { '--vp-notice-speed': `${props.speed}s` } : undefined"
      @click="onTrackClick"
    >
      <span class="vp-notice-bar__text">
        <slot>{{ message }}</slot>
      </span>
    </div>
    <button
      v-if="closable"
      type="button"
      class="vp-notice-bar__close"
      :aria-label="t(LocaleKeys.common.close)"
      @click="close"
    >
      ×
    </button>
  </div>
</template>
