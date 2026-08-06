import type { SkillAdapter } from '../adapters/types'
import type {
  SkillObserver,
  SkillObserverEvent,
  SkillObserverEventInput,
  SkillTracePhase
} from '../observability/types'
import { createSkillContext } from './context'
import { SkillAbortError, SkillExecutionError, SkillRuntimeError, toError } from './errors'
import { createSkillEventBus } from './eventBus'
import { SkillAdapterRegistry, SkillRegistry } from './registry'
import type {
  SkillHandle,
  SkillLifecyclePhase,
  SkillMountOptions,
  SkillRegisterOptions,
  SkillRuntimeApi,
  SkillRuntimeOptions,
  SkillScope,
  SkillState,
  SkillUnit
} from './types'

function defaultIdFactory(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Internal bridge used by the pipeline executor without exposing observer storage. */
export const SKILL_OBSERVER_DISPATCH: unique symbol = Symbol('amg-skill-observer-dispatch')

class RuntimeSkillScope implements SkillScope {
  readonly state: SkillState = Object.create(null) as SkillState
  readonly eventBus = createSkillEventBus()
  private readonly handles = new Set<SkillHandle>()
  private isDisposed = false
  private disposePromise: Promise<void> | undefined

  constructor(
    readonly id: string,
    private readonly runtime: SkillRuntime
  ) {}

  get disposed(): boolean {
    return this.isDisposed
  }

  emit<Payload>(event: string, payload: Payload): void {
    if (this.isDisposed) return
    this.eventBus.emit(event, payload)
  }

  on<Payload>(event: string, handler: (payload: Payload) => void): () => void {
    if (this.isDisposed) return () => undefined
    return this.eventBus.on(event, handler)
  }

  mount<Config, Output>(
    name: string,
    config: Config,
    options: Omit<SkillMountOptions, 'scope'> = {}
  ): SkillHandle<Output> {
    if (this.isDisposed) throw new SkillRuntimeError(`Skill scope "${this.id}" is disposed`)
    const handle = this.runtime.mount<Config, Output>(name, config, {
      ...options,
      scope: this
    })
    return handle
  }

  adopt(handle: SkillHandle): void {
    this.handles.add(handle)
  }

  release(handle: SkillHandle): void {
    this.handles.delete(handle)
  }

  dispose(): Promise<void> {
    if (this.disposePromise) return this.disposePromise
    this.isDisposed = true
    this.disposePromise = this.disposeOwnedHandles()
    return this.disposePromise
  }

  private async disposeOwnedHandles(): Promise<void> {
    const errors: Error[] = []
    for (const handle of [...this.handles].reverse()) {
      try {
        await handle.dispose()
      } catch (error) {
        errors.push(toError(error))
      }
    }
    this.handles.clear()
    this.eventBus.clear()
    for (const key of Object.keys(this.state)) delete this.state[key]
    if (errors.length > 0) {
      throw new SkillRuntimeError(
        `Skill scope "${this.id}" failed to dispose ${errors.length} handle(s)`,
        errors
      )
    }
  }
}

export class SkillRuntime implements SkillRuntimeApi {
  private readonly skills = new SkillRegistry()
  private readonly adapters = new SkillAdapterRegistry()
  private readonly observers = new Set<SkillObserver>()
  private readonly activeHandles = new Set<SkillHandle>()
  private readonly activeInstanceIds = new Set<string>()
  private readonly idFactory: (prefix: string) => string

  constructor(options: SkillRuntimeOptions = {}) {
    this.idFactory = options.idFactory ?? defaultIdFactory
    for (const observer of options.observers ?? []) this.observers.add(observer)
  }

  register<Config, Output>(
    unit: SkillUnit<Config, Output>,
    options?: SkillRegisterOptions
  ): () => void {
    return this.skills.register(unit, options)
  }

  unregister(name: string): boolean {
    return this.skills.unregister(name)
  }

  has(name: string): boolean {
    return this.skills.has(name)
  }

  list(): readonly string[] {
    return this.skills.list()
  }

  registerAdapter<Input, Output>(
    adapter: SkillAdapter<Input, Output>,
    options?: SkillRegisterOptions
  ): () => void {
    return this.adapters.register(adapter, options)
  }

  observe(observer: SkillObserver): () => void {
    this.observers.add(observer)
    return () => this.observers.delete(observer)
  }

  createScope(id = this.idFactory('scope')): SkillScope {
    return new RuntimeSkillScope(id, this)
  }

  mount<Config, Output>(
    name: string,
    config: Config,
    options: SkillMountOptions = {}
  ): SkillHandle<Output> {
    const definition = this.skills.get(name) as SkillUnit<Config, Output> | undefined
    if (!definition) throw new SkillRuntimeError(`Unknown skill: ${name}`)
    if (options.scope?.disposed) {
      throw new SkillRuntimeError(`Skill scope "${options.scope.id}" is disposed`)
    }

    const instanceId = options.instanceId ?? this.idFactory('skill')
    if (this.activeInstanceIds.has(instanceId)) {
      throw new SkillRuntimeError(`Skill instance id "${instanceId}" is already active`)
    }
    const contextController = createSkillContext({
      instanceId,
      skillName: name,
      host: options.host,
      scope: options.scope,
      resolveAdapter: (adapterName) => this.adapters.get(adapterName)
    })
    const context = contextController.context
    let phase: SkillLifecyclePhase = 'setting-up'
    let output: Output | undefined
    let disposeRequested = false
    let teardownPromise: Promise<void> | undefined
    let disposePromise: Promise<void> | undefined
    let handle!: SkillHandle<Output>
    const setupStartedAt = Date.now()

    const teardown = (): Promise<void> => {
      if (teardownPromise) return teardownPromise
      phase = 'disposing'
      const startedAt = Date.now()
      this.trace('teardown:start', name, instanceId, options.scope?.id)
      teardownPromise = Promise.resolve()
        .then(() => definition.teardown(context))
        .then(() => {
          phase = 'disposed'
          this.trace(
            'teardown:success',
            name,
            instanceId,
            options.scope?.id,
            Date.now() - startedAt
          )
        })
        .catch((error: unknown) => {
          phase = 'disposed'
          const normalized = toError(error)
          this.trace(
            'teardown:error',
            name,
            instanceId,
            options.scope?.id,
            Date.now() - startedAt,
            normalized
          )
          throw normalized
        })
        .finally(() => {
          contextController.dispose()
          this.activeHandles.delete(handle)
          this.activeInstanceIds.delete(instanceId)
          if (options.scope instanceof RuntimeSkillScope) options.scope.release(handle)
        })
      return teardownPromise
    }

    this.trace('setup:start', name, instanceId, options.scope?.id)
    const ready = Promise.resolve()
      .then(() => definition.setup(context, config))
      .then(async (value) => {
        if (disposeRequested || context.signal.aborted) {
          throw new SkillAbortError(`Skill "${name}" was disposed before setup completed`)
        }
        output = value
        phase = 'active'
        this.trace(
          'setup:success',
          name,
          instanceId,
          options.scope?.id,
          Date.now() - setupStartedAt
        )
        return value
      })
      .catch(async (error: unknown) => {
        phase = 'failed'
        const normalized = toError(error)
        this.trace(
          'setup:error',
          name,
          instanceId,
          options.scope?.id,
          Date.now() - setupStartedAt,
          normalized
        )
        if (!context.signal.aborted) {
          try {
            await definition.onError?.(normalized, context)
          } catch {
            // Error hooks must never replace the original failure.
          }
        }
        try {
          await teardown()
        } catch {
          // The setup error remains the primary failure.
        }
        if (context.signal.aborted && normalized instanceof SkillAbortError) throw normalized
        throw new SkillExecutionError(name, instanceId, normalized)
      })

    handle = {
      id: instanceId,
      name,
      context,
      ready,
      get phase() {
        return phase
      },
      get output() {
        return output
      },
      dispose(): Promise<void> {
        if (phase === 'disposed') return Promise.resolve()
        if (disposePromise) return disposePromise
        disposeRequested = true
        contextController.abort(new SkillAbortError(`Skill "${name}" was disposed`))
        disposePromise = (async () => {
          try {
            await ready
          } catch {
            // Setup failure performs teardown; await it below to surface cleanup errors.
          }
          await teardown()
        })()
        return disposePromise
      }
    }

    this.activeHandles.add(handle)
    this.activeInstanceIds.add(instanceId)
    if (options.scope instanceof RuntimeSkillScope) options.scope.adopt(handle)

    return handle
  }

  async dispose(): Promise<void> {
    const results = await Promise.allSettled(
      [...this.activeHandles].reverse().map((handle) => handle.dispose())
    )
    const failures = results.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )
    if (failures.length > 0) {
      throw new SkillRuntimeError(
        `Skill runtime failed to dispose ${failures.length} handle(s)`,
        failures.map((failure) => failure.reason)
      )
    }
  }

  [SKILL_OBSERVER_DISPATCH](input: SkillObserverEventInput): void {
    if (this.observers.size === 0) return
    const event: SkillObserverEvent = {
      ...input,
      traceId: this.idFactory('trace'),
      timestamp: Date.now()
    } as SkillObserverEvent
    for (const observer of this.observers) {
      try {
        observer(event)
      } catch {
        // Observability is always a side channel.
      }
    }
  }

  private trace(
    phase: SkillTracePhase,
    skillName: string,
    instanceId: string,
    scopeId?: string,
    durationMs?: number,
    error?: Error
  ): void {
    this[SKILL_OBSERVER_DISPATCH]({
      kind: 'skill',
      phase,
      skillName,
      instanceId,
      scopeId,
      durationMs,
      error
    })
  }
}

export function createSkillRuntime(options?: SkillRuntimeOptions): SkillRuntime {
  return new SkillRuntime(options)
}

export function defineSkill<Config, Output>(
  definition: SkillUnit<Config, Output>
): SkillUnit<Config, Output> {
  if (!definition.name.trim()) throw new SkillRuntimeError('Skill name cannot be empty')
  return Object.freeze(definition)
}
