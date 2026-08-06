<script setup lang="ts">
import { computed, inject, onUnmounted, provide, reactive, ref, watch } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import { THEME_RUNTIME_KEY } from '@amg-webui/theme'
import { createThemeScope } from '@amg-webui/hooks'
import { setZIndexBase } from '@amg-webui/utils/zIndexManager'
import { BUTTON_CONFIG_KEY } from '../Button/config'
import { TAG_CONFIG_KEY } from '../Tag/config'
import { BADGE_CONFIG_KEY } from '../Badge/config'
import { AVATAR_CONFIG_KEY } from '../Avatar/config'
import { CONFIG_PROVIDER_KEY } from './config'
import type { ConfigProviderEmits, ConfigProviderProps, ConfigProviderResolvedConfig } from './types'
import './style.scss'

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  namespace: 'vp',
  density: 'comfortable',
  themePersist: false,
  telemetry: undefined
})
const emit = defineEmits<ConfigProviderEmits>()

const parentConfig = inject(CONFIG_PROVIDER_KEY, undefined)
const localeEpoch = ref(0)
const unsubLocale = LocaleService.subscribe(() => {
  localeEpoch.value += 1
})
const unsubDir = LocaleService.subscribeDir(() => {
  localeEpoch.value += 1
})
onUnmounted(() => {
  unsubLocale()
  unsubDir()
})

const resolvedDesign = computed(() => props.design ?? props.theme ?? parentConfig?.value?.design ?? parentConfig?.value?.theme)

const themeScope = createThemeScope(() => ({
  forceLocal: false,
  runtime: props.themeRuntime,
  design: resolvedDesign.value,
  scheme: props.scheme,
  font: props.font,
  iconStyle: props.iconStyle,
  tokens: props.tokens,
  primary: props.primary,
  persist: props.themePersist,
  storageNamespace: props.themeStorageNamespace
}))

const hasLocalTheme = Boolean(
  props.themeRuntime ||
    props.design ||
    props.theme ||
    props.scheme ||
    props.font ||
    props.iconStyle ||
    props.primary ||
    (props.tokens && Object.keys(props.tokens).length > 0)
)

if (hasLocalTheme) {
  provide(THEME_RUNTIME_KEY, themeScope.runtime)
}

const mergedConfig = computed<ConfigProviderResolvedConfig>(() => {
  void localeEpoch.value
  const parent = parentConfig?.value ?? {}
  return {
    size: props.size ?? parent.size,
    zIndex: props.zIndex ?? parent.zIndex,
    namespace: props.namespace ?? parent.namespace,
    direction: props.direction ?? parent.direction ?? LocaleService.getDir(),
    density: props.density ?? parent.density,
    theme: props.theme ?? props.design ?? parent.theme,
    design: props.design ?? props.theme ?? parent.design,
    scheme: props.scheme ?? parent.scheme,
    font: props.font ?? parent.font,
    iconStyle: props.iconStyle ?? parent.iconStyle,
    tokens: props.tokens ?? parent.tokens,
    primary: props.primary ?? parent.primary,
    themeRuntime: props.themeRuntime ?? parent.themeRuntime,
    themePersist: props.themePersist ?? parent.themePersist,
    themeStorageNamespace: props.themeStorageNamespace ?? parent.themeStorageNamespace,
    locale: props.locale ?? parent.locale ?? LocaleService.getLocale(),
    validateMessages: { ...(parent.validateMessages ?? {}), ...(props.validateMessages ?? {}) },
    componentDefaults: {
      ...(parent.componentDefaults ?? {}),
      ...(props.componentDefaults ?? {})
    },
    empty: { ...(parent.empty ?? {}), ...(props.empty ?? {}) },
    button: { ...(parent.button ?? {}), ...(props.button ?? {}) },
    tag: { ...(parent.tag ?? {}), ...(props.tag ?? {}) },
    badge: { ...(parent.badge ?? {}), ...(props.badge ?? {}) },
    avatar: { ...(parent.avatar ?? {}), ...(props.avatar ?? {}) }
  }
})

provide(CONFIG_PROVIDER_KEY, mergedConfig)

watch(
  () => mergedConfig.value.zIndex,
  (z) => {
    if (z != null) setZIndexBase(z)
  },
  { immediate: true }
)

function provideNested(
  key: symbol,
  parentInjected: object | undefined,
  local: object | undefined
) {
  if (local === undefined) return
  const merged = reactive({ ...(parentInjected as object), ...local }) as Record<string, unknown>
  watch(
    () => ({ ...(parentInjected as object), ...local }),
    (next) => {
      for (const k of Object.keys(merged)) {
        if (!(k in next)) delete merged[k]
      }
      Object.assign(merged, next)
    },
    { immediate: true, deep: true }
  )
  provide(key, merged)
}

provideNested(BUTTON_CONFIG_KEY, inject(BUTTON_CONFIG_KEY, undefined), props.button)
provideNested(TAG_CONFIG_KEY, inject(TAG_CONFIG_KEY, undefined), props.tag)
provideNested(BADGE_CONFIG_KEY, inject(BADGE_CONFIG_KEY, undefined), props.badge)
provideNested(AVATAR_CONFIG_KEY, inject(AVATAR_CONFIG_KEY, undefined), props.avatar)

const sizeHeight = computed(() => {
  if (mergedConfig.value.size === 'xs') return 'var(--height-xs, 1.75rem)'
  if (mergedConfig.value.size === 'sm') return 'var(--height-sm, 2rem)'
  if (mergedConfig.value.size === 'lg') return 'var(--height-lg, 3rem)'
  if (mergedConfig.value.size === 'xl') return 'var(--height-xl, 3.5rem)'
  return 'var(--height-md, 2.5rem)'
})

const densityGap = computed(() => {
  if (mergedConfig.value.density === 'compact') return 'var(--spacing-sm)'
  if (mergedConfig.value.density === 'spacious') return 'var(--spacing-xl)'
  return 'var(--spacing-md)'
})

const hostStyle = computed(() => ({
  ...props.style,
  '--vp-config-control-height': sizeHeight.value,
  '--vp-config-density-gap': densityGap.value,
  ...(mergedConfig.value.zIndex !== undefined
    ? { '--vp-z-index': String(mergedConfig.value.zIndex) }
    : {})
}))

watch(
  mergedConfig,
  (config) => {
    emit('change', config)
  },
  { deep: true, immediate: true }
)

function setRoot(el: unknown) {
  themeScope.rootRef.value = (el as HTMLElement | null) ?? null
}

defineExpose({
  config: mergedConfig,
  themeRuntime: themeScope.runtime
})
</script>

<template>
  <div
    :ref="setRoot"
    class="vp-config-provider"
    :class="props.class"
    :style="hostStyle"
    :dir="mergedConfig.direction"
    :data-namespace="mergedConfig.namespace"
    :data-density="mergedConfig.density"
    :data-theme="mergedConfig.theme"
    :data-size="mergedConfig.size"
    data-component="ConfigProvider"
  >
    <slot :config="mergedConfig" />
  </div>
</template>
