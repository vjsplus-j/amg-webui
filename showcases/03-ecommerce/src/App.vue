<script setup lang="ts">
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import type { ShowcaseNavItem } from '@showcase/shared/types/nav'

const appTitle = 'E-Commerce Ops'

const navItems: ShowcaseNavItem[] = [
  { path: '/', label: 'Overview' },
  { path: '/products', label: 'Products' },
  { path: '/skus', label: 'SKU' },
  { path: '/orders', label: 'Orders' },
  { path: '/customers', label: 'Customers' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/promotions', label: 'Promotions' }
]
</script>

<template>
  <AppLayout :app-title="appTitle" :nav-items="navItems" :mobile="false">
    <router-view />
  </AppLayout>
</template>
