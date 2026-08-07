import { onScopeDispose, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import type { BizRequestOptions } from '../../_shared/types'
import type { BizSettingsAdapter, BizSettingsSnapshot } from '../types'

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

export interface UseBizSettingsReturn {
  snapshot: Ref<BizSettingsSnapshot | null>
  loading: Ref<boolean>
  saving: Ref<boolean>
  error: Ref<string | null>
  saveError: Ref<string | null>
  load: () => Promise<void>
  save: (payload: BizSettingsSnapshot) => Promise<BizSettingsSnapshot | undefined>
  changePassword: (payload: { oldPassword: string; newPassword: string }) => Promise<void>
  abort: () => void
}

/**
 * Loads/saves settings via adapter with race protection + AbortSignal.
 */
export function useBizSettings(options: {
  adapter: MaybeRefOrGetter<BizSettingsAdapter | undefined>
  immediate?: boolean
}): UseBizSettingsReturn {
  const snapshot = ref<BizSettingsSnapshot | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const saveError = ref<string | null>(null)

  let loadSeq = 0
  let saveSeq = 0
  let loadController: AbortController | null = null
  let saveController: AbortController | null = null
  let disposed = false

  function resolveAdapter(): BizSettingsAdapter | undefined {
    return toValue(options.adapter)
  }

  function abortLoad() {
    if (loadController) {
      loadController.abort()
      loadController = null
    }
  }

  function abortSave() {
    if (saveController) {
      saveController.abort()
      saveController = null
    }
  }

  function abort() {
    abortLoad()
    abortSave()
  }

  async function load(): Promise<void> {
    const adapter = resolveAdapter()
    if (!adapter || disposed) return
    abortLoad()
    const seq = ++loadSeq
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    loadController = controller
    const reqOpts: BizRequestOptions | undefined = controller ? { signal: controller.signal } : undefined
    loading.value = true
    error.value = null
    try {
      const result = await adapter.load(reqOpts)
      if (disposed || seq !== loadSeq) return
      snapshot.value = result
    } catch (err) {
      if (disposed || seq !== loadSeq || isAbortError(err)) return
      error.value = toErrorMessage(err)
      snapshot.value = null
    } finally {
      if (seq === loadSeq) {
        loading.value = false
        if (loadController === controller) loadController = null
      }
    }
  }

  async function save(payload: BizSettingsSnapshot): Promise<BizSettingsSnapshot | undefined> {
    const adapter = resolveAdapter()
    if (!adapter || disposed) return undefined
    abortSave()
    const seq = ++saveSeq
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    saveController = controller
    const reqOpts: BizRequestOptions | undefined = controller ? { signal: controller.signal } : undefined
    saving.value = true
    saveError.value = null
    try {
      const result = await adapter.save(payload, reqOpts)
      if (disposed || seq !== saveSeq) return undefined
      snapshot.value = result
      return result
    } catch (err) {
      if (disposed || seq !== saveSeq || isAbortError(err)) return undefined
      saveError.value = toErrorMessage(err)
      return undefined
    } finally {
      if (seq === saveSeq) {
        saving.value = false
        if (saveController === controller) saveController = null
      }
    }
  }

  async function changePassword(payload: { oldPassword: string; newPassword: string }): Promise<void> {
    const adapter = resolveAdapter()
    if (!adapter?.changePassword || disposed) return
    abortSave()
    const seq = ++saveSeq
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    saveController = controller
    const reqOpts: BizRequestOptions | undefined = controller ? { signal: controller.signal } : undefined
    saving.value = true
    saveError.value = null
    try {
      await adapter.changePassword(payload, reqOpts)
      if (disposed || seq !== saveSeq) return
    } catch (err) {
      if (disposed || seq !== saveSeq || isAbortError(err)) return
      saveError.value = toErrorMessage(err)
    } finally {
      if (seq === saveSeq) {
        saving.value = false
        if (saveController === controller) saveController = null
      }
    }
  }

  watch(
    () => toValue(options.adapter),
    (next, prev) => {
      if (next === prev) return
      abort()
      if (next) void load()
    }
  )

  if (options.immediate !== false && resolveAdapter()) {
    void load()
  }

  onScopeDispose(() => {
    disposed = true
    abort()
  })

  return { snapshot, loading, saving, error, saveError, load, save, changePassword, abort }
}
