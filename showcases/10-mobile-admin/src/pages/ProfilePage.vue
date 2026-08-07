<script setup lang="ts">
import { PageHeader } from '@amg-webui/core'
</script>

<template>
  <div class="showcase-page showcase-page--mobile">
    <PageHeader title="Profile" />
    <article class="showcase-mobile-card">
      <strong>Ops Manager</strong>
      <p class="showcase-mobile-card__meta">ops@example.com</p>
      <p class="showcase-mobile-card__meta">Role: Administrator</p>
    </article>
  </div>
</template>

<style scoped>
.showcase-page--mobile {
  padding-inline: 12px;
}
</style>
