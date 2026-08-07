<script setup lang="ts">
import { THEME_TOKEN_GROUPS } from '../model'
import TokenEditor from './TokenEditor.vue'

defineProps<{
  tokens: Record<string, string>
}>()

const emit = defineEmits<{
  'update:tokens': [Record<string, string>]
}>()

const fields = THEME_TOKEN_GROUPS.find((g) => g.id === 'radius')!.fields
</script>

<template>
  <section class="vp-radius-editor">
    <TokenEditor
      :fields="fields"
      :tokens="tokens"
      @update:tokens="emit('update:tokens', $event)"
    />
    <div class="vp-radius-editor__preview">
      <div
        v-for="field in fields.slice(0, 4)"
        :key="field.key"
        class="vp-radius-editor__chip"
        :style="{ borderRadius: tokens[field.key] || 'var(--border-radius-md)' }"
      >
        {{ field.label }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.vp-radius-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-radius-editor__preview {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.vp-radius-editor__chip {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--ds-surface-raised);
  border: 1px solid var(--ds-border);
  font-size: var(--font-size-sm);
  color: var(--ds-text-muted);
}
</style>
