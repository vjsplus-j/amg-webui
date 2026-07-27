<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import ExamplePageHero from './ExamplePageHero.vue'

const props = defineProps<{
  title?: string
  titleKey?: string
  subtitle?: string
  subtitleKey?: string
  checklist?: string[]
  checklistKeys?: string[]
}>()

const { t, locale } = useLocale()

const displayChecklist = computed(() => {
  void locale.value
  if (props.checklistKeys?.length) return props.checklistKeys.map((k) => t(k))
  return props.checklist ?? []
})
</script>

<template>
  <div class="page play-zone-stub">
    <ExamplePageHero
      :title="title"
      :title-key="titleKey"
      :lead="subtitle"
      :lead-key="subtitleKey"
    />
    <section class="play-zone-stub__body">
      <p class="play-zone-stub__hint">{{ t('page.stub.checklistHint') }}</p>
      <ul class="play-zone-stub__list">
        <li v-for="(item, i) in displayChecklist" :key="i">{{ item }}</li>
      </ul>
      <slot />
    </section>
  </div>
</template>

<style scoped lang="scss">
.play-zone-stub__body {
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-shadow: var(--shadow-sm);
}

.play-zone-stub__hint {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.play-zone-stub__list {
  margin: 0;
  padding-left: var(--spacing-xl);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
