<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppContextMenu from './components/AppContextMenu.vue'
</script>

<template>
  <div class="app">
    <RouterView />
    <AppContextMenu />
  </div>
</template>

<style scoped>
.app {
  height: 100%;
  min-height: 100vh;
  background: var(--surface-0);
}
</style>

<style>
/* Example shell inspect flash — tokenized outline */
.vp-app-inspect-outline {
  outline: 2px solid var(--primary-500) !important;
  outline-offset: 2px;
}
</style>
