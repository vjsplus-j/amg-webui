<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'Device Management'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Overview' },
  { path: '/devices', label: 'Devices' },
  { path: '/online', label: 'Online' },
  { path: '/groups', label: 'Groups' },
  { path: '/telemetry', label: 'Telemetry' },
  { path: '/alarms', label: 'Alarms' },
  { path: '/operations', label: 'Operations' }
]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="false">
    <router-view />
  </AppLayout>
</template>
