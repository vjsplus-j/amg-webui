import type {
  TrackEmitOptions,
  VpTelemetryCategory,
  VpTelemetryConfig,
  VpTelemetryEvent,
  TelemetrySink
} from './types'
import { DEFAULT_TELEMETRY_CONFIG } from './config'
import { redactPayload, trimName } from './redact'
import { RingBuffer } from './ringBuffer'

const ERROR_TYPES = new Set([
  'copyError',
  'error',
  'loadError',
  'failed'
])

const ALERT_TYPES = new Set([
  'disabledClick',
  'permissionDenied',
  'rapidClick',
  'abnormal'
])

function inferCategory(type: string, explicit?: VpTelemetryCategory): VpTelemetryCategory {
  if (explicit) return explicit
  if (ERROR_TYPES.has(type) || type.endsWith('Error')) return 'error'
  if (ALERT_TYPES.has(type)) return 'alert'
  if (type === 'mount' || type === 'unmount' || type === 'dispose') return 'lifecycle'
  return 'interaction'
}

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `vp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function createSessionId(): string {
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

type Listener = (event: VpTelemetryEvent) => void

/** Public surface of the process-wide telemetry service. */
export interface TelemetryServiceApi {
  configure(partial: VpTelemetryConfig): void
  replaceConfig(next: VpTelemetryConfig): void
  enable(): void
  disable(): void
  isEnabled(): boolean
  getConfig(): Readonly<VpTelemetryConfig>
  getSessionId(): string
  rotateSession(): string
  track(options: TrackEmitOptions): VpTelemetryEvent | undefined
  subscribe(listener: Listener): () => void
  flush(): Promise<void>
  getBuffer(): VpTelemetryEvent[]
  clear(): void
}

class TelemetryServiceImpl {
  private cfg: VpTelemetryConfig = { ...DEFAULT_TELEMETRY_CONFIG }
  private sessionId = createSessionId()
  private buffer = new RingBuffer(DEFAULT_TELEMETRY_CONFIG.maxBuffer)
  private listeners = new Set<Listener>()
  private sinks: TelemetrySink[] = []

  configure(partial: VpTelemetryConfig): void {
    this.cfg = {
      ...this.cfg,
      ...partial,
      categories: {
        ...DEFAULT_TELEMETRY_CONFIG.categories,
        ...this.cfg.categories,
        ...partial.categories
      },
      redactKeys: partial.redactKeys ?? this.cfg.redactKeys ?? DEFAULT_TELEMETRY_CONFIG.redactKeys
    }
    if (partial.maxBuffer != null) {
      this.buffer.resize(partial.maxBuffer)
    }
    if (partial.sinks) {
      this.sinks = [...partial.sinks]
    }
  }

  /** Replace the effective config (used by scoped providers when they unmount). */
  replaceConfig(next: VpTelemetryConfig): void {
    this.cfg = {
      ...DEFAULT_TELEMETRY_CONFIG,
      ...next,
      categories: {
        ...DEFAULT_TELEMETRY_CONFIG.categories,
        ...next.categories
      },
      redactKeys: next.redactKeys ?? [...DEFAULT_TELEMETRY_CONFIG.redactKeys],
      sinks: next.sinks ?? []
    }
    this.buffer.resize(this.cfg.maxBuffer ?? DEFAULT_TELEMETRY_CONFIG.maxBuffer)
    this.sinks = [...(this.cfg.sinks ?? [])]
  }

  enable(): void {
    this.cfg.enabled = true
  }

  disable(): void {
    this.cfg.enabled = false
  }

  isEnabled(): boolean {
    return Boolean(this.cfg.enabled)
  }

  getConfig(): Readonly<VpTelemetryConfig> {
    return this.cfg
  }

  getSessionId(): string {
    return this.sessionId
  }

  /** Reset session id (e.g. after login) */
  rotateSession(): string {
    this.sessionId = createSessionId()
    return this.sessionId
  }

  track(options: TrackEmitOptions): VpTelemetryEvent | undefined {
    try {
      if (options.telemetry === false) return undefined
      if (!this.cfg.enabled) return undefined

      const category = inferCategory(options.type, options.category)
      const cats = {
        ...DEFAULT_TELEMETRY_CONFIG.categories,
        ...this.cfg.categories
      }
      if (cats[category] === false) return undefined

      const rate = this.cfg.sampleRate ?? 1
      if (rate < 1 && Math.random() > rate) return undefined

      const includePayload = Boolean(this.cfg.includePayload)
      const redactKeys = this.cfg.redactKeys ?? DEFAULT_TELEMETRY_CONFIG.redactKeys
      const payload =
        includePayload && options.payload
          ? redactPayload(options.payload, redactKeys)
          : undefined

      const event: VpTelemetryEvent = {
        id: createId(),
        ts: Date.now(),
        category,
        type: options.type,
        component: options.component,
        trackId: options.trackId,
        name: trimName(options.name),
        severity:
          options.severity ??
          (category === 'error' ? 'error' : category === 'alert' ? 'warn' : 'info'),
        payload,
        sessionId: this.sessionId,
        context: {
          appId: this.cfg.appId,
          route: this.cfg.getRoute?.(),
          locale: this.cfg.getLocale?.(),
          design: this.cfg.getDesign?.()
        }
      }

      this.buffer.push(event)

      for (const sink of this.sinks) {
        try {
          void Promise.resolve(sink.write(event)).catch(() => {
            /* never affect UI */
          })
        } catch {
          /* swallow */
        }
      }

      for (const listener of this.listeners) {
        try {
          listener(event)
        } catch {
          /* swallow */
        }
      }

      return event
    } catch {
      return undefined
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  async flush(): Promise<void> {
    for (const sink of this.sinks) {
      if (!sink.flush) continue
      try {
        await sink.flush()
      } catch {
        /* swallow */
      }
    }
  }

  getBuffer(): VpTelemetryEvent[] {
    return this.buffer.toArray()
  }

  clear(): void {
    this.buffer.clear()
  }
}

/**
 * Process-wide singleton.
 * Vite may load this module under multiple URLs in example; without globalThis,
 * Provider enable + component trackEmit can bind to different instances.
 */
const GLOBAL_KEY = '__AMG_WEBUI_TELEMETRY_SERVICE__' as const

type TelemetryGlobal = typeof globalThis & {
  [GLOBAL_KEY]?: TelemetryServiceImpl
}

const g = globalThis as TelemetryGlobal

export const TelemetryService: TelemetryServiceApi =
  g[GLOBAL_KEY] ?? (g[GLOBAL_KEY] = new TelemetryServiceImpl())
