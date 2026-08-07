<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { LocaleKey } from '@amg-webui/locale'

const props = defineProps<{
  id: string
  titleKey: LocaleKey
  leadKey?: LocaleKey
}>()

const { t, locale } = useLocale()

const title = computed(() => {
  void locale.value
  return t(props.titleKey)
})

const lead = computed(() => {
  void locale.value
  return props.leadKey ? t(props.leadKey) : ''
})
</script>

<template>
  <section :id="id" class="intro-section">
    <header class="intro-section__head">
      <h2 class="intro-section__title">{{ title }}</h2>
      <p v-if="lead" class="intro-section__lead">{{ lead }}</p>
    </header>
    <div class="intro-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.intro-section {
  scroll-margin-top: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  max-width: 52rem;
}

.intro-section--wide {
  max-width: none;
}

.intro-section__head {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.intro-section__title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.intro-section__lead {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  color: var(--text-secondary);
  max-width: 40rem;
}

.intro-section__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.intro-section__body :deep(p) {
  margin: 0;
}

.intro-section__body :deep(ul),
.intro-section__body :deep(ol) {
  margin: 0;
  padding-inline-start: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
