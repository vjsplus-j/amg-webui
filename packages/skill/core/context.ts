import type { SkillAdapter } from '../adapters/types'
import { abortError, SkillAbortError, toError } from './errors'
import { createSkillEventBus } from './eventBus'
import type {
  MaybePromise,
  SkillContext,
  SkillContextUtils,
  SkillEventBus,
  SkillEventHandler,
  SkillRetryOptions,
  SkillScope,
  SkillState
} from './types'

export interface SkillContextController {
  readonly context: SkillContext
  abort(reason?: unknown): void
  dispose(reason?: unknown): void
}

export interface CreateSkillContextOptions {
  instanceId: string
  skillName: string
  host?: object
  scope?: SkillScope
  resolveAdapter(name: string): SkillAdapter | undefined
}

function assertActive(signal: AbortSignal): void {
  if (signal.aborted) throw abortError(signal.reason)
}

function normalizeRetryOptions(options: SkillRetryOptions = {}): Required<
  Omit<SkillRetryOptions, 'shouldRetry'>
> & Pick<SkillRetryOptions, 'shouldRetry'> {
  const maxAttempts = options.maxAttempts ?? 3
  const delayMs = options.delayMs ?? 0
  const backoff = options.backoff ?? 1
  const maxDelayMs = options.maxDelayMs ?? Number.POSITIVE_INFINITY
  const jitter = options.jitter ?? 0

  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new RangeError('maxAttempts must be a positive integer')
  }
  if (delayMs < 0 || backoff < 1 || maxDelayMs < 0 || jitter < 0 || jitter > 1) {
    throw new RangeError('Invalid retry timing options')
  }

  return {
    maxAttempts,
    delayMs,
    backoff,
    maxDelayMs,
    jitter,
    shouldRetry: options.shouldRetry
  }
}

export function createSkillContext(
  options: CreateSkillContextOptions
): SkillContextController {
  const rootController = new AbortController()
  const requestControllers = new Map<AbortController, () => void>()
  const localBus: SkillEventBus = options.scope?.eventBus ?? createSkillEventBus()
  const subscriptions = new Set<() => void>()
  const state: SkillState = Object.create(null) as SkillState
  let disposed = false

  const createAbortController = (): AbortController => {
    const controller = new AbortController()
    if (rootController.signal.aborted) {
      controller.abort(rootController.signal.reason)
      return controller
    }

    const abortFromRoot = () => controller.abort(rootController.signal.reason)
    const detachFromRoot = () =>
      rootController.signal.removeEventListener('abort', abortFromRoot)
    rootController.signal.addEventListener('abort', abortFromRoot, { once: true })
    controller.signal.addEventListener(
      'abort',
      () => {
        detachFromRoot()
        requestControllers.delete(controller)
      },
      { once: true }
    )
    requestControllers.set(controller, detachFromRoot)
    return controller
  }

  const releaseAbortController = (controller: AbortController): void => {
    const detachFromRoot = requestControllers.get(controller)
    if (!detachFromRoot) return
    detachFromRoot()
    requestControllers.delete(controller)
  }

  const cancelAllRequests = (reason?: unknown): void => {
    for (const controller of [...requestControllers.keys()]) controller.abort(reason)
    requestControllers.clear()
  }

  const sleep = (ms: number): Promise<void> => {
    if (!Number.isFinite(ms) || ms < 0) {
      return Promise.reject(new RangeError('sleep duration must be a non-negative number'))
    }
    assertActive(rootController.signal)

    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup()
        resolve()
      }, ms)
      const onAbort = () => {
        cleanup()
        reject(abortError(rootController.signal.reason))
      }
      const cleanup = () => {
        clearTimeout(timer)
        rootController.signal.removeEventListener('abort', onAbort)
      }
      rootController.signal.addEventListener('abort', onAbort, { once: true })
    })
  }

  const utils: SkillContextUtils = {
    createAbortController,
    releaseAbortController,
    cancelAllRequests,
    cancelAllRequest: cancelAllRequests,
    sleep,
    async retry<T>(
      operation: (attempt: number, signal: AbortSignal) => MaybePromise<T>,
      retryOptions: SkillRetryOptions = {}
    ): Promise<T> {
      const retry = normalizeRetryOptions(retryOptions)
      let lastError: Error | undefined

      for (let attempt = 1; attempt <= retry.maxAttempts; attempt += 1) {
        assertActive(rootController.signal)
        try {
          return await operation(attempt, rootController.signal)
        } catch (error) {
          lastError = toError(error)
          if (lastError instanceof SkillAbortError) throw lastError
          const canRetry =
            attempt < retry.maxAttempts &&
            (retry.shouldRetry?.(lastError, attempt) ?? true)
          if (!canRetry) throw lastError

          const baseDelay = Math.min(
            retry.maxDelayMs,
            retry.delayMs * retry.backoff ** (attempt - 1)
          )
          const jitterOffset = baseDelay * retry.jitter * (Math.random() * 2 - 1)
          await sleep(Math.max(0, baseDelay + jitterOffset))
        }
      }

      throw lastError ?? new Error('Retry failed without an error')
    }
  }

  const context: SkillContext = {
    instanceId: options.instanceId,
    skillName: options.skillName,
    state,
    signal: rootController.signal,
    scope: options.scope,
    host: options.host,
    utils,
    emit<Payload>(event: string, payload: Payload): void {
      localBus.emit(event, payload)
    },
    on<Payload>(event: string, handler: SkillEventHandler<Payload>): () => void {
      const off = localBus.on(event, handler)
      subscriptions.add(off)
      return () => {
        subscriptions.delete(off)
        off()
      }
    },
    async useAdapter<Input, Output>(name: string, input: Input): Promise<Output> {
      assertActive(rootController.signal)
      const adapter = options.resolveAdapter(name) as SkillAdapter<Input, Output> | undefined
      if (!adapter) throw new Error(`Unknown skill adapter: ${name}`)
      try {
        return await adapter.execute(input, context)
      } catch (error) {
        throw adapter.mapError?.(error, context) ?? toError(error)
      }
    }
  }

  const abort = (reason?: unknown): void => {
    if (!rootController.signal.aborted) rootController.abort(reason)
    cancelAllRequests(reason)
  }

  return {
    context,
    abort,
    dispose(reason?: unknown): void {
      if (disposed) return
      disposed = true
      abort(reason)
      for (const off of subscriptions) off()
      subscriptions.clear()
    }
  }
}
