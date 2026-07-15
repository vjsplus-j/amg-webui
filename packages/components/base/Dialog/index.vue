<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { DialogProps, DialogEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  modal: true,
  dismissible: true,
  closable: true,
  maximizable: false,
  minimizable: false
})

const emit = defineEmits<DialogEmits>()

const isMaximized = ref(false)

const closeDialog = (event: Event) => {
  emit('update:visible', false)
  emit('close', event)
}

const handleOverlayClick = (event: MouseEvent) => {
  if (props.dismissible && event.target === event.currentTarget) {
    closeDialog(event)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.visible && props.dismissible && event.key === 'Escape') {
    closeDialog(event)
  }
}

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value
}

watch(() => props.visible, (val) => {
  if (val) {
    emit('show', new Event('show'))
  } else {
    emit('hide', new Event('hide'))
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :class="[
        'p-dialog-overlay',
        {
          'p-dialog-overlay-visible': visible
        }
      ]"
      @click="handleOverlayClick"
    >
      <div
        :class="[
          'p-dialog',
          {
            'p-dialog-visible': visible,
            'p-dialog-maximized': isMaximized
          },
          props.class
        ]"
        :style="style"
      >
        <div v-if="header || $slots.header || title" class="p-dialog-header">
          <template v-if="$slots.header">
            <slot name="header" />
          </template>
          <template v-else>
            <span v-if="title" class="p-dialog-title">{{ title }}</span>
            <span v-else class="p-dialog-header-title">{{ header }}</span>
          </template>
          
          <div class="p-dialog-header-actions">
            <button
              v-if="minimizable"
              class="p-dialog-close-btn"
              @click.stop
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h12v-2H6v2zm0-5h12v-2H6v2zm0-7v2h12V7H6z"/>
              </svg>
            </button>
            <button
              v-if="maximizable"
              class="p-dialog-close-btn"
              @click.stop="toggleMaximize"
            >
              <svg v-if="!isMaximized" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h18v18H3V3zm8 2v8H5V5h6zm0 10v2H5v-2h6zm8 0v2h-6v-2h6zm0-10v8h-6V5h6z"/>
              </svg>
            </button>
            <button
              v-if="closable"
              class="p-dialog-close-btn"
              @click.stop="closeDialog"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-dialog-content">
          <slot />
        </div>
        
        <div v-if="footer || $slots.footer" class="p-dialog-footer">
          <template v-if="$slots.footer">
            <slot name="footer" />
          </template>
          <template v-else>
            <span>{{ footer }}</span>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>
