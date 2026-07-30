<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '../Icon/index.vue'
import Button from '../Button/index.vue'
import InputText from '../InputText/index.vue'
import type { ConfirmSeverity } from '../Confirm/types'
import type { MessageBoxHostEmits, MessageBoxHostProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<MessageBoxHostProps>(), {
  visible: true,
  mode: 'confirm',
  closable: true,
  dismissible: true,
  severity: 'warning',
  confirmLabel: '',
  cancelLabel: '',
  inputValue: '',
  showCancel: undefined,
  telemetry: undefined
})

const emit = defineEmits<MessageBoxHostEmits>()
const { t } = useLocale()

const inputModel = ref(props.inputValue)
const inputInvalid = ref(false)

const confirmText = computed(() => props.confirmLabel || t(LocaleKeys.button.confirm))
const cancelText = computed(() => props.cancelLabel || t(LocaleKeys.button.cancel))
const closeLabel = computed(() => t(LocaleKeys.common.close))
const inputErrorText = computed(
  () => props.inputErrorMessage || t(LocaleKeys.component.messageBox.inputError)
)

const showCancelButton = computed(() => {
  if (props.showCancel !== undefined) return props.showCancel
  return props.mode !== 'alert'
})

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
  'vp-message-box',
  `vp-message-box--${props.severity}`,
  props.class
])

function validateInput(): boolean {
  if (props.mode !== 'prompt') return true
  const value = inputModel.value
  if (!props.inputPattern) {
    inputInvalid.value = false
    return true
  }
  const pattern =
    props.inputPattern instanceof RegExp
      ? props.inputPattern
      : new RegExp(props.inputPattern)
  const valid = pattern.test(value)
  inputInvalid.value = !valid
  return valid
}

function close() {
  emit('update:visible', false)
  emit('cancel')
}

function confirm() {
  if (!validateInput()) return
  emit('confirm', props.mode === 'prompt' ? inputModel.value : undefined)
  emit('update:visible', false)
}

function onOverlay(e: MouseEvent) {
  if (props.dismissible && e.target === e.currentTarget) close()
}

function onKey(e: KeyboardEvent) {
  if (!props.visible) return
  if (props.dismissible && e.key === 'Escape') close()
  if (e.key === 'Enter' && props.mode === 'prompt') confirm()
}

function lockScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

watch(
  () => props.inputValue,
  (value) => {
    inputModel.value = value
  }
)

watch(
  () => props.visible,
  (v) => lockScroll(v),
  { immediate: true }
)

watch(inputModel, () => {
  if (inputInvalid.value) validateInput()
})

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  lockScroll(false)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-message-box">
      <div
        v-if="visible"
        class="vp-message-box-overlay"
        role="presentation"
        @click="onOverlay"
      >
        <div
          :class="rootClass"
          :style="style"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="title ? 'vp-message-box-title' : undefined"
          :aria-describedby="message ? 'vp-message-box-desc' : undefined"
          data-component="MessageBox"
          @click.stop
        >
          <div class="vp-message-box__accent" aria-hidden="true" />

          <header class="vp-message-box__header">
            <div class="vp-message-box__lead">
              <span class="vp-message-box__icon" aria-hidden="true">
                <Icon :name="iconName" size="md" />
              </span>
              <div class="vp-message-box__titles">
                <h3
                  v-if="title"
                  id="vp-message-box-title"
                  class="vp-message-box__title"
                >
                  {{ title }}
                </h3>
              </div>
            </div>
            <button
              v-if="closable"
              type="button"
              class="vp-message-box__close"
              :aria-label="closeLabel"
              @click="close"
            >
              <Icon name="X" size="sm" />
            </button>
          </header>

          <div
            v-if="message || mode === 'prompt'"
            id="vp-message-box-desc"
            class="vp-message-box__body"
          >
            <p v-if="message" class="vp-message-box__message">{{ message }}</p>
            <InputText
              v-if="mode === 'prompt'"
              v-model="inputModel"
              class="vp-message-box__input"
              :placeholder="inputPlaceholder"
              :invalid="inputInvalid"
              fluid
            />
            <p v-if="inputInvalid" class="vp-message-box__error" role="alert">
              {{ inputErrorText }}
            </p>
          </div>

          <footer class="vp-message-box__footer">
            <Button
              v-if="showCancelButton"
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
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
