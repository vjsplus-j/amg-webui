<script setup lang="ts">
import { Card, PageHeader } from 'amg-webui'
import { useRouter } from 'vue-router'
import { mockSaasOverview } from '@showcase/shared/mock-api/saas'

const router = useRouter()

const links = [
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
  <div class="showcase-page">
    <PageHeader title="SaaS Console — Overview" />

    <div class="showcase-grid showcase-grid--4">
      <div class="showcase-stat">
        <p class="showcase-stat__label">Active tenants</p>
        <p class="showcase-stat__value">{{ mockSaasOverview.activeTenants }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Trial tenants</p>
        <p class="showcase-stat__value">{{ mockSaasOverview.trialTenants }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">MRR (USD)</p>
        <p class="showcase-stat__value">${{ mockSaasOverview.mrr.toLocaleString() }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Past due</p>
        <p class="showcase-stat__value">{{ mockSaasOverview.pastDue }}</p>
      </div>
    </div>

    <Card title="Navigate">
      <div class="showcase-toolbar">
        <button
          v-for="item in links"
          :key="item.path"
          type="button"
          class="showcase-link"
          @click="router.push(item.path)"
        >
          {{ item.label }} →
        </button>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.showcase-link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--theme-primary, #2563eb);
  cursor: pointer;
  font: inherit;
}
</style>
