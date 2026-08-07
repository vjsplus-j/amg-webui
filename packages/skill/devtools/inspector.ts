import type { SkillObserver, SkillObserverEvent } from '../observability/types'

export interface SkillInspectorSnapshot {
  events: SkillObserverEvent[]
  activeSkills: Array<{
    skillName: string
    instanceId: string
    phase: string
    scopeId?: string
  }>
  pipelines: Array<{
    pipelineId: string
    pipelineName?: string
    phase: string
    scopeId: string
  }>
}

export interface SkillInspector {
  readonly observer: SkillObserver
  getSnapshot(): SkillInspectorSnapshot
  clear(): void
  subscribe(listener: () => void): () => void
}

/**
 * Runtime Inspector — ring-buffer of Skill/Pipeline observer events for DevTools / Lab.
 * Framework-agnostic; Vue panels subscribe via `subscribe`.
 */
export function createSkillInspector(options: { maxEvents?: number } = {}): SkillInspector {
  const maxEvents = Math.max(10, options.maxEvents ?? 500)
  const events: SkillObserverEvent[] = []
  const listeners = new Set<() => void>()
  const active = new Map<
    string,
    { skillName: string; instanceId: string; phase: string; scopeId?: string }
  >()
  const pipelines = new Map<
    string,
    { pipelineId: string; pipelineName?: string; phase: string; scopeId: string }
  >()

  function notify() {
    for (const listener of listeners) {
      try {
        listener()
      } catch {
        /* inspector must not break runtime */
      }
    }
  }

  const observer: SkillObserver = (event) => {
    events.push(event)
    if (events.length > maxEvents) events.splice(0, events.length - maxEvents)

    if (event.kind === 'skill') {
      const key = event.instanceId
      if (event.phase === 'teardown:success' || event.phase === 'setup:error') {
        if (event.phase === 'teardown:success') active.delete(key)
        else
          active.set(key, {
            skillName: event.skillName,
            instanceId: event.instanceId,
            phase: event.phase,
            scopeId: event.scopeId
          })
      } else {
        active.set(key, {
          skillName: event.skillName,
          instanceId: event.instanceId,
          phase: event.phase,
          scopeId: event.scopeId
        })
      }
    } else {
      const key = event.pipelineId
      if (event.phase === 'pipeline:disposed' || event.phase === 'pipeline:success') {
        if (event.phase === 'pipeline:disposed') pipelines.delete(key)
        else
          pipelines.set(key, {
            pipelineId: event.pipelineId,
            pipelineName: event.pipelineName,
            phase: event.phase,
            scopeId: event.scopeId
          })
      } else {
        pipelines.set(key, {
          pipelineId: event.pipelineId,
          pipelineName: event.pipelineName,
          phase: event.phase,
          scopeId: event.scopeId
        })
      }
    }
    notify()
  }

  return {
    observer,
    getSnapshot() {
      return {
        events: events.slice(),
        activeSkills: [...active.values()],
        pipelines: [...pipelines.values()]
      }
    },
    clear() {
      events.length = 0
      active.clear()
      pipelines.clear()
      notify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }
}

/** Pipeline Debugger — filters inspector events to pipeline traces only. */
export function createPipelineDebugger(inspector: SkillInspector) {
  return {
    getTraces() {
      return inspector.getSnapshot().events.filter((e) => e.kind === 'pipeline')
    },
    getActive() {
      return inspector.getSnapshot().pipelines
    }
  }
}
