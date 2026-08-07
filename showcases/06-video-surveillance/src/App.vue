<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'Video Surveillance'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Overview' },
  { path: '/devices', label: 'Device tree' },
  { path: '/grid', label: 'Video grid' },
  { path: '/player', label: 'Player' },
  { path: '/stream', label: 'Stream' },
  { path: '/ptz', label: 'PTZ' },
  { path: '/snapshot', label: 'Snapshot' },
  { path: '/recording', label: 'Recording' },
  { path: '/alarms', label: 'Alarms' }
]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="false">
    <router-view />
  </AppLayout>
</template>
