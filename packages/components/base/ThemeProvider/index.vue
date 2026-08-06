<script setup lang="ts">
import { computed, provide, watch } from 'vue'
import { THEME_RUNTIME_KEY, type ThemeSnapshot } from '@amg-webui/theme'
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

watch(
  () => scope.runtime.value?.getState(),
  (state) => {
    if (state) emit('change', state as ThemeSnapshot)
  },
  { deep: true }
)

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
