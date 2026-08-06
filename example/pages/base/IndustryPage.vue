<script setup lang="ts">
import {
  VideoPlayer,
  SplitVideoWall,
  PTZControl,
  OnvifSearch,
  Simple404,
  Tech404,
  VcrTimelinePlayer
} from '@amg-webui/components/base'
import { GbsStatusCard } from '@amg-webui/components/industry'
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
