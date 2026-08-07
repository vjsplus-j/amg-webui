<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale, useOverlay } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { Severity } from '@amg-webui/types'
import Icon from '@amg-webui/core/Icon/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import type { ConfirmDialogProps, ConfirmDialogEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  visible: false,
  message: '',
  title: '',
  icon: 'warning',
  confirmLabel: '',
  cancelLabel: '',
  modal: true,
  draggable: false,
  closable: true,
  dismissible: true,
  telemetry: undefined
})

const emit = defineEmits<ConfirmDialogEmits>()
const { t } = useLocale()

const confirmText = computed(() => props.confirmLabel || t(LocaleKeys.button.confirm))
const cancelText = computed(() => props.cancelLabel || t(LocaleKeys.button.cancel))
const closeLabel = computed(() => t(LocaleKeys.common.close))

const ICON_MAP: Record<Severity, string> = {
  primary: 'Info',
  secondary: 'Info',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  danger: 'CircleAlert',
  info: 'Info'
}

const iconName = computed(() => ICON_MAP[props.icon] ?? 'TriangleAlert')

const titleText = computed(() => {
  if (props.title) return props.title
  switch (props.icon) {
    case 'success':
      return t(LocaleKeys.common.success)
    case 'danger':
      return t(LocaleKeys.button.delete)
    case 'info':
      return t(LocaleKeys.button.confirm)
    default:
      return t(LocaleKeys.button.confirm)
  }
})

const confirmSeverity = computed(() => {
  if (props.icon === 'danger') return 'danger'
  if (props.icon === 'success') return 'success'
  if (props.icon === 'warning') return 'warning'
  if (props.icon === 'info') return 'info'
  return 'primary'
})

const isDragging = ref(false)
const dialogRef = ref<HTMLElement | null>(null)
const startX = ref(0)
const startY = ref(0)
const initialLeft = ref(0)
const initialTop = ref(0)
const visibleRef = computed(() => props.visible)
const modalRef = computed(() => props.modal)
const dismissibleRef = computed(() => props.dismissible)

const closeDialog = (event?: Event) => {
  emit('update:visible', false)
  if (event) emit('cancel', event)
}

const handleConfirm = (event: Event) => {
  emit('confirm', event)
  emit('update:visible', false)
}

const handleCancel = (event: Event) => {
  closeDialog(event)
}

const handleOverlayClick = (event: MouseEvent) => {
  if (!props.dismissible) return
  if (event.target === event.currentTarget) handleCancel(event)
}

const overlay = useOverlay({
  visible: visibleRef,
  kind: 'modal',
  container: dialogRef,
  modal: modalRef,
  lockScroll: modalRef,
  trapFocus: true,
  restoreFocus: true,
  closeOnEscape: dismissibleRef,
  onEscape: () => {
    if (props.dismissible) handleCancel(new Event('escape'))
  }
})

const handleMouseDown = (event: MouseEvent) => {
  if (!props.draggable || !dialogRef.value) return
  const target = event.target as HTMLElement
  if (target.closest('button, a, input, textarea')) return
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

watch(
  () => props.visible,
  (val) => {
    if (val && dialogRef.value) {
      dialogRef.value.style.left = ''
      dialogRef.value.style.top = ''
    }
  }
)

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <Teleport :to="overlay.teleportTo.value ?? 'body'">
    <Transition name="vp-confirm-dialog">
      <div
        v-if="visible"
        :class="[
          'vp-confirm-dialog-overlay',
          { 'vp-confirm-dialog-overlay--modal': modal }
        ]"
        :style="overlay.zIndex.value !== undefined ? { zIndex: String(overlay.zIndex.value) } : undefined"
        role="presentation"
        @click="handleOverlayClick"
      >
        <div
          ref="dialogRef"
          :class="[
            'vp-confirm-dialog',
            `vp-confirm-dialog--${icon}`,
            {
              'vp-confirm-dialog--draggable': draggable,
              'vp-confirm-dialog--dragging': isDragging
            },
            props.class
          ]"
          :style="style"
          role="alertdialog"
          :aria-modal="overlay.ariaModal.value || undefined"
          :aria-labelledby="overlay.titleId"
          tabindex="-1"
          @mousedown="handleMouseDown"
          @click.stop
        >
          <div class="vp-confirm-dialog__accent" aria-hidden="true" />

          <header class="vp-confirm-dialog__header">
            <div class="vp-confirm-dialog__lead">
              <span class="vp-confirm-dialog__icon" aria-hidden="true">
                <slot name="icon">
                  <Icon :name="iconName" size="md" />
                </slot>
              </span>
              <div class="vp-confirm-dialog__titles">
                <div :id="overlay.titleId" class="vp-confirm-dialog__title">
                  <slot name="title">{{ titleText }}</slot>
                </div>
              </div>
            </div>
            <button
              v-if="closable"
              type="button"
              class="vp-confirm-dialog__close"
              :aria-label="closeLabel"
              @click.stop="handleCancel"
            >
              <Icon name="X" size="sm" />
            </button>
          </header>

          <div class="vp-confirm-dialog__body">
            <slot>{{ message }}</slot>
          </div>

          <footer class="vp-confirm-dialog__footer">
            <slot name="footer">
              <Button
                variant="outlined"
                size="md"
                :label="cancelText"
                @click="handleCancel"
              />
              <Button
                variant="solid"
                size="md"
                :severity="confirmSeverity"
                :label="confirmText"
                @click="handleConfirm"
              />
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
