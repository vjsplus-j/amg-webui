<script setup lang="ts">
import { Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'

const { t } = useLocale()
</script>

<template>
  <div class="amg-demo-row">
    <Button severity="primary">{{ t(LocaleKeys.button.confirm) }}</Button>
    <Button variant="outlined">{{ t(LocaleKeys.button.cancel) }}</Button>
  </div>
</template>

<style scoped>
.amg-demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}
</style>
