<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'Mobile Admin'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/manage', label: 'Tasks' },
  { path: '/about', label: 'About' }
]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="true">
    <router-view />
  </AppLayout>
</template>
