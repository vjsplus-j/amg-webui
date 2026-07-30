<script setup lang="ts">
import { computed, inject, provide, reactive, watch } from 'vue'
import { BUTTON_CONFIG_KEY } from '../Button/config'
import { TAG_CONFIG_KEY } from '../Tag/config'
import { BADGE_CONFIG_KEY } from '../Badge/config'
import { AVATAR_CONFIG_KEY } from '../Avatar/config'
import { CONFIG_PROVIDER_KEY } from './config'
import type { ConfigProviderProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  telemetry: undefined
})

const parentConfig = inject(CONFIG_PROVIDER_KEY, undefined)

const mergedConfig = computed<ConfigProviderProps>(() => {
  const parent = parentConfig?.value ?? {}
  return {
    size: props.size ?? parent.size,
    zIndex: props.zIndex ?? parent.zIndex,
    namespace: props.namespace ?? parent.namespace,
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

const hostStyle = computed(() => ({
  ...props.style,
  ...(mergedConfig.value.zIndex !== undefined
    ? { '--vp-z-index': String(mergedConfig.value.zIndex) }
    : {})
}))
</script>

<template>
  <div
    class="vp-config-provider"
    :class="props.class"
    :style="hostStyle"
    :data-namespace="mergedConfig.namespace"
    data-component="ConfigProvider"
  >
    <slot />
  </div>
</template>
