import {
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  unref,
  watch,
  type Ref,
  type ShallowRef
} from 'vue'
import {
  createThemeRuntime,
  createDocumentHost,
  createMemoryStorage,
  createAutoStorage,
  createNullHost,
  THEME_RUNTIME_KEY,
  type ThemeRuntime,
  type DesignStyleName,
  type ColorScheme,
  type FontName,
  type IconStyleName
} from '@amg-webui/theme'

export interface ThemeScopeOptions {
  /** Existing runtime — provider will not dispose it. */
  runtime?: ThemeRuntime | null
  design?: DesignStyleName | string | null
  scheme?: ColorScheme | null
  font?: FontName | string | null
  iconStyle?: IconStyleName | string | null
  /** CSS var overlay. */
  tokens?: Record<string, string> | null
  /** Primary color → full scale via `setPrimary`. */
  primary?: string | null
  /** Persist axes to storage. Default false for scoped providers. */
  persist?: boolean
  storageNamespace?: string
  /**
   * When true, always create a local runtime (ThemeProvider).
   * ConfigProvider passes false unless theme axes are set.
   */
  forceLocal?: boolean
}

export interface ThemeScopeHandle {
  runtime: ShallowRef<ThemeRuntime | null>
  rootRef: ShallowRef<HTMLElement | null>
  ownsRuntime: Ref<boolean>
}

function hasThemeAxes(opts: ThemeScopeOptions): boolean {
  return Boolean(
    opts.runtime ||
      opts.forceLocal ||
      opts.design ||
      opts.scheme ||
      opts.font ||
      opts.iconStyle ||
      opts.primary ||
      (opts.tokens && Object.keys(opts.tokens).length > 0)
  )
}

/** True when this scope owns the host binding (local or injected runtime), not inherited. */
function shouldBindHost(opts: ThemeScopeOptions, ownsRuntime: boolean): boolean {
  return Boolean(hasThemeAxes(opts) && (ownsRuntime || opts.runtime))
}

function syncRuntime(
  rt: ThemeRuntime,
  opts: ThemeScopeOptions,
  tokenAxis: { lastApplied: Record<string, string> | null | undefined }
) {
  if (opts.design) rt.setDesign(opts.design as DesignStyleName)
  if (opts.scheme) rt.setScheme(opts.scheme)
  if (opts.font) rt.setFont(opts.font as FontName)
  if (opts.iconStyle) rt.setIconStyle(opts.iconStyle as IconStyleName)
  if (opts.tokens !== undefined) {
    rt.replaceCustom(opts.tokens ?? {})
    tokenAxis.lastApplied = opts.tokens ?? {}
  } else if (tokenAxis.lastApplied !== undefined) {
    rt.replaceCustom({})
    tokenAxis.lastApplied = undefined
  }
  if (opts.primary) rt.setPrimary(opts.primary)
}

/**
 * Bind a local (or parent) ThemeRuntime to a host element.
 * Prefer this over `ThemeService.configure` for same-page multi-theme.
 */
export function createThemeScope(options: () => ThemeScopeOptions): ThemeScopeHandle {
  const rootRef = shallowRef<HTMLElement | null>(null)
  const runtime = shallowRef<ThemeRuntime | null>(null)
  const ownsRuntime = shallowRef(false)
  const tokenAxis = { lastApplied: undefined as Record<string, string> | null | undefined }

  // inject() must run synchronously during setup — not inside onMounted / watchers.
  const inheritedRuntime = getCurrentInstance()
    ? inject(THEME_RUNTIME_KEY, null)
    : null

  function resolveInherited(): ThemeRuntime | null {
    return inheritedRuntime ? unref(inheritedRuntime) : null
  }

  function disposeOwnedRuntime() {
    if (ownsRuntime.value && runtime.value) {
      runtime.value.dispose()
    }
  }

  function ensureRuntime() {
    const opts = options()
    if (!hasThemeAxes(opts)) {
      if (ownsRuntime.value) {
        disposeOwnedRuntime()
      }
      runtime.value = resolveInherited()
      ownsRuntime.value = false
      tokenAxis.lastApplied = undefined
      return
    }

    if (opts.runtime) {
      if (ownsRuntime.value) {
        disposeOwnedRuntime()
      }
      runtime.value = opts.runtime
      ownsRuntime.value = false
      syncRuntime(opts.runtime, opts, tokenAxis)
      return
    }

    if (runtime.value && ownsRuntime.value) {
      syncRuntime(runtime.value, opts, tokenAxis)
      return
    }

    if (ownsRuntime.value) {
      disposeOwnedRuntime()
    }

    const next = createThemeRuntime({
      host: createNullHost(),
      storage: opts.persist ? createAutoStorage() : createMemoryStorage(),
      storageNamespace: opts.storageNamespace ?? 'amg-webui-scope',
      persist: opts.persist === true,
      syncBrandFont: true
    })
    next.init({
      preferStorage: opts.persist === true,
      overrides: {
        ...(opts.design ? { design: opts.design as DesignStyleName } : {}),
        ...(opts.scheme ? { scheme: opts.scheme } : {}),
        ...(opts.font ? { font: opts.font as FontName } : {}),
        ...(opts.iconStyle ? { iconStyle: opts.iconStyle as IconStyleName } : {})
      }
    })
    runtime.value = next
    ownsRuntime.value = true
    syncRuntime(next, opts, tokenAxis)
  }

  function paintHost() {
    const el = rootRef.value
    const rt = runtime.value
    const opts = options()
    if (!el || !rt || !shouldBindHost(opts, ownsRuntime.value)) return
    rt.bindHost(createDocumentHost(el))
    syncRuntime(rt, opts, tokenAxis)
  }

  // Resolve runtime during setup so provide/inject and expose see it immediately.
  ensureRuntime()

  if (getCurrentInstance()) {
    onMounted(() => {
      ensureRuntime()
      paintHost()
    })

    watch(
      () => options(),
      () => {
        ensureRuntime()
        paintHost()
      },
      { deep: true }
    )

    watch(
      () => resolveInherited(),
      (parentRt) => {
        if (!hasThemeAxes(options())) {
          if (ownsRuntime.value) {
            disposeOwnedRuntime()
          }
          runtime.value = parentRt
          ownsRuntime.value = false
          tokenAxis.lastApplied = undefined
        }
      }
    )

    watch(rootRef, () => {
      paintHost()
    })

    onBeforeUnmount(() => {
      disposeOwnedRuntime()
      runtime.value = null
      ownsRuntime.value = false
      tokenAxis.lastApplied = undefined
    })
  }

  return { runtime, rootRef, ownsRuntime }
}

export { THEME_RUNTIME_KEY }
