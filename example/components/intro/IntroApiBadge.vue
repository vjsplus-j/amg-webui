<template>
  <span class="intro-badge"><slot /></span>
</template>

<style scoped lang="scss">
.intro-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border: 1px solid var(--ds-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  background: var(--surface-1);
  white-space: nowrap;
}
</style>
