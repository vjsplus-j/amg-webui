<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import { ThemeStudioShell } from '@amg-webui/theme/studio'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()
</script>

<template>
  <div class="vp-theme-studio-page">
    <ExamplePageHero
      :title="t('page.lab.themeStudio.title')"
      :lead="t('page.lab.themeStudio.lead')"
    />
    <ThemeStudioShell storage-key="example-theme-studio" />
  </div>
</template>

<style scoped>
.vp-theme-studio-page {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}
</style>
