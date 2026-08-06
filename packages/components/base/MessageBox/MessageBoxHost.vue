<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useFocusTrap } from '@amg-webui/hooks/useFocusTrap'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import { getDocument } from '@amg-webui/utils/env'
import Icon from '../Icon/index.vue'
import Button from '../Button/index.vue'
import InputText from '../InputText/index.vue'
import type { ConfirmSeverity } from '../Confirm/types'
import type {
  MessageBoxAction,
  MessageBoxCloseReason,
  MessageBoxHostEmits,
  MessageBoxHostProps
} from './types'
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
  inputType: 'text',
  showCancel: undefined,
  closeOnClickOverlay: undefined,
  closeOnPressEscape: undefined,
  autofocus: undefined,
  teleportTo: 'body',
  telemetry: undefined
})

const emit = defineEmits<MessageBoxHostEmits>()
const { t } = useLocale()

const inputModel = ref(props.inputValue)
const inputInvalid = ref(false)
const validatorMessage = ref('')
const working = ref(false)
const dialogRef = ref<HTMLElement | null>(null)
const cancelButtonRef = ref<{ $el?: HTMLElement } | null>(null)
const confirmButtonRef = ref<{ $el?: HTMLElement } | null>(null)
const visibleRef = computed(() => props.visible)
const uid = useId()

useFocusTrap(dialogRef, visibleRef)

const confirmText = computed(() => props.confirmLabel || t(LocaleKeys.button.confirm))
const cancelText = computed(() => props.cancelLabel || t(LocaleKeys.button.cancel))
const closeLabel = computed(() => t(LocaleKeys.common.close))
const titleText = computed(() => props.title || t(LocaleKeys.button.confirm))
const inputErrorText = computed(
  () => validatorMessage.value || props.inputErrorMessage || t(LocaleKeys.component.messageBox.inputError)
)
const titleId = `${uid}-title`
const descriptionId = `${uid}-description`

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
const closeOnOverlay = computed(
  () => props.closeOnClickOverlay ?? props.dismissible
)
const closeOnEscape = computed(
  () => props.closeOnPressEscape ?? props.dismissible
)
const resolvedAutofocus = computed(
  () => props.autofocus ?? (props.mode === 'prompt' ? 'input' : 'confirm')
)

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

async function validateInput(): Promise<boolean> {
  if (props.mode !== 'prompt') return true
  const value = inputModel.value
  validatorMessage.value = ''

  if (props.inputPattern) {
    try {
      const pattern =
        props.inputPattern instanceof RegExp
          ? props.inputPattern
          : new RegExp(props.inputPattern)
      pattern.lastIndex = 0
      if (!pattern.test(value)) {
        inputInvalid.value = true
        return false
      }
    } catch {
      inputInvalid.value = true
      return false
    }
  }

  if (props.inputValidator) {
    try {
      const result = await props.inputValidator(value)
      if (result !== true) {
        validatorMessage.value = typeof result === 'string' ? result : ''
        inputInvalid.value = true
        return false
      }
    } catch {
      inputInvalid.value = true
      return false
    }
  }

  inputInvalid.value = false
  return true
}

async function canClose(action: MessageBoxAction, value?: string) {
  if (!props.beforeClose) return true
  try {
    return await props.beforeClose(action, value)
  } catch {
    return false
  }
}

async function close(reason: MessageBoxCloseReason = 'cancel') {
  if (working.value) return
  working.value = true
  try {
    if (!(await canClose('cancel'))) return
    trackEmit({
      component: 'MessageBox',
      type: 'cancel',
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { mode: props.mode, reason }
    })
    emit('update:visible', false)
    emit('cancel', reason)
  } finally {
    working.value = false
  }
}

async function confirm() {
  if (working.value || !(await validateInput())) return
  working.value = true
  const value = props.mode === 'prompt' ? inputModel.value : undefined
  try {
    if (!(await canClose('confirm', value))) return
    trackEmit({
      component: 'MessageBox',
      type: 'confirm',
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { mode: props.mode }
    })
    emit('confirm', value)
    emit('update:visible', false)
  } finally {
    working.value = false
  }
}

