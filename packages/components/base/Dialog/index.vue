<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale, useOverlay } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '../Icon/index.vue'
import type { DialogProps, DialogEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  modal: true,
  dismissible: true,
  closable: true,
  maximizable: false,
  minimizable: false,
  size: 'md',
  width: ''
})

const emit = defineEmits<DialogEmits>()
const { t } = useLocale()

const panelRef = ref<HTMLElement | null>(null)
const visibleRef = computed(() => props.visible)
const modalRef = computed(() => props.modal)
const dismissibleRef = computed(() => props.dismissible)
const isMaximized = ref(false)
const isMinimized = ref(false)

const { zIndex } = useOverlay({
  visible: visibleRef,
  container: panelRef,
  modal: modalRef,
  trapFocus: modalRef,
  closeOnEscape: dismissibleRef,
  onClose: (reason) => {
    if (reason === 'escape') closeDialog(new Event('keydown'))
  }
})

const closeLabel = computed(() => t(LocaleKeys.common.close))
const maximizeLabel = computed(() =>
  isMaximized.value ? t(LocaleKeys.common.collapse) : t(LocaleKeys.common.expand)
)
const minimizeLabel = computed(() =>
  isMinimized.value ? t(LocaleKeys.common.expand) : t(LocaleKeys.common.collapse)
)

const SIZE_MAP: Record<string, string> = {
  sm: '24rem',
  md: '32rem',
  lg: '40rem',
  xl: '48rem',
  full: 'min(96vw, 72rem)'
}

const overlayStyle = computed(() => ({
  zIndex: String(zIndex.value)
}))

const panelStyle = computed(() => {
  const style: Record<string, string> = { ...(props.style ?? {}) }
  if (!isMaximized.value) {
    style.width = props.width || SIZE_MAP[props.size] || SIZE_MAP.md
  }
  return style
})

const showHeader = computed(
  () =>
    !!(
      props.header ||
      props.title ||
      props.closable ||
      props.maximizable ||
      props.minimizable
    )
)

function closeDialog(event: Event) {
  emit('update:visible', false)
  emit('close', event)
  isMaximized.value = false
  isMinimized.value = false
}

function handleOverlayClick(event: MouseEvent) {
  if (props.dismissible && event.target === event.currentTarget) {
    closeDialog(event)
  }
}

function toggleMaximize() {
  isMaximized.value = !isMaximized.value
  if (isMaximized.value) isMinimized.value = false
  emit('maximize', isMaximized.value)
}

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
  if (isMinimized.value) isMaximized.value = false
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      emit('show', new Event('show'))
    } else {
      emit('hide', new Event('hide'))
      isMaximized.value = false
      isMinimized.value = false
    }
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-dialog">
      <div
        v-if="visible"
        :class="[
          'vp-dialog-overlay',
          {
            'vp-dialog-overlay--modal': modal,
            'vp-dialog-overlay--minimized': isMinimized
          }
        ]"
        :style="overlayStyle"
        role="presentation"
        @click="handleOverlayClick"
      >
        <div
          ref="panelRef"
          :class="[
            'vp-dialog',
            `vp-dialog--${size}`,
            {
              'vp-dialog--maximized': isMaximized,
              'vp-dialog--minimized': isMinimized
            },
            props.class
          ]"
          :style="panelStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title || header ? 'vp-dialog-title' : undefined"
          @click.stop
        >
          <header v-if="showHeader || $slots.header" class="vp-dialog__header">
            <div class="vp-dialog__title-wrap">
              <template v-if="$slots.header">
                <slot name="header" />
              </template>
              <h2
                v-else-if="title || header"
                id="vp-dialog-title"
                class="vp-dialog__title"
              >
                {{ title || header }}
              </h2>
            </div>

            <div class="vp-dialog__actions">
              <button
                v-if="minimizable"
                type="button"
                class="vp-dialog__icon-btn"
                :aria-label="minimizeLabel"
                @click.stop="toggleMinimize"
              >
                <Icon :name="isMinimized ? 'Expand' : 'Minus'" size="sm" />
              </button>
              <button
                v-if="maximizable"
                type="button"
                class="vp-dialog__icon-btn"
                :aria-label="maximizeLabel"
                @click.stop="toggleMaximize"
              >
                <Icon :name="isMaximized ? 'Minimize' : 'Maximize'" size="sm" />
              </button>
              <button
                v-if="closable"
                type="button"
                class="vp-dialog__icon-btn"
                :aria-label="closeLabel"
                @click.stop="closeDialog"
              >
                <Icon name="X" size="sm" />
              </button>
            </div>
          </header>

          <div v-show="!isMinimized" class="vp-dialog__body">
            <slot />
          </div>

          <footer v-if="!isMinimized && (footer || $slots.footer)" class="vp-dialog__footer">
            <template v-if="$slots.footer">
              <slot name="footer" />
            </template>
            <template v-else>
              <span class="vp-dialog__footer-text">{{ footer }}</span>
            </template>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
