<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'ONVIF Center'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Discovery' },
  { path: '/devices', label: 'Devices' },
  { path: '/profiles', label: 'Profiles' }
]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="false">
    <router-view />
  </AppLayout>
</template>
