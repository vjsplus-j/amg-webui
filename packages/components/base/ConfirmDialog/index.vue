<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { ConfirmDialogProps, ConfirmDialogEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  visible: false,
  message: '',
  icon: 'warning',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  modal: true,
  draggable: true
})

const emit = defineEmits<ConfirmDialogEmits>()

const isDragging = ref(false)
const dialogRef = ref<HTMLElement | null>(null)
const startX = ref(0)
const startY = ref(0)
const initialLeft = ref(0)
const initialTop = ref(0)

const closeDialog = () => {
  emit('update:visible', false)
}

const handleConfirm = (event: Event) => {
  emit('confirm', event)
  closeDialog()
}

const handleCancel = (event: Event) => {
  emit('cancel', event)
  closeDialog()
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleCancel(event)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.visible && event.key === 'Escape') {
    handleCancel(event)
  }
}

const handleMouseDown = (event: MouseEvent) => {
  if (!props.draggable || !dialogRef.value) return
  isDragging.value = true
  startX.value = event.clientX
  startY.value = event.clientY
  initialLeft.value = dialogRef.value.offsetLeft
  initialTop.value = dialogRef.value.offsetTop
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !dialogRef.value) return
  const dx = event.clientX - startX.value
  const dy = event.clientY - startY.value
  dialogRef.value.style.left = `${initialLeft.value + dx}px`
  dialogRef.value.style.top = `${initialTop.value + dy}px`
}

const handleMouseUp = () => {
  isDragging.value = false
}

watch(() => props.visible, (val) => {
  if (val && dialogRef.value) {
    dialogRef.value.style.left = ''
    dialogRef.value.style.top = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :class="[
        'p-confirm-dialog-overlay',
        {
          'p-confirm-dialog-overlay-visible': visible
        }
      ]"
      @click="handleOverlayClick"
    >
      <div
        ref="dialogRef"
        :class="[
          'p-confirm-dialog',
          {
            'p-confirm-dialog-visible': visible,
            'p-confirm-dialog-draggable': draggable,
            'p-confirm-dialog-dragging': isDragging
          },
          props.class
        ]"
        :style="style"
        @mousedown="handleMouseDown"
      >
        <div class="p-confirm-dialog-header">
          <div :class="['p-confirm-dialog-icon', `p-confirm-dialog-icon-${icon}`]">
            <svg v-if="icon === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <svg v-else-if="icon === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <svg v-else-if="icon === 'danger'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div>
            <div class="p-confirm-dialog-title">
              <slot name="title">
                {{ icon === 'success' ? 'Success' : icon === 'danger' ? 'Delete' : icon === 'info' ? 'Information' : 'Confirm' }}
              </slot>
            </div>
          </div>
        </div>

        <div class="p-confirm-dialog-content">
          <div class="p-confirm-dialog-message">
            <slot>{{ message }}</slot>
          </div>
        </div>

        <div class="p-confirm-dialog-footer">
          <button
            class="p-confirm-dialog-btn p-confirm-dialog-btn-cancel"
            @click="handleCancel"
          >
            {{ cancelLabel }}
          </button>
          <button
            class="p-confirm-dialog-btn p-confirm-dialog-btn-confirm"
            @click="handleConfirm"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>