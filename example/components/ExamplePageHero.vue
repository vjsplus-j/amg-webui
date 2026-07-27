<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '@amg-webui/hooks'

const props = defineProps<{
  /** Literal title (e.g. catalog leaf name). Prefer titleKey when i18n. */
  title?: string
  titleKey?: string
  lead?: string
  leadKey?: string
  eyebrow?: string
  eyebrowKey?: string
}>()

const route = useRoute()
const slots = useSlots()
const { t, locale } = useLocale()

const displayTitle = computed(() => {
  void locale.value
  if (props.titleKey) return t(props.titleKey)
  if (props.title != null && props.title !== '') return props.title
  const metaKey = route.meta.titleKey as string | undefined
  if (metaKey) return t(metaKey)
  return ''
})

const displayLead = computed(() => {
  void locale.value
  if (props.leadKey) return t(props.leadKey)
  return props.lead ?? ''
})

const displayEyebrow = computed(() => {
  void locale.value
  if (props.eyebrowKey) return t(props.eyebrowKey)
  return props.eyebrow ?? ''
})

const hasTitleExtra = computed(() => Boolean(slots['title-extra']))
</script>

<template>
  <header class="ln-page-hero">
    <p v-if="displayEyebrow" class="ln-page-eyebrow">{{ displayEyebrow }}</p>
    <div v-if="hasTitleExtra" class="example-page-hero__title-row">
      <h1 class="ln-page-title">{{ displayTitle }}</h1>
      <slot name="title-extra" />
    </div>
    <h1 v-else class="ln-page-title">{{ displayTitle }}</h1>
    <p v-if="displayLead" class="ln-page-lead">{{ displayLead }}</p>
    <div v-if="$slots.actions" class="example-page-hero__actions">
      <slot name="actions" />
    </div>
    <slot />
  </header>
</template>

<style scoped lang="scss">
.example-page-hero__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.example-page-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}
</style>
