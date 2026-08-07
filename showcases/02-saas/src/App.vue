<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'SaaS Console'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Overview' },
  { path: '/tenants', label: 'Tenants' },
  { path: '/organizations', label: 'Organizations' },
  { path: '/members', label: 'Members' },
  { path: '/subscriptions', label: 'Subscriptions' },
  { path: '/plans', label: 'Plans' },
  { path: '/usage', label: 'Usage' },
  { path: '/billing', label: 'Billing' }
]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="false">
    <router-view />
  </AppLayout>
</template>
