import { createApp, h, ref, type App } from 'vue'
import { LocaleKeys, LocaleService, type LocaleKey } from '@amg-webui/locale'
import { isClient, getDocument, getWindow } from '@amg-webui/utils/env'
import MessageBoxHost from './MessageBoxHost.vue'
import type {
  MessageBoxAlertResult,
  MessageBoxConfirmResult,
  MessageBoxHostProps,
  MessageBoxMode,
  MessageBoxOptions,
  MessageBoxPromptResult
} from './types'

const TRANSITION_MS = 220

interface ActiveMessageBox {
  app: App
  container: HTMLElement
  cancel: (reason: 'programmatic' | 'replaced') => void
}

let active: ActiveMessageBox | null = null

function defaultLabel(key: LocaleKey, fallback: string): string {
  return LocaleService.t(key, undefined, fallback)
}

function destroy(instance: ActiveMessageBox) {
  getWindow()?.setTimeout(() => {
    if (active === instance) active = null
    instance.app.unmount()
    instance.container.remove()
  }, TRANSITION_MS)
}

interface OpenConfig extends MessageBoxOptions {
  message: string
  title?: string
  mode: MessageBoxMode
}

function open<T>(config: OpenConfig): Promise<T> {
  if (!isClient) {
    return Promise.reject(new Error('[MessageBox] requires a browser environment'))
  }

  MessageBox.close('replaced')

  return new Promise<T>((resolve) => {
    const doc = getDocument()
    if (!doc) {
      resolve('cancel' as T)
      return
    }

    const container = doc.createElement('div')
    doc.body.appendChild(container)
    const visible = ref(true)
    let settled = false
    let instance: ActiveMessageBox

    const finish = (result: T) => {
      if (settled) return
      settled = true
      visible.value = false
      if (active === instance) active = null
      destroy(instance)
      resolve(result)
    }

    const hostProps: MessageBoxHostProps = {
      visible: visible.value,
      title: config.title,
      message: config.message,
      mode: config.mode,
      severity: config.severity,
      confirmLabel: config.confirmLabel || defaultLabel(LocaleKeys.button.confirm, 'Confirm'),
      cancelLabel: config.cancelLabel || defaultLabel(LocaleKeys.button.cancel, 'Cancel'),
      dismissible: config.dismissible ?? true,
      closable: config.closable ?? true,
      inputPlaceholder: config.inputPlaceholder,
      inputValue: config.inputValue ?? '',
      inputPattern: config.inputPattern,
      inputValidator: config.inputValidator,
      inputErrorMessage: config.inputErrorMessage,
      inputType: config.inputType,
      closeOnClickOverlay: config.closeOnClickOverlay,
      closeOnPressEscape: config.closeOnPressEscape,
      autofocus: config.autofocus,
      beforeClose: config.beforeClose,
      teleportTo: config.teleportTo,
      showCancel: config.showCancel ?? config.mode !== 'alert'
    }

    const app = createApp({
      setup() {
        return () =>
          h(MessageBoxHost, {
            ...hostProps,
            visible: visible.value,
            'onUpdate:visible': (value: boolean) => {
              visible.value = value
            },
            onConfirm: (value?: string) => {
              if (config.mode === 'prompt') {
                finish({ value: value ?? '' } as T)
                return
              }
              finish('confirm' as T)
            },
            onCancel: () => finish('cancel' as T)
          })
      }
    })

    app.mount(container)
    instance = {
      app,
      container,
      cancel: () => finish('cancel' as T)
    }
    active = instance
  })
}

export const MessageBox = {
  confirm(
    message: string,
    title?: string,
    options?: MessageBoxOptions
  ): Promise<MessageBoxConfirmResult> {
    return open<MessageBoxConfirmResult>({
      message,
      title,
      mode: 'confirm',
      ...options,
      showCancel: options?.showCancel ?? true
    })
  },

  alert(
    message: string,
    title?: string,
    options?: MessageBoxOptions
  ): Promise<MessageBoxAlertResult> {
    return open<MessageBoxAlertResult>({
      message,
      title,
      mode: 'alert',
      ...options,
      showCancel: false
    })
  },

  prompt(
    message: string,
    title?: string,
    options?: MessageBoxOptions
  ): Promise<MessageBoxPromptResult> {
    return open<MessageBoxPromptResult>({
      message,
      title,
      mode: 'prompt',
      ...options,
      showCancel: options?.showCancel ?? true
    })
  },

  close(reason: 'programmatic' | 'replaced' = 'programmatic') {
    active?.cancel(reason)
  }
}

export default MessageBox
