<script setup lang="ts">
import { computed, ref } from 'vue'
import { DataTable } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'

const { t } = useLocale()

const columns = computed(() => [
  { field: 'id', header: 'ID', width: '5rem', sortable: true },
  { field: 'name', header: t('example.doc.datatable.sample.name'), sortable: true },
  { field: 'email', header: t('example.doc.datatable.sample.email') }
])

const rows = ref([
  { id: 1, name: 'User 001', email: 'user1@example.com' },
  { id: 2, name: 'User 002', email: 'user2@example.com' },
  { id: 3, name: 'User 003', email: 'user3@example.com' }
])
</script>

<template>
  <div class="vp-datatable-basic">
    <DataTable :value="rows" :columns="columns" :row-key="'id'" />
    <p class="vp-datatable-basic__hint">{{ t(LocaleKeys.common.rows) }}: {{ rows.length }}</p>
  </div>
</template>

<style scoped>
.vp-datatable-basic {
  width: 100%;
  min-width: 0;
}

.vp-datatable-basic__hint {
  margin: var(--spacing-sm) 0 0;
  color: var(--text-2);
  font-size: var(--font-size-sm);
}
</style>
