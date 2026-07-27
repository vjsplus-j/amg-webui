<script setup lang="ts">
import ExamplePageHero from '../ExamplePageHero.vue'

defineProps<{
  titleKey: string
  leadKey: string
  eyebrowKey?: string
}>()
</script>

<template>
  <div class="intro-shell">
    <ExamplePageHero :title-key="titleKey" :lead-key="leadKey" :eyebrow-key="eyebrowKey">
      <template v-if="$slots.actions" #actions>
        <slot name="actions" />
      </template>
    </ExamplePageHero>

    <div class="intro-shell__body">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.intro-shell {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.intro-shell__body {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

/* Hero already has margin-bottom; avoid double section gap on first child */
.intro-shell > :deep(.ln-page-hero) {
  margin-bottom: 0;
}
</style>
