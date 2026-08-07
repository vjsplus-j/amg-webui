import type { SkillObserver, SkillObserverEvent } from '../observability/types'

/**
 * Minimal Telemetry sink shape — avoids hard dependency on `@amg-webui/telemetry`.
 * Consumers pass TelemetryService.track or a compatible function.
 */
export type SkillTelemetryTrack = (event: {
  category: string
  type: string
  component?: string
  payload?: Record<string, unknown>
}) => void

export interface SkillTelemetryBridgeOptions {
  track: SkillTelemetryTrack
  /** Default false — Skill must stay off the hot path unless opted in. */
  enabled?: boolean
  appId?: string
}

/**
 * Observer that forwards Skill lifecycle traces into a Telemetry track sink.
 * Does not import telemetry package (boundary-safe).
 */
export function createSkillTelemetryBridge(
  options: SkillTelemetryBridgeOptions
): SkillObserver {
  const enabled = options.enabled ?? false
  return (event: SkillObserverEvent) => {
    if (!enabled) return
    try {
      if (event.kind === 'skill') {
        options.track({
          category: 'skill',
          type: event.phase,
          component: event.skillName,
          payload: {
            instanceId: event.instanceId,
            scopeId: event.scopeId,
            durationMs: event.durationMs,
            appId: options.appId
          }
        })
      } else {
        options.track({
          category: 'skill',
          type: event.phase,
          component: event.pipelineName ?? 'pipeline',
          payload: {
            pipelineId: event.pipelineId,
            scopeId: event.scopeId,
            durationMs: event.durationMs,
            appId: options.appId
          }
        })
      }
    } catch {
      /* bridge never throws into runtime */
    }
  }
}
