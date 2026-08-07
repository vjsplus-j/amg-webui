<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button, Result } from 'amg-webui'
import AdminPageChrome from '../components/AdminPageChrome.vue'

const router = useRouter()
</script>

<template>
  <div class="showcase-page">
    <AdminPageChrome title="Page not found" :crumbs="[{ label: 'Home', to: '/' }, { label: '404' }]" />
    <Result
      status="404"
      title="Page not found"
      sub-title="The route you requested is not part of this admin showcase."
    >
      <template #extra>
        <Button severity="primary" label="Back to dashboard" @click="router.push('/')" />
      </template>
    </Result>
  </div>
</template>
