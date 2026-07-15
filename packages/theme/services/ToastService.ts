export type ToastSeverity = 'success' | 'info' | 'warn' | 'error'

export interface ToastMessage {
  id: string
  severity?: ToastSeverity
  summary?: string
  detail?: string
  life?: number
  sticky?: boolean
}

let container: HTMLElement | null = null
let toasts: ToastMessage[] = []

function getContainer(): HTMLElement {
  if (!container) {
    container = document.createElement('div')
    container.id = 'amg-webui-toast-container'
    container.style.position = 'fixed'
    container.style.top = '20px'
    container.style.right = '20px'
    container.style.zIndex = '9999'
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.gap = '12px'
    document.body.appendChild(container)
  }
  return container
}

export class ToastService {
  static show(options: Omit<ToastMessage, 'id'>) {
    const toast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      severity: 'info',
      life: 3000,
      ...options
    }
    
    toasts.push(toast)
    ToastService.render()
    
    if (!toast.sticky && toast.life) {
      setTimeout(() => {
        ToastService.remove(toast.id)
      }, toast.life)
    }
    
    return toast.id
  }

  static success(options: Omit<ToastMessage, 'id' | 'severity'>) {
    return ToastService.show({ ...options, severity: 'success' })
  }

  static info(options: Omit<ToastMessage, 'id' | 'severity'>) {
    return ToastService.show({ ...options, severity: 'info' })
  }

  static warn(options: Omit<ToastMessage, 'id' | 'severity'>) {
    return ToastService.show({ ...options, severity: 'warn' })
  }

  static error(options: Omit<ToastMessage, 'id' | 'severity'>) {
    return ToastService.show({ ...options, severity: 'error' })
  }

  static remove(id: string) {
    toasts = toasts.filter(t => t.id !== id)
    ToastService.render()
  }

  static clear() {
    toasts = []
    ToastService.render()
  }

  static render() {
    const container = getContainer()
    container.innerHTML = ''
    
    toasts.forEach((toast) => {
      const toastEl = document.createElement('div')
      toastEl.style.background = 'var(--surface-1)'
      toastEl.style.border = '1px solid var(--border-color)'
      toastEl.style.borderRadius = 'var(--border-radius-md)'
      toastEl.style.padding = '16px'
      toastEl.style.minWidth = '300px'
      toastEl.style.boxShadow = 'var(--shadow-lg)'
      toastEl.style.display = 'flex'
      toastEl.style.alignItems = 'flex-start'
      toastEl.style.gap = '12px'
      toastEl.style.animation = 'slideInRight 0.3s ease'
      
      const icon = document.createElement('div')
      icon.style.fontSize = '20px'
      icon.style.flexShrink = '0'
      
      const severityColors: Record<ToastSeverity, string> = {
        success: '#10b981',
        info: '#3b82f6',
        warn: '#f59e0b',
        error: '#ef4444'
      }
      
      const severityIcons: Record<ToastSeverity, string> = {
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
        warn: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'
      }
      
      icon.innerHTML = severityIcons[toast.severity || 'info']
      icon.style.color = severityColors[toast.severity || 'info']
      
      const content = document.createElement('div')
      content.style.flex = '1'
      content.style.minWidth = '0'
      
      if (toast.summary) {
        const summary = document.createElement('div')
        summary.style.fontWeight = '600'
        summary.style.color = 'var(--text-primary)'
        summary.style.fontSize = 'var(--font-size-sm)'
        summary.textContent = toast.summary
        content.appendChild(summary)
      }
      
      if (toast.detail) {
        const detail = document.createElement('div')
        detail.style.color = 'var(--text-secondary)'
        detail.style.fontSize = 'var(--font-size-xs)'
        detail.style.marginTop = '4px'
        detail.textContent = toast.detail
        content.appendChild(detail)
      }
      
      const closeBtn = document.createElement('button')
      closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
      closeBtn.style.background = 'none'
      closeBtn.style.border = 'none'
      closeBtn.style.cursor = 'pointer'
      closeBtn.style.color = 'var(--text-muted)'
      closeBtn.style.padding = '0'
      closeBtn.style.flexShrink = '0'
      closeBtn.onclick = () => ToastService.remove(toast.id)
      
      toastEl.appendChild(icon)
      toastEl.appendChild(content)
      toastEl.appendChild(closeBtn)
      
      container.appendChild(toastEl)
    })
  }
}

export function useToast() {
  return {
    show: ToastService.show,
    success: ToastService.success,
    info: ToastService.info,
    warn: ToastService.warn,
    error: ToastService.error,
    remove: ToastService.remove,
    clear: ToastService.clear
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $toast: ReturnType<typeof useToast>
  }
}
