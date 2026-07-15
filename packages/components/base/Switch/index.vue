<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { SwitchProps, SwitchEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  loading: false
})

const emit = defineEmits<SwitchEmits>()
const { t } = useLocale()

const isDisabled = computed(() => props.disabled || props.loading)

const activeLabel = computed(() => props.activeText ?? t(LocaleKeys.common.yes))
const inactiveLabel = computed(() => props.inactiveText ?? t(LocaleKeys.common.no))
const promptText = computed(() => (props.modelValue ? activeLabel.value : inactiveLabel.value))

const rootClass = computed(() => [
  'vp-switch',
  { 'vp-switch--disabled': isDisabled.value },
  props.class
])

const handleChange = (event: Event) => {
  if (isDisabled.value) return
  const checked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', checked)
  emit('change', checked)
}

function toggle() {
  if (isDisabled.value) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <label
    :class="rootClass"
    :style="style"
    tabindex="0"
    @click.prevent="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <input
      class="vp-switch__input"
      type="checkbox"
      role="switch"
      tabindex="-1"
      :checked="modelValue"
      :disabled="isDisabled"
      :aria-checked="modelValue"
      @change="handleChange"
      @click.stop
    />
    <span class="vp-switch__track">
      <span class="vp-switch__thumb">
        <svg
          v-if="loading"
          class="vp-switch__loader"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      </span>
    </span>
    <span v-if="inlinePrompt" class="vp-switch__prompt">{{ promptText }}</span>
    <slot />
  </label>
</template>
