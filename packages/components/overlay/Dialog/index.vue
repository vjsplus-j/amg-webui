<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale, useOverlay } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { DialogCloseReason, DialogEmits, DialogProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<DialogProps>(), {
  visible: false,
  modal: true,
  dismissible: true,
  closable: true,
  maximizable: false,
  minimizable: false,
  size: 'md',
  width: '',
  lockScroll: true,
  teleportTo: 'body',
  telemetry: undefined
})

const emit = defineEmits<DialogEmits>()
const { t } = useLocale()

const panelRef = ref<HTMLElement | null>(null)
const isMaximized = ref(false)
const isMinimized = ref(false)

const visibleRef = computed(() => props.visible)
const modalRef = computed(() => props.modal)
const shouldLock = computed(() => props.modal && props.lockScroll)
const closeOnEscape = computed(
  () => props.closeOnPressEscape ?? props.dismissible
)
const closeOnOverlay = computed(
  () => props.closeOnClickOverlay ?? props.dismissible
)

function closeDialog(reason: DialogCloseReason = 'programmatic', event?: Event) {
  emit('update:visible', false)
  emit('close', event, reason)
  isMaximized.value = false
  isMinimized.value = false
}

const overlay = useOverlay({
  visible: visibleRef,
  kind: 'modal',
  container: panelRef,
  modal: modalRef,
  lockScroll: shouldLock,
  trapFocus: true,
  restoreFocus: true,
  closeOnEscape,
  zIndex: () => props.zIndex,
  teleportTo: () => props.teleportTo,
  onEscape: () => {
    if (closeOnEscape.value) closeDialog('escape')
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

const panelStyle = computed(() => {
  const style: Record<string, string> = { ...(props.style ?? {}) }
  if (!isMaximized.value) {
    style.width = props.width || SIZE_MAP[props.size] || SIZE_MAP.md
  }
  return style
})

const overlayStyle = computed(() => {
  const z = overlay.zIndex.value ?? props.zIndex
  return z === undefined ? undefined : { zIndex: String(z) }
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

const hasTitle = computed(() => !!(props.title || props.header))

function handleOverlayClick(event: MouseEvent) {
  if (
    props.modal &&
    closeOnOverlay.value &&
    event.target === event.currentTarget
  ) {
    closeDialog('overlay', event)
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
  }
)
</script>

<template>
  <Teleport :to="overlay.teleportTo.value ?? 'body'">
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
          :aria-modal="modal ? true : undefined"
          :aria-labelledby="overlay.labelledBy(hasTitle)"
          tabindex="-1"
          @click.stop
        >
          <header v-if="showHeader || $slots.header" class="vp-dialog__header">
            <div class="vp-dialog__title-wrap">
              <template v-if="$slots.header">
                <slot name="header" />
              </template>
              <h2
                v-else-if="title || header"
                :id="overlay.titleId"
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
                @click.stop="closeDialog('close-button', $event)"
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
