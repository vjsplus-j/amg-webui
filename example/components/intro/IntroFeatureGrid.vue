<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from 'amg-webui/hooks'
import type { LocaleKey } from 'amg-webui/locale'

export interface IntroFeatureItem {
  titleKey: LocaleKey
  descriptionKey: LocaleKey
}

const props = defineProps<{
  items: IntroFeatureItem[]
}>()

const { t, locale } = useLocale()

const rows = computed(() => {
  void locale.value
  return props.items.map((item) => ({
    title: t(item.titleKey),
    description: t(item.descriptionKey)
  }))
})
</script>

<template>
  <div class="intro-features">
    <article v-for="(item, i) in rows" :key="i" class="intro-features__item">
      <h3 class="intro-features__title">{{ item.title }}</h3>
      <p class="intro-features__desc">{{ item.description }}</p>
    </article>
  </div>
</template>

<style scoped lang="scss">
.intro-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--spacing-md);
}

.intro-features__item {
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--ds-border);
}

.intro-features__title {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--text-primary);
}

.intro-features__desc {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
  color: var(--text-secondary);
}
</style>
