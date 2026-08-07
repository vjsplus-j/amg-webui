<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLocale } from 'amg-webui/hooks'
import type { IntroNextLink } from './introNav'

const props = defineProps<{
  links: IntroNextLink[]
}>()

const { t, locale } = useLocale()

const rows = computed(() => {
  void locale.value
  return props.links.map((link) => ({
    title: t(link.titleKey),
    description: link.descriptionKey ? t(link.descriptionKey) : '',
    to: link.to
  }))
})
</script>

<template>
  <div class="intro-next">
    <RouterLink
      v-for="(link, i) in rows"
      :key="i"
      class="intro-next__link"
      :to="link.to"
    >
      <span class="intro-next__title">{{ link.title }}</span>
      <span v-if="link.description" class="intro-next__desc">{{ link.description }}</span>
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.intro-next {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--spacing-sm);
}

.intro-next__link {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.intro-next__link:hover {
  border-color: var(--primary-400, var(--primary));
  background: var(--surface-2, var(--surface-elevated));
}

.intro-next__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold, 600);
  color: var(--text-primary);
}

.intro-next__desc {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}
</style>
