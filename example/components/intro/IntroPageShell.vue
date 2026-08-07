<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { LocaleKey } from '@amg-webui/locale'
import IntroToc from './IntroToc.vue'
import type { IntroTocItem } from './introNav'

const props = withDefaults(
  defineProps<{
    titleKey: LocaleKey
    leadKey: LocaleKey
    eyebrowKey?: LocaleKey
    toc?: IntroTocItem[]
  }>(),
  {
    eyebrowKey: 'page.intro.eyebrow',
    toc: () => []
  }
)

const { t, locale } = useLocale()

const title = computed(() => {
  void locale.value
  return t(props.titleKey)
})

const lead = computed(() => {
  void locale.value
  return t(props.leadKey)
})

const eyebrow = computed(() => {
  void locale.value
  return props.eyebrowKey ? t(props.eyebrowKey) : ''
})
</script>

<template>
  <div class="intro-shell">
    <header class="intro-shell__hero">
      <p v-if="eyebrow" class="intro-shell__eyebrow">{{ eyebrow }}</p>
      <h1 class="intro-shell__title">{{ title }}</h1>
      <p class="intro-shell__lead">{{ lead }}</p>
      <div v-if="$slots.badges" class="intro-shell__badges">
        <slot name="badges" />
      </div>
      <div v-if="$slots.actions" class="intro-shell__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="intro-shell__layout" :class="{ 'intro-shell__layout--toc': toc.length }">
      <div class="intro-shell__main">
        <slot />
      </div>
      <aside v-if="toc.length" class="intro-shell__aside">
        <IntroToc :items="toc" />
      </aside>
    </div>
  </div>
</template>

<style scoped lang="scss">
.intro-shell {
  --intro-content-max: 72rem;
  --intro-read-max: 52rem;
  max-width: var(--intro-content-max);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl, 2.5rem);
  padding-block-end: var(--spacing-3xl, 3rem);
}

.intro-shell__hero {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: var(--intro-read-max);
}

.intro-shell__eyebrow {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold, 600);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-tertiary, var(--text-secondary));
}

.intro-shell__title {
  margin: 0;
  font-size: clamp(1.75rem, 2.2vw, 2.25rem);
  font-weight: var(--font-weight-semibold, 600);
  line-height: 1.25;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.intro-shell__lead {
  margin: 0;
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
  color: var(--text-secondary);
  max-width: 42rem;
}

.intro-shell__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.intro-shell__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.intro-shell__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--spacing-2xl, 2.5rem);
  align-items: start;
}

.intro-shell__layout--toc {
  grid-template-columns: minmax(0, 1fr) 12.5rem;
}

.intro-shell__main {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl, 2.5rem);
  min-width: 0;
}

@media (max-width: 1100px) {
  .intro-shell__layout--toc {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
