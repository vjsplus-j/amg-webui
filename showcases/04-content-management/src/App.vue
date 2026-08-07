<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'Content CMS'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Overview' },
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
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="false">
    <router-view />
  </AppLayout>
</template>
