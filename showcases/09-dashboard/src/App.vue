<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'Analytics Dashboard'

const navItems: ShowcaseNavItem[] = [{ path: '/', label: 'Dashboard' }]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="false">
    <router-view />
  </AppLayout>
</template>
