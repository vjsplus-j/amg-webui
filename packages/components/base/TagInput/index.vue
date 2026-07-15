<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { TagInputProps, TagInputEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TagInputProps>(), {
  modelValue: () => [],
  unique: true,
  size: 'md'
})

const emit = defineEmits<TagInputEmits>()
const { t } = useLocale()
const draft = ref('')

const closeLabel = computed(() => t(LocaleKeys.common.close))

const rootClass = computed(() => [
  'vp-taginput',
  `vp-taginput--${props.size}`,
  {
    'vp-taginput--fluid': props.fluid,
    'vp-taginput--disabled': props.disabled
  },
  props.class
])

const canAdd = computed(() => {
  if (props.disabled) return false
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
}

const removeTag = (value: string) => {
  if (props.disabled) return
  const next = (props.modelValue ?? []).filter((v) => v !== value)
  emit('update:modelValue', next)
  emit('remove', value)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag()
  } else if (event.key === 'Backspace' && !draft.value && props.modelValue?.length) {
    removeTag(props.modelValue[props.modelValue.length - 1])
  }
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
        :disabled="disabled"
        @click="removeTag(tag)"
      >
        ×
      </button>
    </span>
    <input
      class="vp-taginput__input"
      type="text"
      v-model="draft"
      :placeholder="placeholder"
      :disabled="disabled"
      @keydown="handleKeydown"
      @blur="addTag"
    />
  </div>
</template>
