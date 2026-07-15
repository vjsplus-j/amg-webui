import type { TelemetrySink, VpTelemetryEvent } from '../types'

/** Adapter for custom transports (HTTP batch, MQ, …) — errors are swallowed by Service */
export function customSink(
  write: (event: VpTelemetryEvent) => void | Promise<void>,
  options?: { name?: string; flush?: () => void | Promise<void> }
): TelemetrySink {
  return {
    name: options?.name ?? 'custom',
    write,
    flush: options?.flush
  }
}
