import type { DesignStyleName, ColorScheme, ThemeIconSet, DesignStyleConfig } from './registry'
import type { FontName, FontConfig } from './registry'
import type { IconStyleName, IconStyleConfig } from './registry'

export type { DesignStyleName, ColorScheme, ThemeIconSet, DesignStyleConfig, FontName, FontConfig, IconStyleName, IconStyleConfig }

/** Full theme axes written to the host root (data-* + optional CSS vars). */
export interface ThemeSnapshot {
  design: DesignStyleName
  scheme: ColorScheme
  font: FontName
  iconStyle: IconStyleName
  /** CSS custom properties applied as overlay (keys with or without `--`). */
  customTokens: Record<string, string>
}

/** Host that receives attribute / CSS-var writes. No DOM required. */
export interface ThemeHost {
  setAttribute(name: string, value: string | null): void
  setStyleProperty(name: string, value: string | null): void
  removeClassNames?(names: readonly string[]): void
}

/** Pluggable persistence (localStorage, memory, per-micro-app namespace). */
export interface ThemeStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface ThemeRuntimeOptions {
  /** Defaults to null host (SSR-safe). Bind a document/shadow host on the client. */
  host?: ThemeHost
  /** Defaults to memory storage. */
  storage?: ThemeStorage
  /**
   * Prefix for storage keys — isolate micro-frontends / multi-tenant shells.
   * Full keys: `${namespace}-design-v3`, etc.
   * @default 'amg-webui'
   */
  storageNamespace?: string
  defaults?: Partial<Pick<ThemeSnapshot, 'design' | 'scheme' | 'font' | 'iconStyle'>>
  /** When design changes, sync brand font from registry (matches legacy ThemeService). @default true */
  syncBrandFont?: boolean
  /** Persist axes to storage on each set. @default true */
  persist?: boolean
}

export type ThemeListener = (state: ThemeSnapshot) => void

export interface ThemeInitOptions {
  /** Read storage before applying defaults / overrides. @default true */
  preferStorage?: boolean
  /** Explicit overrides (URL `?design=` etc.). Win over storage. */
  overrides?: Partial<Pick<ThemeSnapshot, 'design' | 'scheme' | 'font' | 'iconStyle'>>
}

export interface ThemeRuntime {
  getState(): ThemeSnapshot
  setDesign(design: DesignStyleName): void
  setScheme(scheme: ColorScheme): void
  setFont(font: FontName): void
  setIconStyle(style: IconStyleName): void
  /** Merge CSS-var overlay (incremental; does not remove missing keys). */
  applyCustom(tokens: Record<string, string>): void
  /**
   * Replace the entire CSS-var overlay. Keys absent from `tokens` are removed
   * from both state and the host (avoids stale vars after prop shrink).
   */
  replaceCustom(tokens: Record<string, string>): void
  clearCustom(): void
  /**
   * Derive primary → `--primary-50…900` + semantic bridges and apply as overlay.
   * Invalid color is a no-op (fail-soft).
   */
  setPrimary(primary: string): void
  init(options?: ThemeInitOptions): void
  subscribe(listener: ThemeListener): () => void
  /** Re-target host (micro-FE mount) and re-apply current snapshot. */
  bindHost(host: ThemeHost): void
  getHost(): ThemeHost
  /** Swap storage adapter (e.g. namespaced localStorage). Does not re-init. */
  bindStorage(storage: ThemeStorage): void
  dispose(): void
  /** Attribute map for SSR HTML / hydration. */
  serializeAttrs(): Record<string, string>
  /** CSS rule text for SSR `<style>` (custom tokens + icon stroke). */
  serializeStyle(selector?: string): string
  /** Full `<style id="amg-theme-ssr">` tag. */
  toStyleTag(options?: { id?: string; selector?: string }): string
  /** Inline `<script>` body that syncs storage → root attrs before paint (FOUC). */
  toBootScript(): string
}

export interface ThemeConfigureOptions {
  host?: ThemeHost
  /** Element used by createDocumentHost — convenience for micro-FE roots. */
  root?: Element
  storage?: ThemeStorage
  storageNamespace?: string
  defaults?: ThemeRuntimeOptions['defaults']
  syncBrandFont?: boolean
  persist?: boolean
  /** Replace the default singleton runtime entirely. */
  runtime?: ThemeRuntime
}
