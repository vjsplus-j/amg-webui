<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox, CheckboxGroup } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()
const agree = ref(true)
const group = ref<string[]>(['read'])
</script>

<template>
  <div class="amg-demo-stack">
    <Checkbox v-model="agree" :label="t('example.doc.checkbox.sample.agree')" />
    <Checkbox
      v-model="agree"
      indeterminate
      :label="t('example.doc.checkbox.sample.indeterminate')"
    />
    <CheckboxGroup v-model="group">
      <Checkbox value="read" :label="t('example.doc.checkbox.sample.read')" />
      <Checkbox value="write" :label="t('example.doc.checkbox.sample.write')" />
      <Checkbox value="exec" :label="t('example.doc.checkbox.sample.exec')" />
    </CheckboxGroup>
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
