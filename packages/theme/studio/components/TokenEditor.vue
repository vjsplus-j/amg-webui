<script setup lang="ts">
import { computed } from 'vue'
import { InputText } from '@amg-webui/form'
import type { ThemeTokenField } from '../types'

const props = defineProps<{
  fields: ThemeTokenField[]
  tokens: Record<string, string>
}>()

const emit = defineEmits<{
  'update:tokens': [Record<string, string>]
}>()

const local = computed(() => props.tokens)

function onChange(key: string, value: string) {
  emit('update:tokens', { ...props.tokens, [key]: value })
}
</script>

<template>
  <div class="vp-token-editor">
    <div v-for="field in fields" :key="field.key" class="vp-token-editor__row">
      <label class="vp-token-editor__label" :for="field.key">{{ field.label }}</label>
      <InputText
        :id="field.key"
        :model-value="local[field.key] ?? ''"
        :placeholder="field.placeholder"
        size="sm"
        @update:model-value="onChange(field.key, $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.vp-token-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.vp-token-editor__row {
  display: grid;
  grid-template-columns: minmax(0, 7rem) 1fr;
  gap: var(--spacing-sm);
  align-items: center;
}

.vp-token-editor__label {
  font-size: var(--font-size-sm);
  color: var(--ds-text-muted);
}
</style>
