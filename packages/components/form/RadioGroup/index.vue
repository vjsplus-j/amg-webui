<script setup lang="ts">
import { computed, provide } from 'vue'
import Radio from '../Radio/index.vue'
import { RADIO_GROUP_INJECTION_KEY } from '../Radio/types'
import type { RadioGroupProps, RadioGroupEmits } from './types'
import { useRadioGroup } from './useRadioGroup'
import { useFormItem } from '../FormItem/useFormItem'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'RadioGroup' })

const props = withDefaults(defineProps<RadioGroupProps>(), {
  direction: 'horizontal',
  size: 'md',
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<RadioGroupEmits>()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name
})

const groupSource = computed(() => ({
  direction: props.direction,
  size: props.size,
  disabled: isDisabled.value,
  options: props.options,
  class: props.class
}))

const { orientation, optionList, rootClass } = useRadioGroup(groupSource)

const change = (value: unknown) => {
  if (isDisabled.value) return
  emit('update:modelValue', value)
  emit('change', value)
  void validateOnChange()
}

provide(RADIO_GROUP_INJECTION_KEY, {
  get modelValue() {
    return props.modelValue
  },
  get disabled() {
    return isDisabled.value
  },
  get name() {
    return props.name
  },
  get size() {
    return props.size
  },
  change
})
</script>

<template>
  <div
    :id="inputId"
    :class="rootClass"
    :style="style"
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-orientation="orientation"
    :aria-disabled="isDisabled || undefined"
    :aria-invalid="isInvalid || undefined"
    :aria-required="isRequired || undefined"
    :aria-describedby="ariaDescribedby"
  >
    <Radio
      v-for="(opt, idx) in optionList"
      :key="`${String(opt.value)}-${idx}`"
      :value="opt.value"
      :label="opt.label"
      :disabled="opt.disabled"
      :size="size"
      :track-id="trackId"
      :telemetry="telemetry"
      skip-form-item
    />
    <slot />
  </div>
</template>
