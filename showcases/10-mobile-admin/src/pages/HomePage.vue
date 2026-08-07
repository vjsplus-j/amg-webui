<script setup lang="ts">
import { ref } from 'vue'
import { Button, PageHeader } from '@amg-webui/core'
import { Message } from '@amg-webui/overlay'
import { useRouter } from 'vue-router'

const router = useRouter()
const alerts = ref(3)

const quickCards = [
  { title: 'Pending approvals', value: '12', hint: '3 urgent' },
  { title: 'Field tickets', value: '8', hint: '2 overdue' },
  { title: 'Inventory alerts', value: '5', hint: 'Low stock' }
]
</script>

<template>
  <div class="showcase-page showcase-page--mobile">
    <PageHeader title="Mobile Admin">
      <template #extra>
        <span class="showcase-status showcase-status--pending">{{ alerts }} alerts</span>
      </template>
    </PageHeader>

    <Message severity="info" :closable="false">
      Use the ☰ drawer for navigation. Card list pattern on Tasks route.
    </Message>

    <div class="showcase-mobile-cards">
      <article
        v-for="card in quickCards"
        :key="card.title"
        class="showcase-mobile-card"
      >
        <strong>{{ card.title }}</strong>
        <p class="showcase-mobile-card__meta">{{ card.hint }}</p>
        <p class="showcase-stat__value">{{ card.value }}</p>
      </article>
    </div>

    <Button
      block
      severity="primary"
      label="View task cards"
      @click="router.push('/tasks')"
    />
  </div>
</template>

<style scoped>
.showcase-page--mobile {
  padding-inline: 12px;
}

.showcase-mobile-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
