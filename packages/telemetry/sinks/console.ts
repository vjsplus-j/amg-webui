import type { TelemetrySink, VpTelemetryEvent } from '../types'

/** Dev-friendly console sink */
export function consoleSink(options?: {
  label?: string
  level?: 'debug' | 'info' | 'log'
}): TelemetrySink {
  const label = options?.label ?? '[vp-telemetry]'
  const level = options?.level ?? 'debug'
  return {
    name: 'console',
    write(event: VpTelemetryEvent) {
      const fn = console[level] ?? console.log
      fn(label, event.category, event.component, event.type, event.trackId ?? '', event)
    }
  }
}
