<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@amg-webui/form'

const on = ref(true)
</script>

<template>
  <div class="amg-demo-row">
    <Switch v-model="on" />
    <Switch v-model="on" disabled />
  </div>
</template>

<style scoped>
.amg-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}
</style>
