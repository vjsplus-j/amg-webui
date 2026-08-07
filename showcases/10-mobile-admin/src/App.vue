<script setup lang="ts">
import MobileShell from '@showcase/shared/components/MobileShell.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'Mobile Admin'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/tasks', label: 'Tasks' },
  { path: '/profile', label: 'Profile' }
]
</script>

<template>
  <MobileShell :app-title="appTitle" :nav-items="navItems">
    <router-view />
  </MobileShell>
</template>
