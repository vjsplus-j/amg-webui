<script setup lang="ts">
import { computed, onBeforeUnmount, provide, watch } from 'vue'
import { THEME_RUNTIME_KEY, type ThemeRuntime, type ThemeSnapshot } from '@amg-webui/theme'
import { createThemeScope } from '@amg-webui/hooks'
import type { ThemeProviderEmits, ThemeProviderProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<ThemeProviderProps>(), {
  persist: false,
  tag: 'div',
  display: 'block',
  telemetry: undefined
})

const emit = defineEmits<ThemeProviderEmits>()

const scope = createThemeScope(() => ({
  forceLocal: true,
  runtime: props.runtime,
  design: props.design ?? props.theme,
  scheme: props.scheme,
  font: props.font,
  iconStyle: props.iconStyle,
  tokens: props.tokens,
  primary: props.primary,
  persist: props.persist,
  storageNamespace: props.storageNamespace
}))

provide(THEME_RUNTIME_KEY, scope.runtime)

let unsubscribe: (() => void) | undefined

function bindSubscription(runtime: ThemeRuntime | null | undefined) {
  unsubscribe?.()
  unsubscribe = undefined
  if (!runtime) return
  unsubscribe = runtime.subscribe((state) => {
    emit('change', state as ThemeSnapshot)
  })
  // Runtime may have notified during ensureRuntime before this watcher bound.
  emit('change', runtime.getState() as ThemeSnapshot)
}

watch(scope.runtime, bindSubscription, { immediate: true })

onBeforeUnmount(() => {
  unsubscribe?.()
  unsubscribe = undefined
})

const rootClass = computed(() => [
  'vp-theme-provider',
  `vp-theme-provider--${props.display}`,
  props.class
])

function setRoot(el: unknown) {
  scope.rootRef.value = (el as HTMLElement | null) ?? null
}

defineExpose({
  runtime: scope.runtime,
  applyCustom: (tokens: Record<string, string>) => scope.runtime.value?.applyCustom(tokens),
  replaceCustom: (tokens: Record<string, string>) => scope.runtime.value?.replaceCustom(tokens),
  setPrimary: (primary: string) => scope.runtime.value?.setPrimary(primary),
  getState: () => scope.runtime.value?.getState()
})
</script>

<template>
  <component
    :is="tag"
    :ref="setRoot"
    :class="rootClass"
    :style="style"
    data-component="ThemeProvider"
    :aria-label="ariaLabel"
  >
    <slot :runtime="scope.runtime.value" />
  </component>
</template>
