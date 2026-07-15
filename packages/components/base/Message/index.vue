<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { MessageProps, MessageEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<MessageProps>(), {
  severity: 'info',
  showIcon: true,
  closable: true,
  autoHide: false,
  hideDelay: 3000
})

const emit = defineEmits<MessageEmits>()

const visible = ref(true)
let hideTimer: number | null = null

const close = () => {
  visible.value = false
  emit('close')
}

const startHideTimer = () => {
  if (props.autoHide && props.hideDelay > 0) {
    stopHideTimer()
    hideTimer = window.setTimeout(() => {
      close()
    }, props.hideDelay)
  }
}

const stopHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

watch(() => props.autoHide, () => {
  startHideTimer()
})

watch(() => props.hideDelay, () => {
  startHideTimer()
})

onMounted(() => {
  startHideTimer()
})

onUnmounted(() => {
  stopHideTimer()
})
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="p-message" :class="`p-message-${severity}`" :style="style">
      <span v-if="showIcon" class="p-message-icon">
        <svg v-if="severity === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <svg v-else-if="severity === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <svg v-else-if="severity === 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </span>

      <span class="p-message-text">
        <slot>{{ text }}</slot>
      </span>

      <button v-if="closable" class="p-message-close" @click="close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>