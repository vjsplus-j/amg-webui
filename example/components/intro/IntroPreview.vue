<script setup lang="ts">
import IntroCodeBlock from './IntroCodeBlock.vue'

defineProps<{
  code?: string
  language?: string
  filename?: string
}>()
</script>

<template>
  <div class="intro-preview">
    <div class="intro-preview__canvas">
      <slot />
    </div>
    <IntroCodeBlock
      v-if="code"
      class="intro-preview__code"
      :code="code"
      :language="language || 'vue'"
      :filename="filename"
    />
  </div>
</template>

<style scoped lang="scss">
.intro-preview {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid var(--ds-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  max-width: none;
}

.intro-preview__canvas {
  padding: var(--spacing-xl);
  background: var(--surface-1);
  min-height: 4.5rem;
}

.intro-preview :deep(.intro-code) {
  border: 0;
  border-top: 1px solid var(--ds-border);
  border-radius: 0;
}
</style>
