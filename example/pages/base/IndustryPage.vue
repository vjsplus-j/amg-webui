<script setup lang="ts">
import {
  VideoPlayer,
  SplitVideoWall,
  PTZControl,
  Simple404,
  Tech404,
  VcrTimelinePlayer,
  GbsStatusCard,
  OnvifSearch,
  Barcode,
  Qrcode
} from '@amg-webui/components/industry'
import ComponentGallery from '../../components/ComponentGallery.vue'
</script>

<template>
  <ComponentGallery
    zone="industry"
    title-key="page.base.industry.title"
    lead-key="page.base.industry.lead"
  >
    <template #featured>
      <div class="featured-grid">
        <Simple404 />
        <Tech404 />
        <VideoPlayer />
        <SplitVideoWall />
        <PTZControl />
        <OnvifSearch />
        <GbsStatusCard />
        <VcrTimelinePlayer />
        <Barcode model-value="6901234567892" format="ean13" :editable="false" />
        <Qrcode model-value="AMG-WebUI" standard="iso" />
      </div>
    </template>
  </ComponentGallery>
</template>

<style scoped>
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: var(--theme-section-gap);
  width: 100%;
}
</style>
