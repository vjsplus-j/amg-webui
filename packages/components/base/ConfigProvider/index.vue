<script setup lang="ts">
import { computed, inject, provide, reactive, watch } from 'vue'
import { BUTTON_CONFIG_KEY } from '../Button/config'
import { TAG_CONFIG_KEY } from '../Tag/config'
import { BADGE_CONFIG_KEY } from '../Badge/config'
import { AVATAR_CONFIG_KEY } from '../Avatar/config'
import { CONFIG_PROVIDER_KEY } from './config'
import type { ConfigProviderEmits, ConfigProviderProps, ConfigProviderResolvedConfig } from './types'
import './style.scss'

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  namespace: 'vp',
  direction: 'ltr',
  density: 'comfortable',
  telemetry: undefined
})
const emit = defineEmits<ConfigProviderEmits>()

const parentConfig = inject(CONFIG_PROVIDER_KEY, undefined)

const mergedConfig = computed<ConfigProviderResolvedConfig>(() => {
  const parent = parentConfig?.value ?? {}
  return {
    size: props.size ?? parent.size,
    zIndex: props.zIndex ?? parent.zIndex,
    namespace: props.namespace ?? parent.namespace,
    direction: props.direction ?? parent.direction,
    density: props.density ?? parent.density,
    theme: props.theme ?? parent.theme,
    locale: props.locale ?? parent.locale,
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

defineExpose({
  config: mergedConfig
})
</script>

<template>
  <div
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
