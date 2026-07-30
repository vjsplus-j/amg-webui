import './confirmService.scss'
import { LocaleService, LocaleKeys } from '@amg-webui/locale'

export type ConfirmSeverity = 'success' | 'info' | 'warn' | 'error'

export interface ConfirmOptions {
  message: string
  header?: string
  icon?: string
  severity?: ConfirmSeverity
  acceptLabel?: string
  rejectLabel?: string
  accept?: () => void
  reject?: () => void
}

let container: HTMLElement | null = null

const SEVERITY_ICONS: Record<ConfirmSeverity, string> = {
  success:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>',
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  warn: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  error:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>'
}

function t(key: string, fallback: string) {
  try {
    const value = LocaleService.t(key, undefined, fallback)
    return value && value !== key ? value : fallback
  } catch {
    return fallback
  }
}

function getContainer(): HTMLElement {
  if (!container) {
    container = document.createElement('div')
    container.id = 'amg-webui-confirm-container'
    document.body.appendChild(container)
  }
  return container
}

export class ConfirmService {
  static require(options: ConfirmOptions) {
    const host = getContainer()
    host.innerHTML = ''
    host.classList.add('is-open')

    const severity: ConfirmSeverity = options.severity || 'warn'

    const mask = document.createElement('div')
    mask.className = 'vp-confirm-service-mask'

    const dialog = document.createElement('div')
    dialog.className = `vp-confirm-service vp-confirm-service--${severity}`
    dialog.setAttribute('role', 'alertdialog')
    dialog.setAttribute('aria-modal', 'true')

    const accent = document.createElement('div')
    accent.className = 'vp-confirm-service__accent'
    accent.setAttribute('aria-hidden', 'true')

    const header = document.createElement('div')
    header.className = 'vp-confirm-service__header'

    const icon = document.createElement('div')
    icon.className = 'vp-confirm-service__icon'
    icon.setAttribute('aria-hidden', 'true')
    icon.innerHTML = options.icon || SEVERITY_ICONS[severity]

    const title = document.createElement('h3')
    title.className = 'vp-confirm-service__title'
    title.textContent = options.header || t(LocaleKeys.button.confirm, 'Confirm')

    header.appendChild(icon)
    header.appendChild(title)

    const message = document.createElement('div')
    message.className = 'vp-confirm-service__message'
    message.textContent = options.message

    const footer = document.createElement('div')
    footer.className = 'vp-confirm-service__footer'

    const rejectBtn = document.createElement('button')
    rejectBtn.type = 'button'
    rejectBtn.className = 'vp-confirm-service__btn vp-confirm-service__btn--ghost'
    rejectBtn.textContent = options.rejectLabel || t(LocaleKeys.button.cancel, 'Cancel')
    rejectBtn.onclick = () => {
      ConfirmService.close()
      options.reject?.()
    }

    const acceptBtn = document.createElement('button')
    acceptBtn.type = 'button'
    acceptBtn.className = 'vp-confirm-service__btn vp-confirm-service__btn--primary'
    acceptBtn.textContent = options.acceptLabel || t(LocaleKeys.button.confirm, 'OK')
    acceptBtn.onclick = () => {
      ConfirmService.close()
      options.accept?.()
    }

    footer.appendChild(rejectBtn)
    footer.appendChild(acceptBtn)

    dialog.appendChild(accent)
    dialog.appendChild(header)
    dialog.appendChild(message)
    dialog.appendChild(footer)

    host.appendChild(mask)
    host.appendChild(dialog)

    mask.onclick = () => {
      ConfirmService.close()
      options.reject?.()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', onKey)
        ConfirmService.close()
        options.reject?.()
      }
    }
    document.addEventListener('keydown', onKey)
  }

  static close() {
    if (!container) return
    container.innerHTML = ''
    container.classList.remove('is-open')
  }
}

export function useConfirm() {
  return {
    require: ConfirmService.require
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $confirm: ReturnType<typeof useConfirm>
  }
}
