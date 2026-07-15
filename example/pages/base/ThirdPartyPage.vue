<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  Barcode,
  Qrcode,
  Clipboard,
  ImageCrop,
  Print,
  ExcelIo,
  DragCanvas,
  DragMaterial,
  PropPanel,
  CanvasIo
} from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import ComponentGallery from '../../components/ComponentGallery.vue'

const { t } = useLocale()
const clip = ref('AMG-WebUI')
</script>

<template>
  <ComponentGallery
    zone="third"
    title-key="page.base.thirdParty.title"
    lead-key="page.base.thirdParty.lead"
  >
    <template #featured>
      <div class="featured-grid">
        <Qrcode :model-value="clip" />
        <Barcode :model-value="clip" />
        <Clipboard v-model="clip" />
        <ImageCrop />
        <Print />
        <ExcelIo />
      </div>
      <Card :title="t('page.base.thirdParty.c3')">
        <div class="lowcode">
          <DragMaterial />
          <DragCanvas />
          <div class="stack">
            <PropPanel />
            <CanvasIo />
          </div>
        </div>
      </Card>
    </template>
  </ComponentGallery>
</template>

<style scoped>
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: var(--theme-section-gap);
}

.lowcode {
  display: grid;
  grid-template-columns: 12rem 1fr 14rem;
  gap: var(--spacing-md);
  min-height: 18rem;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

@media (max-width: 60rem) {
  .lowcode {
    grid-template-columns: 1fr;
  }
}
</style>
