import { trackEmit, TelemetryService } from '@amg-webui/telemetry'
import type { TrackEmitOptions, VpTelemetryEvent } from '@amg-webui/telemetry'

/**
 * Thin hook wrapper around `trackEmit` for composition API usage.
 * Prefer calling `trackEmit` directly beside `emit` in SFC scripts.
 */
export function useTrackedEmit() {
  function track(options: TrackEmitOptions): VpTelemetryEvent | undefined {
    return trackEmit(options)
  }

  return {
    track,
    trackEmit: track,
    service: TelemetryService,
    isEnabled: () => TelemetryService.isEnabled()
  }
}
