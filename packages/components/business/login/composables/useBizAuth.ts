import { onScopeDispose, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import type { BizRequestOptions } from '../../_shared/types'
import type {
  BizAuthAdapter,
  BizAuthResult,
  BizForgotPasswordPayload,
  BizLoginCredentials,
  BizRegisterPayload
} from '../types'

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Unknown error'
}

function isAbortError(err: unknown): boolean {
  if (err instanceof DOMException && err.name === 'AbortError') return true
  if (err instanceof Error && err.name === 'AbortError') return true
  return false
}

export interface UseBizAuthReturn {
  loading: Ref<boolean>
  error: Ref<string | null>
  login: (credentials: BizLoginCredentials) => Promise<BizAuthResult | undefined>
  register: (payload: BizRegisterPayload) => Promise<BizAuthResult | undefined>
  resetPassword: (payload: BizForgotPasswordPayload) => Promise<void>
  sendCode: (channel: 'login' | 'register' | 'forgot', target: string) => Promise<void>
  abort: () => void
}

/**
 * Race-safe auth mutations with optional AbortSignal forwarded to adapter.
 */
export function useBizAuth(options: {
  adapter: MaybeRefOrGetter<BizAuthAdapter | undefined>
}): UseBizAuthReturn {
  const loading = ref(false)
  const error = ref<string | null>(null)
  let seq = 0
  let controller: AbortController | null = null
  let disposed = false

  function abort() {
    if (controller) {
      controller.abort()
      controller = null
    }
  }

  async function run<R>(fn: (req?: BizRequestOptions) => Promise<R>): Promise<R | undefined> {
    if (disposed) return undefined
    abort()
    const currentSeq = ++seq
    const nextController = typeof AbortController !== 'undefined' ? new AbortController() : null
    controller = nextController
    const reqOpts: BizRequestOptions | undefined = nextController
      ? { signal: nextController.signal }
      : undefined
    loading.value = true
    error.value = null
    try {
      const result = await fn(reqOpts)
      if (disposed || currentSeq !== seq) return undefined
      return result
    } catch (err) {
      if (disposed || currentSeq !== seq || isAbortError(err)) return undefined
      error.value = toErrorMessage(err)
      return undefined
    } finally {
      if (currentSeq === seq) {
        loading.value = false
        if (controller === nextController) controller = null
      }
    }
  }

  function resolveAdapter(): BizAuthAdapter | undefined {
    return toValue(options.adapter)
  }

  async function login(credentials: BizLoginCredentials) {
    const adapter = resolveAdapter()
    if (!adapter) return undefined
    return run((req) => adapter.login(credentials, req))
  }

  async function register(payload: BizRegisterPayload) {
    const adapter = resolveAdapter()
    if (!adapter?.register) {
      error.value = 'register is not supported'
      return undefined
    }
    return run((req) => adapter.register!(payload, req))
  }

  async function resetPassword(payload: BizForgotPasswordPayload) {
    const adapter = resolveAdapter()
    if (!adapter?.resetPassword) {
      error.value = 'resetPassword is not supported'
      return undefined
    }
    await run(async (req) => {
      await adapter.resetPassword!(payload, req)
    })
  }

  async function sendCode(channel: 'login' | 'register' | 'forgot', target: string) {
    const adapter = resolveAdapter()
    if (!adapter?.sendCode) return undefined
    await run(async (req) => {
      await adapter.sendCode!(channel, target, req)
    })
  }

  onScopeDispose(() => {
    disposed = true
    abort()
  })

  return { loading, error, login, register, resetPassword, sendCode, abort }
}
