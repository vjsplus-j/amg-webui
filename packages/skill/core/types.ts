import type { SkillAdapter } from '../adapters/types'
import type { SkillObserver } from '../observability/types'

export type MaybePromise<T> = T | Promise<T>

export type SkillState = Record<string, unknown>

export type SkillEventHandler<Payload = unknown> = (payload: Payload) => void

export interface SkillEventBus {
  emit<Payload = unknown>(event: string, payload: Payload): void
  on<Payload = unknown>(event: string, handler: SkillEventHandler<Payload>): () => void
  clear(): void
}

export interface SkillScopeContext {
  readonly id: string
  readonly state: SkillState
  emit<Payload = unknown>(event: string, payload: Payload): void
  on<Payload = unknown>(event: string, handler: SkillEventHandler<Payload>): () => void
}

export interface SkillRetryOptions {
  /** Total attempts, including the first call. */
  maxAttempts?: number
  delayMs?: number
  backoff?: number
  maxDelayMs?: number
  jitter?: number
  shouldRetry?: (error: Error, attempt: number) => boolean
}

export interface SkillContextUtils {
  createAbortController(): AbortController
  releaseAbortController(controller: AbortController): void
  cancelAllRequests(reason?: unknown): void
  /** Compatibility alias for the wording in the original proposal. */
  cancelAllRequest(reason?: unknown): void
  retry<T>(
    operation: (attempt: number, signal: AbortSignal) => MaybePromise<T>,
    options?: SkillRetryOptions
  ): Promise<T>
  sleep(ms: number): Promise<void>
}

export interface SkillContext {
  readonly instanceId: string
  readonly skillName: string
  readonly state: SkillState
  readonly signal: AbortSignal
  readonly scope?: SkillScopeContext
  readonly host?: object
  readonly utils: SkillContextUtils
  emit<Payload = unknown>(event: string, payload: Payload): void
  on<Payload = unknown>(event: string, handler: SkillEventHandler<Payload>): () => void
  useAdapter<Input, Output>(name: string, input: Input): Promise<Output>
}

/**
 * A unit is an immutable definition. Per-mount mutable data belongs in ctx.state,
 * never on the registered unit object.
 */
export interface SkillUnit<Config = unknown, Output = unknown> {
  readonly name: string
  setup(ctx: SkillContext, config: Config): MaybePromise<Output>
  teardown(ctx: SkillContext): MaybePromise<void>
  onError?(error: Error, ctx: SkillContext): MaybePromise<void>
}

export type SkillLifecyclePhase =
  | 'setting-up'
  | 'active'
  | 'failed'
  | 'disposing'
  | 'disposed'

export interface SkillHandle<Output = unknown> {
  readonly id: string
  readonly name: string
  readonly context: SkillContext
  readonly ready: Promise<Output>
  readonly phase: SkillLifecyclePhase
  readonly output: Output | undefined
  dispose(): Promise<void>
}

export interface SkillMountOptions {
  instanceId?: string
  host?: object
  scope?: SkillScope
}

export interface SkillScope extends SkillScopeContext {
  readonly disposed: boolean
  readonly eventBus: SkillEventBus
  mount<Config, Output>(
    name: string,
    config: Config,
    options?: Omit<SkillMountOptions, 'scope'>
  ): SkillHandle<Output>
  dispose(): Promise<void>
}

export interface SkillRuntimeOptions {
  idFactory?: (prefix: string) => string
  observers?: readonly SkillObserver[]
}

export interface SkillRegisterOptions {
  override?: boolean
}

export interface SkillRuntimeApi {
  register<Config, Output>(
    unit: SkillUnit<Config, Output>,
    options?: SkillRegisterOptions
  ): () => void
  unregister(name: string): boolean
  has(name: string): boolean
  list(): readonly string[]
  registerAdapter<Input, Output>(
    adapter: SkillAdapter<Input, Output>,
    options?: SkillRegisterOptions
  ): () => void
  mount<Config, Output>(
    name: string,
    config: Config,
    options?: SkillMountOptions
  ): SkillHandle<Output>
  createScope(id?: string): SkillScope
  observe(observer: SkillObserver): () => void
  dispose(): Promise<void>
}
