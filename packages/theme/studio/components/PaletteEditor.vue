<script setup lang="ts">
import { THEME_TOKEN_GROUPS } from '../model'
import TokenEditor from './TokenEditor.vue'

defineProps<{
  tokens: Record<string, string>
}>()

const emit = defineEmits<{
  'update:tokens': [Record<string, string>]
}>()

const fields = THEME_TOKEN_GROUPS.find((g) => g.id === 'palette')!.fields
</script>
<template>
  <section class="vp-palette-editor">
    <TokenEditor
      :fields="fields"
      :tokens="tokens"
      @update:tokens="emit('update:tokens', $event)"
    />
    <div class="vp-palette-editor__swatches">
      <div
        v-for="field in fields.filter((f) => f.kind === 'color')"
        :key="field.key"
        class="vp-palette-editor__swatch"
        :style="{ background: tokens[field.key] || 'var(--ds-surface)' }"
        :title="field.label"
      />
    </div>
  </section>
</template>

<style scoped>
.vp-palette-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-palette-editor__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.vp-palette-editor__swatch {
  width: var(--width-md);
  height: var(--height-sm);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--ds-border);
}
</style>
