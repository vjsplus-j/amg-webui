<script setup lang="ts">
import { computed } from 'vue'
import { Card, PageHeader } from 'amg-webui'
import { useRouter } from 'vue-router'
import { mockCmsArticles, mockCmsPublishJobs } from '@showcase/shared/mock-api/cms'

const router = useRouter()

const published = computed(() => mockCmsArticles.filter((a) => a.status === 'published').length)
const drafts = computed(() => mockCmsArticles.filter((a) => a.status === 'draft').length)
const queued = computed(() => mockCmsPublishJobs.filter((j) => j.status === 'queued').length)

const links = [
  { path: '/articles', label: 'Articles' },
  { path: '/categories', label: 'Categories' },
  { path: '/tags', label: 'Tags' },
  { path: '/drafts', label: 'Drafts' },
  { path: '/publish', label: 'Publish' },
  { path: '/media', label: 'Media' },
  { path: '/editor', label: 'Editor' }
]
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Content CMS — Overview" />

    <div class="showcase-grid showcase-grid--4">
      <div class="showcase-stat">
        <p class="showcase-stat__label">Published</p>
        <p class="showcase-stat__value">{{ published }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Drafts</p>
        <p class="showcase-stat__value">{{ drafts }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Queued jobs</p>
        <p class="showcase-stat__value">{{ queued }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Total articles</p>
        <p class="showcase-stat__value">{{ mockCmsArticles.length }}</p>
      </div>
    </div>

    <Card title="Navigate">
      <div class="showcase-toolbar">
        <button
          v-for="item in links"
          :key="item.path"
          type="button"
          class="showcase-link"
          @click="router.push(item.path)"
        >
          {{ item.label }} →
        </button>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.showcase-link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--theme-primary, #2563eb);
  cursor: pointer;
  font: inherit;
}
</style>
