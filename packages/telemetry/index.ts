export type {
  VpTelemetryCategory,
  VpTelemetrySeverity,
  VpTelemetryContext,
  VpTelemetryEvent,
  VpTelemetryConfig,
  TelemetrySink,
  TrackEmitOptions,
  TelemetryProps
} from './types'

export {
  DEFAULT_REDACT_KEYS,
  DEFAULT_CATEGORIES,
  DEFAULT_TELEMETRY_CONFIG,
  TELEMETRY_CONFIG_KEY
} from './config'

export { TelemetryService, type TelemetryServiceApi } from './TelemetryService'
export { trackEmit } from './trackEmit'
export { redactPayload, trimName } from './redact'
export { RingBuffer } from './ringBuffer'
export {
  summarizeHabits,
  findAlerts,
  findErrors,
  type HabitSummaryItem,
  type AlertFinding
} from './analyze'
export { consoleSink, bufferSink, customSink } from './sinks'
