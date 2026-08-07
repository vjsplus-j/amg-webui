<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from 'amg-webui/hooks'
import type { LocaleKey } from 'amg-webui/locale'

const props = defineProps<{
  steps: LocaleKey[]
}>()

const { t, locale } = useLocale()

const labels = computed(() => {
  void locale.value
  return props.steps.map((key) => t(key))
})
</script>

<template>
  <ol class="intro-steps">
    <li v-for="(label, i) in labels" :key="i" class="intro-steps__item">
      <span class="intro-steps__index">{{ String(i + 1).padStart(2, '0') }}</span>
      <span class="intro-steps__text">{{ label }}</span>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.intro-steps {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.intro-steps__item {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: var(--spacing-md);
  align-items: start;
}

.intro-steps__index {
  font-family: var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary, var(--text-secondary));
  padding-top: 0.15rem;
}

.intro-steps__text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}
</style>
