<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { PropRow } from './types'

defineProps<{
  rows: PropRow[]
}>()

const { t } = useLocale()
</script>

<template>
  <div class="vp-props-table-wrap">
    <table class="vp-props-table">
      <thead>
        <tr>
          <th scope="col">{{ t(LocaleKeys.exampleDoc.propName) }}</th>
          <th scope="col">{{ t(LocaleKeys.exampleDoc.propDesc) }}</th>
          <th scope="col">{{ t(LocaleKeys.exampleDoc.propType) }}</th>
          <th scope="col">{{ t(LocaleKeys.exampleDoc.propDefault) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td><code>{{ row.name }}</code></td>
          <td>{{ row.description }}</td>
          <td><code>{{ row.type }}</code></td>
          <td><code>{{ row.defaultValue ?? '—' }}</code></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.vp-props-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
}

.vp-props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
}

.vp-props-table th,
.vp-props-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: start;
  border-bottom: 1px solid var(--ds-border);
  vertical-align: top;
}

.vp-props-table th {
  background: var(--surface-2, var(--surface-1));
  color: var(--text-secondary);
  font-weight: var(--font-weight-heading, 600);
  white-space: nowrap;
}

.vp-props-table td {
  color: var(--text-primary);
}

.vp-props-table tr:last-child td {
  border-bottom: none;
}

.vp-props-table code {
  font-family: var(--font-family-mono, ui-monospace, monospace);
  font-size: var(--font-size-xs);
  color: var(--ds-accent);
}
</style>
