<script setup lang="ts">
import { computed } from 'vue'
import { Card, PageHeader } from 'amg-webui'
import { useRouter } from 'vue-router'
import { mockEcomOrders, mockEcomProducts } from '@showcase/shared/mock-api/ecommerce'

const router = useRouter()

const onSale = computed(() => mockEcomProducts.filter((p) => p.status === 'on_sale').length)
const pendingOrders = computed(() => mockEcomOrders.filter((o) => o.status === 'pending').length)
const revenue = computed(() => mockEcomOrders.reduce((s, o) => s + o.total, 0))

const links = [
  { path: '/products', label: 'Products' },
  { path: '/skus', label: 'SKU' },
  { path: '/orders', label: 'Orders' },
  { path: '/customers', label: 'Customers' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/promotions', label: 'Promotions' }
]
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="E-Commerce Ops — Overview" />

    <div class="showcase-grid showcase-grid--4">
      <div class="showcase-stat">
        <p class="showcase-stat__label">Products on sale</p>
        <p class="showcase-stat__value">{{ onSale }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Pending orders</p>
        <p class="showcase-stat__value">{{ pendingOrders }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Recent revenue</p>
        <p class="showcase-stat__value">¥{{ revenue.toLocaleString() }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Open orders</p>
        <p class="showcase-stat__value">{{ mockEcomOrders.length }}</p>
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
