import {
  SkillAbortError,
  SkillExecutionError,
  SkillRuntimeError,
  toError
} from '../core/errors'
import { SKILL_OBSERVER_DISPATCH, type SkillRuntime } from '../core/runtime'
import type { SkillHandle, SkillState } from '../core/types'
import type {
  JsonValue,
  SkillCondition,
  SkillPipelineContext,
  SkillPipelineDefinition,
  SkillPipelineHandle,
  SkillPipelineItem,
  SkillPipelinePhase,
  SkillPipelineResult,
  SkillPipelineStartOptions
} from './types'

export const MAX_PIPELINE_ATTEMPTS = 10

function pipelineId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `pipeline-${crypto.randomUUID()}`
  }
  return `pipeline-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function assertJsonValue(
  value: unknown,
  path: string,
  ancestors = new WeakSet<object>()
): asserts value is JsonValue {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return
  if (typeof value === 'number') {
    if (Number.isFinite(value)) return
    throw new SkillRuntimeError(`${path} must contain only finite JSON numbers`)
  }
  if (Array.isArray(value)) {
    if (ancestors.has(value)) throw new SkillRuntimeError(`${path} contains a circular reference`)
    ancestors.add(value)
    value.forEach((entry, index) => assertJsonValue(entry, `${path}[${index}]`, ancestors))
    ancestors.delete(value)
    return
  }
  if (typeof value === 'object') {
    const prototype = Object.getPrototypeOf(value)
    if (prototype !== Object.prototype && prototype !== null) {
      throw new SkillRuntimeError(`${path} must contain plain JSON objects`)
    }
    if (ancestors.has(value)) throw new SkillRuntimeError(`${path} contains a circular reference`)
    ancestors.add(value)
    for (const [key, entry] of Object.entries(value)) {
      assertJsonValue(entry, `${path}.${key}`, ancestors)
    }
    ancestors.delete(value)
    return
  }
  throw new SkillRuntimeError(`${path} is not JSON serializable`)
}

function assertItems(items: readonly SkillPipelineItem[], path: string): void {
  if (!Array.isArray(items)) throw new SkillRuntimeError(`${path} must be an array`)
  items.forEach((item, index) => {
    const itemPath = `${path}[${index}]`
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new SkillRuntimeError(`${itemPath} must be an object`)
    }
    if (typeof item.type !== 'string') {
      throw new SkillRuntimeError(`${itemPath}.type must be a string`)
    }
    switch (item.type) {
      case 'skill':
        if (typeof item.name !== 'string' || !item.name.trim()) {
          throw new SkillRuntimeError(`${itemPath}.name must be a non-empty string`)
        }
        if (item.id != null && (typeof item.id !== 'string' || !item.id.trim())) {
          throw new SkillRuntimeError(`${itemPath}.id cannot be empty`)
        }
        if (item.config !== undefined) assertJsonValue(item.config, `${itemPath}.config`)
        break
      case 'parallel':
        assertItems(item.items, `${itemPath}.items`)
        break
      case 'if':
        if (typeof item.condition !== 'string' || !item.condition.trim()) {
          throw new SkillRuntimeError(`${itemPath}.condition must be a non-empty string`)
        }
        assertItems(item.then, `${itemPath}.then`)
        if (item.else) assertItems(item.else, `${itemPath}.else`)
        break
      case 'retry':
        if (
          typeof item.max !== 'number' ||
          !Number.isInteger(item.max) ||
          item.max < 1 ||
          item.max > MAX_PIPELINE_ATTEMPTS
        ) {
          throw new SkillRuntimeError(
            `${itemPath}.max must be an integer from 1 to ${MAX_PIPELINE_ATTEMPTS}`
          )
        }
        if (
          item.delayMs != null &&
          (typeof item.delayMs !== 'number' || item.delayMs < 0)
        ) {
          throw new SkillRuntimeError(`${itemPath}.delayMs must be a non-negative number`)
        }
        if (
          item.backoff != null &&
          (typeof item.backoff !== 'number' || item.backoff < 1)
        ) {
          throw new SkillRuntimeError(`${itemPath}.backoff must be a number of at least 1`)
        }
        assertItems([item.item], `${itemPath}.item`)
        break
      case 'fallback':
        assertItems([item.item], `${itemPath}.item`)
        assertItems([item.fallback], `${itemPath}.fallback`)
        break
      default: {
        throw new SkillRuntimeError('Unsupported pipeline item')
      }
    }
  })
}

/** Validate and clone a pipeline so later caller mutations cannot change a run. */
export function createSkillPipeline(
  definition: SkillPipelineDefinition
): SkillPipelineDefinition {
  if (!definition || typeof definition !== 'object' || Array.isArray(definition)) {
    throw new SkillRuntimeError('Pipeline definition must be a JSON object')
  }
  assertJsonValue(definition, 'pipeline')
  if (definition.version !== 1) {
    throw new SkillRuntimeError(`Unsupported pipeline version: ${String(definition.version)}`)
  }
  if (
    definition.name != null &&
    (typeof definition.name !== 'string' || !definition.name.trim())
  ) {
    throw new SkillRuntimeError('Pipeline name must be a non-empty string')
  }
  assertItems(definition.items, 'pipeline.items')
  return JSON.parse(JSON.stringify(definition)) as SkillPipelineDefinition
}

interface ExecutionResult {
  handles: SkillHandle[]
  outputs: Map<string, unknown>
}

async function disposeHandles(handles: Iterable<SkillHandle>): Promise<void> {
  const list = [...handles].reverse()
  const results = await Promise.allSettled(list.map((handle) => handle.dispose()))
  const failure = results.find(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  )
  if (failure) throw toError(failure.reason)
}

function toReadonlyOutputs(outputs: ReadonlyMap<string, unknown>): Readonly<Record<string, unknown>> {
  return Object.freeze(Object.fromEntries(outputs))
}

export class SkillPipelineExecutor {
  private readonly conditions = new Map<string, SkillCondition>()

  constructor(private readonly runtime: SkillRuntime) {}

  registerCondition(name: string, condition: SkillCondition): () => void {
    if (!name.trim()) throw new SkillRuntimeError('Pipeline condition name cannot be empty')
    if (this.conditions.has(name)) {
      throw new SkillRuntimeError(`Pipeline condition "${name}" is already registered`)
    }
    this.conditions.set(name, condition)
    return () => {
      if (this.conditions.get(name) === condition) this.conditions.delete(name)
    }
  }

  start(
    source: SkillPipelineDefinition,
    options: SkillPipelineStartOptions = {}
  ): SkillPipelineHandle {
    const runtime = this.runtime
    const definition = createSkillPipeline(source)
    const id = pipelineId()
    const ownsScope = options.scope == null
    const scope = options.scope ?? runtime.createScope(`${id}-scope`)
    const state = options.state ?? (Object.create(null) as SkillState)
    const activeHandles = new Set<SkillHandle>()
    const controller = new AbortController()
    let phase: SkillPipelinePhase = 'running'
    let disposed = false
    let disposePromise: Promise<void> | undefined
    const startedAt = Date.now()

    runtime[SKILL_OBSERVER_DISPATCH]({
      kind: 'pipeline',
      phase: 'pipeline:start',
      pipelineId: id,
      pipelineName: definition.name,
      scopeId: scope.id
    })

    const assertActive = (): void => {
      if (disposed || scope.disposed || controller.signal.aborted) {
        throw new SkillAbortError(`Pipeline "${id}" was disposed`)
      }
    }

    const sleep = (ms: number): Promise<void> =>
      new Promise((resolve, reject) => {
        assertActive()
        const timer = setTimeout(() => {
          cleanup()
          resolve()
        }, ms)
        const onAbort = () => {
          cleanup()
          reject(new SkillAbortError(`Pipeline "${id}" was disposed`))
        }
        const cleanup = () => {
          clearTimeout(timer)
          controller.signal.removeEventListener('abort', onAbort)
        }
        controller.signal.addEventListener('abort', onAbort, { once: true })
      })

    const contextFor = (outputs: ReadonlyMap<string, unknown>): SkillPipelineContext => ({
      state,
      outputs: toReadonlyOutputs(outputs),
      scope
    })

    const executeItems = async (
      items: readonly SkillPipelineItem[],
      inheritedOutputs: ReadonlyMap<string, unknown>,
      path: string
    ): Promise<ExecutionResult> => {
      const handles: SkillHandle[] = []
      const outputs = new Map(inheritedOutputs)

      try {
        for (let index = 0; index < items.length; index += 1) {
          assertActive()
          const result = await executeItem(items[index], outputs, `${path}.${index}`)
          handles.push(...result.handles)
          for (const [key, value] of result.outputs) outputs.set(key, value)
        }
        return { handles, outputs }
      } catch (error) {
        try {
          await disposeHandles(handles)
        } catch {
          // Preserve the execution failure.
        }
        throw error
      }
    }

    const executeItem = async (
      item: SkillPipelineItem,
      inheritedOutputs: ReadonlyMap<string, unknown>,
      path: string
    ): Promise<ExecutionResult> => {
      assertActive()
      switch (item.type) {
        case 'skill': {
          const handle = scope.mount<JsonValue | undefined, unknown>(
            item.name,
            item.config,
            { host: options.host }
          )
          activeHandles.add(handle)
          try {
            const value = await handle.ready
            const outputs = new Map(inheritedOutputs)
            outputs.set(item.id ?? path, value)
            return { handles: [handle], outputs }
          } catch (error) {
            activeHandles.delete(handle)
            await handle.dispose()
            throw error
          }
        }
        case 'parallel': {
          const inheritedHandles = new Set(activeHandles)
          const disposeParallelHandles = async (): Promise<void> => {
            const parallelHandles = [...activeHandles].filter(
              (handle) => !inheritedHandles.has(handle)
            )
            await disposeHandles(parallelHandles)
            for (const handle of parallelHandles) activeHandles.delete(handle)
          }
          let firstFailure: unknown
          const branches = item.items.map((child, index) =>
            executeItem(child, inheritedOutputs, `${path}.parallel.${index}`).catch(
              async (error: unknown) => {
                if (firstFailure === undefined) {
                  firstFailure = error
                  try {
                    await disposeParallelHandles()
                  } catch {
                    // Preserve the branch failure.
                  }
                }
                throw error
              }
            )
          )
          const settled = await Promise.allSettled(branches)
          const rejected = settled.find(
            (result): result is PromiseRejectedResult => result.status === 'rejected'
          )
          if (rejected) {
            const completedHandles = settled.flatMap((result) =>
              result.status === 'fulfilled' ? result.value.handles : []
            )
            await disposeHandles(completedHandles)
            for (const handle of completedHandles) activeHandles.delete(handle)
            throw rejected.reason
          }

          const handles: SkillHandle[] = []
          const outputs = new Map(inheritedOutputs)
          for (const result of settled) {
            if (result.status !== 'fulfilled') continue
            handles.push(...result.value.handles)
            for (const [key, value] of result.value.outputs) outputs.set(key, value)
          }
          return { handles, outputs }
        }
        case 'if': {
          const condition = this.conditions.get(item.condition)
          if (!condition) {
            throw new SkillRuntimeError(
              `Unknown pipeline condition "${item.condition}"; conditions are named and never eval'ed`
            )
          }
          const branch = (await condition(contextFor(inheritedOutputs))) ? item.then : item.else ?? []
          return executeItems(branch, inheritedOutputs, `${path}.if`)
        }
        case 'retry': {
          let lastError: Error | undefined
          for (let attempt = 1; attempt <= item.max; attempt += 1) {
            assertActive()
            try {
              return await executeItem(item.item, inheritedOutputs, `${path}.retry.${attempt}`)
            } catch (error) {
              lastError = toError(error)
              if (lastError instanceof SkillAbortError) throw lastError
              if (
                lastError instanceof SkillRuntimeError &&
                !(lastError instanceof SkillExecutionError)
              ) {
                throw lastError
              }
              if (attempt >= item.max) break
              const delay = (item.delayMs ?? 0) * (item.backoff ?? 1) ** (attempt - 1)
              if (delay > 0) {
                await sleep(delay)
              }
            }
          }
          throw lastError ?? new SkillRuntimeError(`Retry item at ${path} failed`)
        }
        case 'fallback': {
          try {
            return await executeItem(item.item, inheritedOutputs, `${path}.primary`)
          } catch (error) {
            if (error instanceof SkillAbortError) throw error
            if (!(error instanceof SkillExecutionError)) throw error
            return executeItem(item.fallback, inheritedOutputs, `${path}.fallback`)
          }
        }
        default: {
          const unexpected: never = item
          throw new SkillRuntimeError(`Unsupported pipeline item: ${String(unexpected)}`)
        }
      }
    }

    const ready = executeItems(definition.items, new Map(), 'pipeline')
      .then<SkillPipelineResult>((result) => {
        assertActive()
        phase = 'active'
        runtime[SKILL_OBSERVER_DISPATCH]({
          kind: 'pipeline',
          phase: 'pipeline:success',
          pipelineId: id,
          pipelineName: definition.name,
          scopeId: scope.id,
          durationMs: Date.now() - startedAt
        })
        return Object.freeze({
          outputs: toReadonlyOutputs(result.outputs),
          handles: Object.freeze([...result.handles])
        })
      })
      .catch(async (error: unknown) => {
        phase = disposed ? 'disposed' : 'failed'
        runtime[SKILL_OBSERVER_DISPATCH]({
          kind: 'pipeline',
          phase: 'pipeline:error',
          pipelineId: id,
          pipelineName: definition.name,
          scopeId: scope.id,
          durationMs: Date.now() - startedAt,
          error: toError(error)
        })
        try {
          await disposeHandles(activeHandles)
        } catch {
          // Preserve the execution failure.
        }
        activeHandles.clear()
        if (ownsScope) {
          try {
            await scope.dispose()
          } catch {
            // Preserve the execution failure.
          }
        }
        throw error
      })

    return {
      id,
      definition,
      scope,
      ready,
      get phase() {
        return phase
      },
      dispose(): Promise<void> {
        if (phase === 'disposed') return Promise.resolve()
        if (disposePromise) return disposePromise
        disposed = true
        phase = 'disposing'
        controller.abort()
        disposePromise = (async () => {
          try {
            if (ownsScope) await scope.dispose()
            else await disposeHandles(activeHandles)
          } finally {
            activeHandles.clear()
            phase = 'disposed'
            runtime[SKILL_OBSERVER_DISPATCH]({
              kind: 'pipeline',
              phase: 'pipeline:disposed',
              pipelineId: id,
              pipelineName: definition.name,
              scopeId: scope.id,
              durationMs: Date.now() - startedAt
            })
          }
        })()
        return disposePromise
      }
    }
  }
}

export function createSkillPipelineExecutor(runtime: SkillRuntime): SkillPipelineExecutor {
  return new SkillPipelineExecutor(runtime)
}
