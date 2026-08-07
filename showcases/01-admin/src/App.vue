<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@showcase/shared/components/AppLayout.vue'
import MobileShell from '@showcase/shared/components/MobileShell.vue'
import { useAdminNav } from './composables/useAdminNav'

const route = useRoute()
const { navItems } = useAdminNav()

const appTitle = 'Admin Console'
const isMobile = ref(false)
let mediaQuery: MediaQueryList | null = null

const isBlankLayout = computed(() => route.meta.layout === 'blank')

function syncMobile() {
  isMobile.value = mediaQuery?.matches ?? false
}

onMounted(() => {
  if (typeof window === 'undefined') return
  mediaQuery = window.matchMedia('(max-width: 768px)')
  syncMobile()
  mediaQuery.addEventListener('change', syncMobile)
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', syncMobile)
})
</script>

<template>
  <template v-if="!isBlankLayout">
    <MobileShell v-if="isMobile" :app-title="appTitle" :nav-items="navItems">
      <router-view />
    </MobileShell>
    <AppLayout v-else :app-title="appTitle" :nav-items="navItems">
      <router-view />
    </AppLayout>
  </template>
  <router-view v-else />
</template>
