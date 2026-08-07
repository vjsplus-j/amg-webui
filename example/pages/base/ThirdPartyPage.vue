<script setup lang="ts">
import { ref } from 'vue'
import { Card, Barcode, Qrcode, Clipboard, ImageCrop, Print } from '@amg-webui/core'
import { ExcelIo } from '@amg-webui/data'
import { DragCanvas, DragMaterial, PropPanel, CanvasIo } from '@amg-webui/lowcode'
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
          <DragCanvas class="lowcode__drag">
            <div class="stack">
              <PropPanel />
              <CanvasIo />
            </div>
          </DragCanvas>
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
  grid-template-columns: 12rem 1fr;
  gap: var(--spacing-md);
  min-height: 18rem;
}

.lowcode__drag {
  display: grid;
  grid-template-columns: 1fr 14rem;
  gap: var(--spacing-md);
  min-width: 0;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

@media (max-width: 60rem) {
  .lowcode,
  .lowcode__drag {
    grid-template-columns: 1fr;
  }
}
</style>
