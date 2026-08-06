import {
  iconStyles,
  getDefaultThemeRuntime,
  resolveThemeFromStorage,
  createAutoStorage,
  type IconStyleName,
  type IconStyleConfig
} from '../core'

export type { IconStyleName, IconStyleConfig }
export { iconStyles }

export class IconStyleService {
  static getCurrentStyle(): IconStyleName {
    return getDefaultThemeRuntime().getState().iconStyle
  }

  static setStyle(style: IconStyleName): void {
    getDefaultThemeRuntime().setIconStyle(style)
  }

  /** Restore icon style from storage only — does not change design / font. */
  static init(): void {
    const resolved = resolveThemeFromStorage({ storage: createAutoStorage() })
    IconStyleService.setStyle(resolved.iconStyle)
  }

  static getStyles(): IconStyleConfig[] {
    return iconStyles
  }

  static toggleStyle(): IconStyleName {
    const current = IconStyleService.getCurrentStyle()
    const idx = iconStyles.findIndex((s) => s.name === current)
    const next = iconStyles[(idx + 1) % iconStyles.length].name
    IconStyleService.setStyle(next)
    return next
  }

  static subscribe(fn: (style: IconStyleName) => void): () => void {
    let last = IconStyleService.getCurrentStyle()
    return getDefaultThemeRuntime().subscribe((state) => {
      if (state.iconStyle !== last) {
        last = state.iconStyle
        fn(state.iconStyle)
      }
    })
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
