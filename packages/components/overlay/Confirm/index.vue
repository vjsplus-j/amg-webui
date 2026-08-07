<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale, useOverlay } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '@amg-webui/core/Icon/index.vue'
import Button from '@amg-webui/core/Button/index.vue'
import type { ConfirmProps, ConfirmEmits, ConfirmSeverity } from './types'
import './style.scss'

const props = withDefaults(defineProps<ConfirmProps>(), {
  visible: false,
  closable: true,
  dismissible: true,
  severity: 'warning',
  confirmLabel: '',
  cancelLabel: ''
})
const emit = defineEmits<ConfirmEmits>()
const { t } = useLocale()

const panelRef = ref<HTMLElement | null>(null)
const visibleRef = computed(() => props.visible)
const dismissibleRef = computed(() => props.dismissible)

const confirmText = computed(() => props.confirmLabel || t(LocaleKeys.button.confirm))
const cancelText = computed(() => props.cancelLabel || t(LocaleKeys.button.cancel))
const closeLabel = computed(() => t(LocaleKeys.common.close))

const ICON_MAP: Record<ConfirmSeverity, string> = {
  primary: 'Info',
  secondary: 'CircleQuestionMark',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  danger: 'CircleAlert',
  info: 'Info',
  contrast: 'Shield'
}

const iconName = computed(() => ICON_MAP[props.severity] ?? 'TriangleAlert')

const confirmSeverity = computed(() => {
  switch (props.severity) {
    case 'danger':
      return 'danger'
    case 'success':
      return 'success'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    case 'secondary':
      return 'secondary'
    case 'contrast':
      return 'contrast'
    default:
      return 'primary'
  }
})

const rootClass = computed(() => [
  'vp-confirm',
  `vp-confirm--${props.severity}`,
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

const overlay = useOverlay({
  visible: visibleRef,
  kind: 'modal',
  container: panelRef,
  modal: true,
  lockScroll: true,
  trapFocus: true,
  restoreFocus: true,
  closeOnEscape: dismissibleRef,
  onEscape: () => {
    if (props.dismissible) close()
  }
})
</script>

<template>
  <Teleport :to="overlay.teleportTo.value ?? 'body'">
    <Transition name="vp-confirm">
      <div
        v-if="visible"
        class="vp-confirm-overlay"
        :style="overlay.zIndex.value !== undefined ? { zIndex: String(overlay.zIndex.value) } : undefined"
        role="presentation"
        @click="onOverlay"
      >
        <div
          ref="panelRef"
          :class="rootClass"
          :style="style"
          role="alertdialog"
          :aria-modal="overlay.ariaModal.value || undefined"
          :aria-labelledby="title ? overlay.titleId : undefined"
          :aria-describedby="message || $slots.default ? `${overlay.titleId}-desc` : undefined"
          tabindex="-1"
          @click.stop
        >
          <div class="vp-confirm__accent" aria-hidden="true" />

          <header class="vp-confirm__header">
            <div class="vp-confirm__lead">
              <span class="vp-confirm__icon" aria-hidden="true">
                <slot name="icon">
                  <Icon :name="iconName" size="md" />
                </slot>
              </span>
              <div class="vp-confirm__titles">
                <h3
                  v-if="title || $slots.title"
                  :id="overlay.titleId"
                  class="vp-confirm__title"
                >
                  <slot name="title">{{ title }}</slot>
                </h3>
              </div>
            </div>
            <button
              v-if="closable"
              type="button"
              class="vp-confirm__close"
              :aria-label="closeLabel"
              @click="close"
            >
              <Icon name="X" size="sm" />
            </button>
          </header>

          <div
            v-if="message || $slots.default"
            :id="`${overlay.titleId}-desc`"
            class="vp-confirm__body"
          >
            <slot>{{ message }}</slot>
          </div>

          <footer class="vp-confirm__footer">
            <slot name="footer">
              <Button
                variant="outlined"
                size="md"
                :label="cancelText"
                @click="close"
              />
              <Button
                variant="solid"
                size="md"
                :severity="confirmSeverity"
                :label="confirmText"
                @click="confirm"
              />
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
