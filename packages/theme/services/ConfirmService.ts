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

function getContainer(): HTMLElement {
  if (!container) {
    container = document.createElement('div')
    container.id = 'amg-webui-confirm-container'
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.zIndex = '9999'
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.justifyContent = 'center'
    document.body.appendChild(container)
  }
  return container
}

export class ConfirmService {
  static require(options: ConfirmOptions) {
    const container = getContainer()
    container.innerHTML = ''
    
    const mask = document.createElement('div')
    mask.style.position = 'absolute'
    mask.style.top = '0'
    mask.style.left = '0'
    mask.style.width = '100%'
    mask.style.height = '100%'
    mask.style.background = 'rgba(0, 0, 0, 0.5)'
    mask.style.backdropFilter = 'blur(2px)'
    mask.style.animation = 'fadeIn 0.2s ease'
    
    const dialog = document.createElement('div')
    dialog.style.background = 'var(--surface-1)'
    dialog.style.border = '1px solid var(--border-color)'
    dialog.style.borderRadius = 'var(--border-radius-lg)'
    dialog.style.padding = '24px'
    dialog.style.minWidth = '320px'
    dialog.style.maxWidth = '480px'
    dialog.style.boxShadow = 'var(--shadow-xl)'
    dialog.style.position = 'relative'
    dialog.style.animation = 'scaleIn 0.2s ease'
    
    const icon = document.createElement('div')
    icon.style.fontSize = '32px'
    icon.style.marginBottom = '16px'
    icon.style.display = 'flex'
    icon.style.alignItems = 'center'
    
    const severityColors: Record<ConfirmSeverity, string> = {
      success: '#10b981',
      info: '#3b82f6',
      warn: '#f59e0b',
      error: '#ef4444'
    }
    
    const severityIcons: Record<ConfirmSeverity, string> = {
      success: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      info: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
      warn: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
      error: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'
    }
    
    icon.innerHTML = options.icon || severityIcons[options.severity || 'info']
    icon.style.color = severityColors[options.severity || 'info']
    
    const header = document.createElement('div')
    header.style.fontWeight = '600'
    header.style.fontSize = 'var(--font-size-lg)'
    header.style.color = 'var(--text-primary)'
    header.style.marginBottom = '12px'
    header.textContent = options.header || 'Confirmation'
    
    const message = document.createElement('div')
    message.style.color = 'var(--text-secondary)'
    message.style.fontSize = 'var(--font-size-sm)'
    message.style.lineHeight = '1.5'
    message.textContent = options.message
    
    const buttons = document.createElement('div')
    buttons.style.display = 'flex'
    buttons.style.justifyContent = 'flex-end'
    buttons.style.gap = '8px'
    buttons.style.marginTop = '20px'
    
    const rejectBtn = document.createElement('button')
    rejectBtn.textContent = options.rejectLabel || 'Cancel'
    rejectBtn.style.padding = '8px 16px'
    rejectBtn.style.border = '1px solid var(--border-color)'
    rejectBtn.style.borderRadius = 'var(--border-radius-md)'
    rejectBtn.style.background = 'var(--surface-1)'
    rejectBtn.style.color = 'var(--text-primary)'
    rejectBtn.style.fontSize = 'var(--font-size-sm)'
    rejectBtn.style.cursor = 'pointer'
    rejectBtn.style.transition = 'all var(--transition-fast)'
    rejectBtn.onmouseenter = () => {
      rejectBtn.style.background = 'var(--surface-2)'
      rejectBtn.style.borderColor = 'var(--border-color-hover)'
    }
    rejectBtn.onmouseleave = () => {
      rejectBtn.style.background = 'var(--surface-1)'
      rejectBtn.style.borderColor = 'var(--border-color)'
    }
    rejectBtn.onclick = () => {
      ConfirmService.close()
      options.reject?.()
    }
    
    const acceptBtn = document.createElement('button')
    acceptBtn.textContent = options.acceptLabel || 'OK'
    acceptBtn.style.padding = '8px 16px'
    acceptBtn.style.border = 'none'
    acceptBtn.style.borderRadius = 'var(--border-radius-md)'
    acceptBtn.style.background = 'var(--primary-500)'
    acceptBtn.style.color = 'white'
    acceptBtn.style.fontSize = 'var(--font-size-sm)'
    acceptBtn.style.cursor = 'pointer'
    acceptBtn.style.transition = 'all var(--transition-fast)'
    acceptBtn.onmouseenter = () => {
      acceptBtn.style.background = 'var(--primary-600)'
    }
    acceptBtn.onmouseleave = () => {
      acceptBtn.style.background = 'var(--primary-500)'
    }
    acceptBtn.onclick = () => {
      ConfirmService.close()
      options.accept?.()
    }
    
    buttons.appendChild(rejectBtn)
    buttons.appendChild(acceptBtn)
    
    dialog.appendChild(icon)
    dialog.appendChild(header)
    dialog.appendChild(message)
    dialog.appendChild(buttons)
    
    container.appendChild(mask)
    container.appendChild(dialog)
    
    mask.onclick = () => {
      ConfirmService.close()
      options.reject?.()
    }
  }

  static close() {
    const container = getContainer()
    container.innerHTML = ''
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
