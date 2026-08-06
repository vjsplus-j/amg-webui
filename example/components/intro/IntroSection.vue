<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import type { LocaleKey } from '@amg-webui/locale'

const props = defineProps<{
  titleKey: LocaleKey
}>()

const { t, locale } = useLocale()

const title = computed(() => {
  void locale.value
  return t(props.titleKey)
})
</script>

<template>
  <Card :title="title">
    <div class="intro-section">
      <slot />
    </div>
  </Card>
</template>

<style scoped lang="scss">
.intro-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.intro-section :deep(p) {
  margin: 0;
}

.intro-section :deep(ol),
.intro-section :deep(ul) {
  margin: 0;
  padding-left: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.intro-section :deep(code),
.intro-section :deep(pre) {
  font-family: var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: var(--font-size-xs);
}

.intro-section :deep(pre) {
  margin: 0;
  padding: var(--spacing-md);
  background: var(--surface-2, var(--surface-elevated, var(--surface-1)));
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius, var(--border-radius-md));
  color: var(--text-primary);
  overflow-x: auto;
  white-space: pre-wrap;
}
</style>
