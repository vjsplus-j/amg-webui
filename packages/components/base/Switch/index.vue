<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import type { SwitchProps, SwitchEmits } from './types'
import { useSwitch } from './useSwitch'
import './style.scss'

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  loading: false,
  size: 'md',
  inlinePrompt: false,
  telemetry: undefined
})

const emit = defineEmits<SwitchEmits>()
const { t } = useLocale()

const switchSource = computed(() => ({
  modelValue: props.modelValue,
  disabled: props.disabled,
  loading: props.loading,
  size: props.size,
  inlinePrompt: props.inlinePrompt,
  activeText: props.activeText,
  inactiveText: props.inactiveText,
  ariaLabel: props.ariaLabel,
  activeFallback: t(LocaleKeys.common.yes),
  inactiveFallback: t(LocaleKeys.common.no)
}))

const { isDisabled, promptText, switchAriaLabel, rootClass } = useSwitch(switchSource)

function commit(next: boolean) {
  if (isDisabled.value) return
  emit('update:modelValue', next)
  emit('change', next)
  trackEmit({
    component: 'Switch',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: next }
  })
}

const handleChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  commit(checked)
}
</script>

<template>
  <label :class="[rootClass, props.class]" :style="style">
    <input
      class="vp-switch__input"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      :disabled="isDisabled"
      :aria-checked="modelValue"
      :aria-label="switchAriaLabel"
      :aria-busy="loading || undefined"
      @change="handleChange"
    />
    <span class="vp-switch__track" aria-hidden="true">
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
          <path
            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
          />
        </svg>
      </span>
    </span>
    <span v-if="inlinePrompt" class="vp-switch__prompt">{{ promptText }}</span>
    <slot />
  </label>
</template>
