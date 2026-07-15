<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { SuccessModalProps, SuccessModalEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<SuccessModalProps>(), {
  visible: false,
  closable: true,
  dismissible: true,
  severity: 'success',
  confirmLabel: '',
  cancelLabel: ''
})
const emit = defineEmits<SuccessModalEmits>()
const { t } = useLocale()

const confirmText = computed(() => props.confirmLabel || t(LocaleKeys.button.confirm))
const cancelText = computed(() => props.cancelLabel || t(LocaleKeys.button.cancel))
const closeLabel = computed(() => t(LocaleKeys.common.close))

const rootClass = computed(() => [
  'vp-success-modal',
  `vp-success-modal--${props.severity}`,
  props.class
])

function close(e?: Event) {
  emit('update:visible', false)
  emit('cancel', e ?? new Event('cancel'))
}

function confirm(e: Event) {
  emit('confirm', e)
  emit('update:visible', false)
}

function onOverlay(e: MouseEvent) {
  if (props.dismissible && e.target === e.currentTarget) close(e)
}

function onKey(e: KeyboardEvent) {
  if (props.visible && props.dismissible && e.key === 'Escape') close(e)
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-success-modal-fade">
      <div v-if="visible" class="vp-success-modal-overlay" @click="onOverlay">
        <div :class="rootClass" :style="style" role="alertdialog" @click.stop>
          <header class="vp-success-modal__header">
            <h3 class="vp-success-modal__title">
              <slot name="title">{{ title }}</slot>
            </h3>
            <button
              v-if="closable"
              type="button"
              class="vp-success-modal__close"
              :aria-label="closeLabel"
              @click="close"
            >×</button>
          </header>
          <div class="vp-success-modal__body">
            <slot>{{ message }}</slot>
          </div>
          <footer class="vp-success-modal__footer">
            <slot name="footer">
              <button type="button" class="vp-success-modal__btn vp-success-modal__btn--ghost" @click="close">
                {{ cancelText }}
              </button>
              <button type="button" class="vp-success-modal__btn vp-success-modal__btn--primary" @click="confirm">
                {{ confirmText }}
              </button>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
