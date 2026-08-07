<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import { StudioShell } from '@amg-webui/lowcode'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()
</script>

<template>
  <div class="vp-lowcode-studio-page">
    <ExamplePageHero
      :title="t('page.lab.lowcodeStudio.title')"
      :lead="t('page.lab.lowcodeStudio.lead')"
    />
    <StudioShell storage-key="studio-0.1" />
  </div>
</template>

<style scoped>
.vp-lowcode-studio-page {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}
</style>
