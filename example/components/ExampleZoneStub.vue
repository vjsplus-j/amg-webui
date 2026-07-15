<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@amg-webui/hooks'

const props = defineProps<{
  title?: string
  titleKey?: string
  subtitle?: string
  subtitleKey?: string
  checklist?: string[]
  checklistKeys?: string[]
}>()

const route = useRoute()
const { t, locale } = useLocale()

const displayTitle = computed(() => {
  void locale.value
  if (props.titleKey) return t(props.titleKey)
  const metaKey = route.meta.titleKey as string | undefined
  if (metaKey) return t(metaKey)
  return props.title ?? ''
})

const displaySubtitle = computed(() => {
  void locale.value
  if (props.subtitleKey) return t(props.subtitleKey)
  return props.subtitle ?? ''
})

const displayChecklist = computed(() => {
  void locale.value
  if (props.checklistKeys?.length) return props.checklistKeys.map((k) => t(k))
  return props.checklist ?? []
})
</script>

<template>
  <div class="page play-zone-stub">
    <header class="ln-page-hero">
      <h1 class="ln-page-hero__title">{{ displayTitle }}</h1>
      <p v-if="displaySubtitle" class="ln-page-hero__desc">{{ displaySubtitle }}</p>
    </header>
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
  margin-top: var(--theme-section-gap);
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
