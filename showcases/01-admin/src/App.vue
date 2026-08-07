<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'Admin Console'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Dashboard' },
  { path: '/users', label: 'Users' },
  { path: '/settings', label: 'Settings' }
]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="false">
    <router-view />
  </AppLayout>
</template>
