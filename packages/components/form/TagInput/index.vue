<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { TagInputProps, TagInputEmits } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'TagInput' })

const props = withDefaults(defineProps<TagInputProps>(), {
  modelValue: () => [],
  unique: true,
  size: 'md'
})

const emit = defineEmits<TagInputEmits>()
const { t } = useLocale()
const draft = ref('')

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnBlur,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid
})

const { nativeAttrs } = useNativeInputAttrs()

const closeLabel = computed(() => t(LocaleKeys.common.close))

const rootClass = computed(() => [
  'vp-taginput',
  `vp-taginput--${props.size}`,
  {
    'vp-taginput--fluid': props.fluid,
    'vp-taginput--disabled': isDisabled.value
  },
  props.class
])

const canAdd = computed(() => {
  if (isDisabled.value) return false
  const value = draft.value.trim()
  if (!value) return false
  if (props.max != null && (props.modelValue?.length ?? 0) >= props.max) return false
  if (props.unique && props.modelValue?.includes(value)) return false
  return true
})

const addTag = () => {
  if (!canAdd.value) return
  const value = draft.value.trim()
  const next = [...(props.modelValue ?? []), value]
  emit('update:modelValue', next)
  emit('add', value)
  draft.value = ''
  void validateOnChange()
}

const removeTag = (value: string) => {
  if (isDisabled.value) return
  const next = (props.modelValue ?? []).filter((v) => v !== value)
  emit('update:modelValue', next)
  emit('remove', value)
  void validateOnChange()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag()
  } else if (event.key === 'Backspace' && !draft.value && props.modelValue?.length) {
    removeTag(props.modelValue[props.modelValue.length - 1])
  }
}

const handleBlur = () => {
  addTag()
  void validateOnBlur()
}
</script>

<template>
  <div :class="rootClass" :style="style">
    <span v-for="tag in modelValue" :key="tag" class="vp-taginput__tag">
      {{ tag }}
      <button
        type="button"
        class="vp-taginput__remove"
        :aria-label="closeLabel"
        :disabled="isDisabled"
        @click="removeTag(tag)"
      >
        ×
      </button>
    </span>
    <input
      v-bind="nativeAttrs"
      :id="inputId"
      class="vp-taginput__input"
      type="text"
      v-model="draft"
      :placeholder="placeholder"
      :disabled="isDisabled"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      @keydown="handleKeydown"
      @blur="handleBlur"
    />
  </div>
</template>
