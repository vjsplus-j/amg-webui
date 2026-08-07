<script setup lang="ts">
import { THEME_TOKEN_GROUPS } from '../model'
import TokenEditor from './TokenEditor.vue'

defineProps<{
  tokens: Record<string, string>
}>()

const emit = defineEmits<{
  'update:tokens': [Record<string, string>]
}>()

const fields = THEME_TOKEN_GROUPS.find((g) => g.id === 'elevation')!.fields
</script>

<template>
  <section class="vp-elevation-editor">
    <TokenEditor
      :fields="fields"
      :tokens="tokens"
      @update:tokens="emit('update:tokens', $event)"
    />
    <div class="vp-elevation-editor__preview">
      <div
        v-for="field in fields"
        :key="field.key"
        class="vp-elevation-editor__card"
        :style="{ boxShadow: tokens[field.key] || 'var(--shadow-md)' }"
      >
        {{ field.label }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.vp-elevation-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-elevation-editor__preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--ds-bg);
  border-radius: var(--theme-card-radius);
}

.vp-elevation-editor__card {
  padding: var(--spacing-md);
  background: var(--ds-surface);
  border-radius: var(--theme-card-radius);
  font-size: var(--font-size-sm);
  color: var(--ds-text-muted);
  text-align: center;
}
</style>
