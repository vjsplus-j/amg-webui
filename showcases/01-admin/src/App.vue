<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'Admin Console'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/manage', label: 'Users' },
  { path: '/about', label: 'About' }
]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="false">
    <router-view />
  </AppLayout>
</template>
