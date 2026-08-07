<script setup lang="ts">
import { ref } from 'vue'
import { InputText } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()
const value = ref('')
</script>

<template>
  <div class="amg-demo-stack">
    <InputText
      v-model="value"
      :placeholder="t('example.doc.inputText.sample.placeholder')"
      fluid
    />
    <InputText
      v-model="value"
      :placeholder="t('example.doc.inputText.sample.placeholder')"
      disabled
    />
  </div>
</template>

<style scoped>
.amg-demo-stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
}
</style>
