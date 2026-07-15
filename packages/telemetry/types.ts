/** UI Telemetry event categories */
export type VpTelemetryCategory =
  | 'interaction'
  | 'habit'
  | 'alert'
  | 'error'
  | 'lifecycle'

export type VpTelemetrySeverity = 'info' | 'warn' | 'error'

export interface VpTelemetryContext {
  locale?: string
  design?: string
  route?: string
  appId?: string
}

export interface VpTelemetryEvent {
  id: string
  ts: number
  category: VpTelemetryCategory
  /** click | change | swap | copy | copyError | finish | expand… */
  type: string
  /** Button | CardWidgets | … */
  component: string
  /** Business track name (preferred when set) */
  trackId?: string
  /** aria-label / header摘要 (trimmed) */
  name?: string
  severity?: VpTelemetrySeverity
  /** Redacted payload when includePayload is on */
  payload?: Record<string, unknown>
  sessionId: string
  context?: VpTelemetryContext
}

export interface VpTelemetryConfig {
  /** Default false — opt-in only */
  enabled?: boolean
  categories?: Partial<Record<VpTelemetryCategory, boolean>>
  /** 0–1, default 1 */
  sampleRate?: number
  /** Ring buffer capacity, default 500 */
  maxBuffer?: number
  /** Keys redacted in payloads (case-insensitive substring match) */
  redactKeys?: string[]
  /** When false, only type/component/trackId are recorded (default) */
  includePayload?: boolean
  sinks?: TelemetrySink[]
  appId?: string
  getRoute?: () => string | undefined
  getLocale?: () => string | undefined
  getDesign?: () => string | undefined
}

export interface TelemetrySink {
  name?: string
  write: (event: VpTelemetryEvent) => void | Promise<void>
  flush?: () => void | Promise<void>
}

export interface TrackEmitOptions {
  component: string
  type: string
  trackId?: string
  /** Per-instance override; `false` forces skip */
  telemetry?: boolean
  name?: string
  severity?: VpTelemetrySeverity
  /** Override auto category inference */
  category?: VpTelemetryCategory
  payload?: Record<string, unknown>
}

/** Shared component props for telemetry wiring */
export interface TelemetryProps {
  /** Business track id written into events */
  trackId?: string
  /** Per-instance override — `false` disables tracking for this instance */
  telemetry?: boolean
}
