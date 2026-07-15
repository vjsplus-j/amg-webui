import type { InjectionKey } from 'vue'
import type { VpTelemetryCategory, VpTelemetryConfig } from './types'

export const DEFAULT_REDACT_KEYS = [
  'password',
  'passwd',
  'secret',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'apiKey',
  'apikey',
  'privateKey',
  'credential',
  'ssn',
  'idCard'
] as const

export const DEFAULT_CATEGORIES: Record<VpTelemetryCategory, boolean> = {
  interaction: true,
  habit: true,
  alert: true,
  error: true,
  lifecycle: true
}

export const DEFAULT_TELEMETRY_CONFIG: Required<
  Pick<
    VpTelemetryConfig,
    | 'enabled'
    | 'sampleRate'
    | 'maxBuffer'
    | 'includePayload'
    | 'redactKeys'
    | 'sinks'
  >
> & {
  categories: Record<VpTelemetryCategory, boolean>
} = {
  enabled: false,
  sampleRate: 1,
  maxBuffer: 500,
  includePayload: false,
  redactKeys: [...DEFAULT_REDACT_KEYS],
  sinks: [],
  categories: { ...DEFAULT_CATEGORIES }
}

/** Injection key for VpTelemetryProvider */
export const TELEMETRY_CONFIG_KEY: InjectionKey<VpTelemetryConfig> =
  Symbol('vpTelemetryConfig')
