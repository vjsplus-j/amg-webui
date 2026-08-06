export type SkillTracePhase =
  | 'setup:start'
  | 'setup:success'
  | 'setup:error'
  | 'teardown:start'
  | 'teardown:success'
  | 'teardown:error'

export interface SkillTraceEvent {
  readonly kind: 'skill'
  readonly traceId: string
  readonly timestamp: number
  readonly phase: SkillTracePhase
  readonly skillName: string
  readonly instanceId: string
  readonly scopeId?: string
  readonly durationMs?: number
  readonly error?: Error
}

export type SkillPipelineTracePhase =
  | 'pipeline:start'
  | 'pipeline:success'
  | 'pipeline:error'
  | 'pipeline:disposed'

export interface SkillPipelineTraceEvent {
  readonly kind: 'pipeline'
  readonly traceId: string
  readonly timestamp: number
  readonly phase: SkillPipelineTracePhase
  readonly pipelineId: string
  readonly pipelineName?: string
  readonly scopeId: string
  readonly durationMs?: number
  readonly error?: Error
}

export type SkillObserverEvent = SkillTraceEvent | SkillPipelineTraceEvent

export type SkillObserverEventInput =
  | Omit<SkillTraceEvent, 'traceId' | 'timestamp'>
  | Omit<SkillPipelineTraceEvent, 'traceId' | 'timestamp'>

export type SkillObserver = (event: SkillObserverEvent) => void

export interface SkillConsoleObserverOptions {
  enabled?: boolean
  logger?: Pick<Console, 'debug' | 'error'>
  /** Explicitly opt in to logging the raw Error object. Disabled by default. */
  includeErrorDetails?: boolean
}

/**
 * Explicit opt-in development observer. It never logs config, output, state or
 * event payloads, so secrets do not leak by default.
 */
export function createSkillConsoleObserver(
  options: SkillConsoleObserverOptions = {}
): SkillObserver {
  const enabled = options.enabled ?? true
  const logger = options.logger ?? console
  const includeErrorDetails = options.includeErrorDetails ?? false

  return (event) => {
    if (!enabled) return
    const duration = event.durationMs == null ? '' : ` ${event.durationMs}ms`
    const target =
      event.kind === 'skill'
        ? `${event.skillName}#${event.instanceId}`
        : `${event.pipelineName ?? 'pipeline'}#${event.pipelineId}`
    const summary = `[AMG Skill] ${target} ${event.phase}${duration}`
    if (event.phase.endsWith(':error')) {
      if (includeErrorDetails) logger.error(summary, event.error)
      else logger.error(summary)
    } else logger.debug(summary)
  }
}
