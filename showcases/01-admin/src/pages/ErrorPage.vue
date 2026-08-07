<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button, Result } from 'amg-webui'
import AdminPageChrome from '../components/AdminPageChrome.vue'

const router = useRouter()
</script>

<template>
  <div class="showcase-page">
    <AdminPageChrome
      title="Something went wrong"
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Error' }]"
    />
    <Result
      status="error"
      title="Application error"
      sub-title="A mock server fault was triggered for the Enterprise Admin error state demo."
    >
      <template #extra>
        <Button severity="primary" label="Back to dashboard" @click="router.push('/')" />
        <Button variant="outlined" label="Retry" @click="router.go(0)" />
      </template>
    </Result>
  </div>
</template>
