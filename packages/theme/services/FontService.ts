import {
  fonts,
  getDefaultThemeRuntime,
  resolveThemeFromStorage,
  createAutoStorage,
  type FontName,
  type FontConfig
} from '../core'

export type { FontName, FontConfig }
export { fonts }

export class FontService {
  static getCurrentFont(): FontName {
    return getDefaultThemeRuntime().getState().font
  }

  static setFont(font: FontName): void {
    getDefaultThemeRuntime().setFont(font)
  }

  /** Restore font from storage only — does not change design / scheme. */
  static init(): void {
    const resolved = resolveThemeFromStorage({ storage: createAutoStorage() })
    FontService.setFont(resolved.font)
  }

  static getFonts(): FontConfig[] {
    return fonts
  }

  static toggleFont(): FontName {
    const current = FontService.getCurrentFont()
    const idx = fonts.findIndex((f) => f.name === current)
    const next = fonts[(idx + 1) % fonts.length].name
    FontService.setFont(next)
    return next
  }

  static subscribe(fn: (font: FontName) => void): () => void {
    let last = FontService.getCurrentFont()
    return getDefaultThemeRuntime().subscribe((state) => {
      if (state.font !== last) {
        last = state.font
        fn(state.font)
      }
    })
  }
}

export function useFont() {
  return {
    setFont: FontService.setFont,
    getFont: FontService.getCurrentFont,
    getFonts: FontService.getFonts,
    toggleFont: FontService.toggleFont,
    initFont: FontService.init,
    subscribe: FontService.subscribe
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $font: ReturnType<typeof useFont>
  }
}
