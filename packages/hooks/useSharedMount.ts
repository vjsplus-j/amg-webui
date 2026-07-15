import { createApp, type Component, type ComponentPublicInstance } from 'vue'

let container: HTMLElement | null = null

function getContainer(): HTMLElement {
  if (!container) {
    container = document.createElement('div')
    container.id = 'amg-webui-shared-container'
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.pointerEvents = 'none'
    container.style.zIndex = '9999'
    document.body.appendChild(container)
  }
  return container
}

export interface MountOptions {
  props?: Record<string, unknown>
  onClose?: () => void
}

export function useSharedMount() {
  const mount = (component: Component, options: MountOptions = {}): { unmount: () => void; instance: ComponentPublicInstance | null } => {
    const container = getContainer()
    const instanceContainer = document.createElement('div')
    instanceContainer.style.pointerEvents = 'auto'
    container.appendChild(instanceContainer)

    const app = createApp(component, options.props)
    const instance = app.mount(instanceContainer)

    const unmount = () => {
      app.unmount()
      instanceContainer.remove()
      options.onClose?.()
    }

    return { unmount, instance }
  }

  return { mount }
}
