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

function syncRuntime(rt: ThemeRuntime, opts: ThemeScopeOptions) {
  if (opts.design) rt.setDesign(opts.design as DesignStyleName)
  if (opts.scheme) rt.setScheme(opts.scheme)
  if (opts.font) rt.setFont(opts.font as FontName)
  if (opts.iconStyle) rt.setIconStyle(opts.iconStyle as IconStyleName)
  if (opts.tokens && Object.keys(opts.tokens).length > 0) {
    rt.applyCustom(opts.tokens)
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

  function ensureRuntime() {
    const opts = options()
    if (!hasThemeAxes(opts)) {
      const parent = inject(THEME_RUNTIME_KEY, null)
      runtime.value = parent ? unref(parent) : null
      ownsRuntime.value = false
      return
    }

    if (opts.runtime) {
      runtime.value = opts.runtime
      ownsRuntime.value = false
      syncRuntime(opts.runtime, opts)
      return
    }

    if (runtime.value && ownsRuntime.value) {
      syncRuntime(runtime.value, opts)
      return
    }

    const next = createThemeRuntime({
      host: createDocumentHost(null),
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
    syncRuntime(next, opts)
  }

  function paintHost() {
    const el = rootRef.value
    const rt = runtime.value
    if (!el || !rt) return
    rt.bindHost(createDocumentHost(el))
    syncRuntime(rt, options())
  }

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

    watch(rootRef, () => {
      paintHost()
    })

    onBeforeUnmount(() => {
      if (ownsRuntime.value && runtime.value) {
        runtime.value.dispose()
      }
      runtime.value = null
      ownsRuntime.value = false
    })
  }

  return { runtime, rootRef, ownsRuntime }
}

export { THEME_RUNTIME_KEY }
