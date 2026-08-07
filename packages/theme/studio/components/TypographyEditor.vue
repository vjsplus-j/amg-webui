<script setup lang="ts">
import { THEME_TOKEN_GROUPS } from '../model'
import TokenEditor from './TokenEditor.vue'

defineProps<{
  tokens: Record<string, string>
}>()

const emit = defineEmits<{
  'update:tokens': [Record<string, string>]
}>()

const fields = THEME_TOKEN_GROUPS.find((g) => g.id === 'typography')!.fields
</script>

<template>
  <section class="vp-typography-editor">
    <TokenEditor
      :fields="fields"
      :tokens="tokens"
      @update:tokens="emit('update:tokens', $event)"
    />
    <div class="vp-typography-editor__preview">
      <p
        class="vp-typography-editor__sample vp-typography-editor__sample--xl"
        :style="{ fontSize: tokens['--font-size-xl'] || 'var(--font-size-xl)' }"
      >
        Display heading
      </p>
      <p
        class="vp-typography-editor__sample"
        :style="{ fontSize: tokens['--font-size-md'] || 'var(--font-size-md)' }"
      >
        Body text sample for readability check.
      </p>
      <p
        class="vp-typography-editor__sample vp-typography-editor__sample--sm"
        :style="{ fontSize: tokens['--font-size-sm'] || 'var(--font-size-sm)' }"
      >
        Caption / secondary text
      </p>
    </div>
  </section>
</template>

<style scoped>
.vp-typography-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-typography-editor__preview {
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--ds-surface);
}

.vp-typography-editor__sample {
  margin: 0 0 var(--spacing-sm);
  color: var(--ds-text);
}

.vp-typography-editor__sample--xl {
  font-weight: var(--font-weight-semibold);
}

.vp-typography-editor__sample--sm {
  color: var(--ds-text-muted);
}
</style>