function onOverlay(e: MouseEvent) {
  if (closeOnOverlay.value && e.target === e.currentTarget) void close('overlay')
}

function onKey(e: KeyboardEvent) {
  if (!props.visible) return
  if (closeOnEscape.value && e.key === 'Escape') {
    e.preventDefault()
    void close('escape')
  }
  if (e.key === 'Enter' && props.mode === 'prompt' && e.target instanceof HTMLInputElement) {
    e.preventDefault()
    void confirm()
  }
}

let previousOverflow: string | undefined

function lockScroll(lock: boolean) {
  const root = getDocument()?.documentElement
  if (!root) return
  if (lock) {
    if (previousOverflow === undefined) previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
  } else if (previousOverflow !== undefined) {
    root.style.overflow = previousOverflow
    previousOverflow = undefined
  }
}

function focusInitial() {
  if (resolvedAutofocus.value === 'none') return
  let target: Element | null | undefined
  if (resolvedAutofocus.value === 'confirm') target = confirmButtonRef.value?.$el
  else if (resolvedAutofocus.value === 'cancel') target = cancelButtonRef.value?.$el
  else target = dialogRef.value?.querySelector('input.vp-message-box__input')
  const focusable = target?.matches?.('button, input')
    ? target
    : target?.querySelector?.('button, input')
  if (focusable instanceof HTMLElement) focusable.focus()
}

watch(
  () => props.inputValue,
  (value) => {
    inputModel.value = value
  }
)

watch(
  () => props.visible,
  (v) => {
    lockScroll(v)
    if (v) void nextTick(focusInitial)
  },
  { immediate: true }
)

watch(inputModel, () => {
  if (inputInvalid.value) void validateInput()
})

onMounted(() => {
  getDocument()?.addEventListener('keydown', onKey)
  if (props.visible) void nextTick(focusInitial)
})
onUnmounted(() => {
  getDocument()?.removeEventListener('keydown', onKey)
  lockScroll(false)
})
</script>

<template>
  <Teleport :to="teleportTo">
    <Transition name="vp-message-box">
      <div
        v-if="visible"
        class="vp-message-box-overlay"
        role="presentation"
        @click="onOverlay"
      >
        <div
          ref="dialogRef"
          :class="rootClass"
          :style="style"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="message ? descriptionId : undefined"
          :aria-busy="working || undefined"
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
                <h3 :id="titleId" class="vp-message-box__title">
                  <slot name="title">{{ titleText }}</slot>
                </h3>
              </div>
            </div>
            <button
              v-if="closable"
              type="button"
              class="vp-message-box__close"
              :aria-label="closeLabel"
              :disabled="working"
              @click="close('close')"
            >
              <Icon name="X" size="sm" />
            </button>
          </header>

          <div
            v-if="message || mode === 'prompt'"
            :id="descriptionId"
            class="vp-message-box__body"
          >
            <p v-if="message" class="vp-message-box__message">
              <slot>{{ message }}</slot>
            </p>
            <InputText
              v-if="mode === 'prompt'"
              v-model="inputModel"
              class="vp-message-box__input"
              :placeholder="inputPlaceholder"
              :type="inputType"
              :invalid="inputInvalid"
              :disabled="working"
              fluid
            />
            <p v-if="inputInvalid" class="vp-message-box__error" role="alert">
              {{ inputErrorText }}
            </p>
          </div>

          <footer class="vp-message-box__footer">
            <slot name="footer" :confirm="confirm" :cancel="close" :working="working">
              <Button
                v-if="showCancelButton"
                ref="cancelButtonRef"
                variant="outlined"
                size="md"
                :label="cancelText"
                :disabled="working"
                @click="close('cancel')"
              />
              <Button
                ref="confirmButtonRef"
                variant="solid"
                size="md"
                :severity="confirmSeverity"
                :label="confirmText"
                :loading="working"
                @click="confirm"
              />
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
