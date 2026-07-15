import { TelemetryService } from './TelemetryService'
import type { TrackEmitOptions, VpTelemetryEvent } from './types'

/**
 * Side-path track beside business `emit`.
 * Failures never throw / never block the UI hot path.
 * When telemetry is disabled: early return with near-zero cost.
 */
export function trackEmit(options: TrackEmitOptions): VpTelemetryEvent | undefined {
  try {
    return TelemetryService.track(options)
  } catch {
    return undefined
  }
}
