<script setup lang="ts">
defineProps<{
  rows: Array<{ token: string; description: string }>
}>()
</script>

<template>
  <div class="intro-token-table-wrap">
    <table class="intro-token-table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.token">
          <td><code>{{ row.token }}</code></td>
          <td>{{ row.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.intro-token-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--ds-border);
  border-radius: var(--border-radius-md);
}

.intro-token-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.intro-token-table th,
.intro-token-table td {
  text-align: start;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--ds-border);
  vertical-align: top;
}

.intro-token-table th {
  background: var(--surface-2, var(--surface-elevated));
  color: var(--text-secondary);
  font-weight: var(--font-weight-semibold, 600);
}

.intro-token-table tr:last-child td {
  border-bottom: 0;
}

.intro-token-table code {
  font-family: var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: var(--font-size-xs);
  color: var(--text-primary);
}
</style>
