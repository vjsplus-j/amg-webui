<script setup lang="ts">
import { Card } from '@amg-webui/core'
import { Message } from '@amg-webui/overlay'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="showcase-page">
    <h1>Device Management</h1>
    <p class="showcase-page__lead">IoT / edge device registry sample with device mock CRUD.</p>
    <Card title="Quick start">
      <p>
        This is an application sample built on AMG-WebUI workspace packages
        (theme, locale, core components). Data is mocked via
        <code>showcases/_shared/mock-api</code>.
      </p>
      <Message severity="info" :closable="false">
        Open the Devices route to explore list + dialog CRUD with loading,
        empty, and error states.
      </Message>
      <button type="button" class="showcase-link" @click="router.push('/manage')">
        Go to Devices →
      </button>
    </Card>
  </div>
</template>

<style scoped>
.showcase-link {
  margin-top: 12px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--theme-primary, #2563eb);
  cursor: pointer;
  font: inherit;
}
</style>
