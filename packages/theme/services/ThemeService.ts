import {
  designStyles,
  getDesignConfig,
  getDefaultThemeRuntime,
  configureDefaultThemeRuntime,
  type DesignStyleName,
  type DesignStyleConfig,
  type ColorScheme,
  type ThemeIconSet,
  type ThemeConfigureOptions,
  type ThemeInitOptions,
  type ThemeSnapshot
} from '../core'

export type { DesignStyleName, DesignStyleConfig, ColorScheme, ThemeIconSet }
export { designStyles }

export class ThemeService {
  /** Bind micro-FE root / namespaced storage / custom runtime. */
  static configure(options: ThemeConfigureOptions): void {
    configureDefaultThemeRuntime(options)
  }

  static getCurrentTheme(): DesignStyleName {
    return getDefaultThemeRuntime().getState().design
  }

  static getCurrentStyle(): DesignStyleName {
    return ThemeService.getCurrentTheme()
  }

  static getScheme(): ColorScheme {
    return getDefaultThemeRuntime().getState().scheme
  }

  static getConfig(style: DesignStyleName = ThemeService.getCurrentStyle()): DesignStyleConfig | undefined {
    return getDesignConfig(style)
  }

  static getState(): ThemeSnapshot {
    return getDefaultThemeRuntime().getState()
  }

  static setTheme(style: DesignStyleName): void {
    ThemeService.setStyle(style)
  }

  static setDesign(style: DesignStyleName): void {
    ThemeService.setStyle(style)
  }

  static setStyle(style: DesignStyleName): void {
    getDefaultThemeRuntime().setDesign(style)
  }

  static setScheme(scheme: ColorScheme): void {
    getDefaultThemeRuntime().setScheme(scheme)
  }

  /** Hot-apply CSS variable overlay without remounting (incremental merge). */
  static applyCustom(tokens: Record<string, string>): void {
    getDefaultThemeRuntime().applyCustom(tokens)
  }

  /** Replace the entire CSS-var overlay; absent keys are removed from host. */
  static replaceCustom(tokens: Record<string, string>): void {
    getDefaultThemeRuntime().replaceCustom(tokens)
  }

  static clearCustom(): void {
    getDefaultThemeRuntime().clearCustom()
  }

  /** Primary → full `--primary-*` scale overlay (fail-soft on invalid color). */
  static setPrimary(primary: string): void {
    getDefaultThemeRuntime().setPrimary(primary)
  }

  static init(options?: ThemeInitOptions): void {
    getDefaultThemeRuntime().init(options)
  }

  static getThemes(): DesignStyleConfig[] {
    return designStyles
  }

  static getStyles(): DesignStyleConfig[] {
    return designStyles
  }

  static toggleTheme(): DesignStyleName {
    const current = ThemeService.getCurrentStyle()
    const idx = designStyles.findIndex((s) => s.name === current)
    const next = designStyles[(idx + 1) % designStyles.length].name
    ThemeService.setStyle(next)
    return next
  }

  static toggleScheme(): ColorScheme {
    const next: ColorScheme = ThemeService.getScheme() === 'dark' ? 'light' : 'dark'
    ThemeService.setScheme(next)
    return next
  }

  static subscribe(fn: (style: DesignStyleName) => void): () => void {
    let last = ThemeService.getCurrentStyle()
    return getDefaultThemeRuntime().subscribe((state) => {
      if (state.design !== last) {
        last = state.design
        fn(state.design)
      }
    })
  }

  static subscribeScheme(fn: (scheme: ColorScheme) => void): () => void {
    let last = ThemeService.getScheme()
    return getDefaultThemeRuntime().subscribe((state) => {
      if (state.scheme !== last) {
        last = state.scheme
        fn(state.scheme)
      }
    })
  }

  /** SSR / FOUC: attribute map for the current snapshot. */
  static serializeAttrs(): Record<string, string> {
    return getDefaultThemeRuntime().serializeAttrs()
  }

  /** SSR: CSS rule text for custom token overlay. */
  static serializeStyle(selector?: string): string {
    return getDefaultThemeRuntime().serializeStyle(selector)
  }

  /** SSR: full `<style id="amg-theme-ssr">` tag. */
  static toStyleTag(options?: { id?: string; selector?: string }): string {
    return getDefaultThemeRuntime().toStyleTag(options)
  }

  /** Inline boot script body (storage → attrs before paint). */
  static toBootScript(): string {
    return getDefaultThemeRuntime().toBootScript()
  }
}

export function useTheme() {
  return {
    setTheme: ThemeService.setTheme,
    setStyle: ThemeService.setStyle,
    setDesign: ThemeService.setDesign,
    setScheme: ThemeService.setScheme,
    applyCustom: ThemeService.applyCustom,
    replaceCustom: ThemeService.replaceCustom,
    clearCustom: ThemeService.clearCustom,
    setPrimary: ThemeService.setPrimary,
    getTheme: ThemeService.getCurrentTheme,
    getStyle: ThemeService.getCurrentStyle,
    getScheme: ThemeService.getScheme,
    getConfig: ThemeService.getConfig,
    getState: ThemeService.getState,
    getThemes: ThemeService.getThemes,
    getStyles: ThemeService.getStyles,
    toggleTheme: ThemeService.toggleTheme,
    toggleScheme: ThemeService.toggleScheme,
    initTheme: ThemeService.init,
    configure: ThemeService.configure,
    subscribe: ThemeService.subscribe,
    subscribeScheme: ThemeService.subscribeScheme,
    serializeAttrs: ThemeService.serializeAttrs,
    serializeStyle: ThemeService.serializeStyle,
    toStyleTag: ThemeService.toStyleTag,
    toBootScript: ThemeService.toBootScript
  }
}

export { designStyles as themes }
export type ThemeName = DesignStyleName
export type ThemeConfig = DesignStyleConfig

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $theme: ReturnType<typeof useTheme>
  }
}
