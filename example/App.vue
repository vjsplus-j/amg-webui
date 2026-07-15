<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  height: 100%;
  min-height: 100vh;
  background: var(--surface-0);
}
</style>
