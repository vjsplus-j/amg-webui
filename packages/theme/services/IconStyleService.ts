export type IconStyleName = 'outline' | 'solid'

export interface IconStyleConfig {
  name: IconStyleName
  label: string
  description: string
}

/**
 * Lucide is stroke-based (Linear / Iconify Lucide).
 * Styles map to stroke weights, not fill vs stroke.
 * @see https://icon-sets.iconify.design/lucide/
 */
export const iconStyles: IconStyleConfig[] = [
  {
    name: 'outline',
    label: 'Linear 线框',
    description: 'Lucide 默认描边（stroke ≈ 1.75），对齐 Linear UI'
  },
  {
    name: 'solid',
    label: '加粗描边',
    description: 'Lucide 加粗描边（stroke ≈ 2.25），强调操作态'
  }
]

const STORAGE_KEY = 'amg-webui-icon-style-v2'
const ATTR = 'data-icon-style'
const DEFAULT_STYLE: IconStyleName = 'outline'

let currentStyle: IconStyleName = DEFAULT_STYLE
const listeners = new Set<(style: IconStyleName) => void>()

function notify() {
  listeners.forEach((fn) => fn(currentStyle))
}

export class IconStyleService {
  static getCurrentStyle(): IconStyleName {
    return currentStyle
  }

  static setStyle(style: IconStyleName): void {
    if (!iconStyles.some((s) => s.name === style)) return

    document.documentElement.setAttribute(ATTR, style)
    const stroke = style === 'solid' ? '2.25' : '1.75'
    document.documentElement.style.setProperty('--icon-stroke-width', stroke)
    currentStyle = style
    localStorage.setItem(STORAGE_KEY, style)
    notify()
  }

  static init(): void {
    const stored = localStorage.getItem(STORAGE_KEY) as IconStyleName | null
    const next = stored && iconStyles.some((s) => s.name === stored) ? stored : DEFAULT_STYLE
    IconStyleService.setStyle(next)
  }

  static getStyles(): IconStyleConfig[] {
    return iconStyles
  }

  static toggleStyle(): IconStyleName {
    const idx = iconStyles.findIndex((s) => s.name === currentStyle)
    const next = iconStyles[(idx + 1) % iconStyles.length].name
    IconStyleService.setStyle(next)
    return next
  }

  static subscribe(fn: (style: IconStyleName) => void): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }
}

export function useIconStyle() {
  return {
    setStyle: IconStyleService.setStyle,
    getStyle: IconStyleService.getCurrentStyle,
    getStyles: IconStyleService.getStyles,
    toggleStyle: IconStyleService.toggleStyle,
    initStyle: IconStyleService.init,
    subscribe: IconStyleService.subscribe
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $iconStyle: ReturnType<typeof useIconStyle>
  }
}
