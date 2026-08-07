<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from 'amg-webui/hooks'
import type { LocaleKey } from 'amg-webui/locale'

const props = defineProps<{
  tone?: 'info' | 'warning' | 'success'
  titleKey?: LocaleKey
}>()

const { t, locale } = useLocale()

const title = computed(() => {
  void locale.value
  return props.titleKey ? t(props.titleKey) : ''
})
</script>

<template>
  <aside class="intro-callout" :data-tone="tone || 'info'">
    <strong v-if="title" class="intro-callout__title">{{ title }}</strong>
    <div class="intro-callout__body">
      <slot />
    </div>
  </aside>
</template>

<style scoped lang="scss">
.intro-callout {
  padding: var(--spacing-md);
  border-inline-start: 3px solid var(--primary-500, var(--primary));
  background: color-mix(in srgb, var(--primary-500, var(--primary)) 8%, var(--surface-1));
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
}

.intro-callout[data-tone='warning'] {
  border-inline-start-color: var(--warning-500, var(--warning, #c47f00));
  background: color-mix(in srgb, var(--warning-500, #c47f00) 10%, var(--surface-1));
}

.intro-callout[data-tone='success'] {
  border-inline-start-color: var(--success-500, var(--success, #1f8a4c));
  background: color-mix(in srgb, var(--success-500, #1f8a4c) 10%, var(--surface-1));
}

.intro-callout__title {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.intro-callout__body {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.intro-callout__body :deep(p) {
  margin: 0;
}
</style>
