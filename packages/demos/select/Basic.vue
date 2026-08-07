<script setup lang="ts">
import { computed, ref } from 'vue'
import { Select } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()
const value = ref<string | undefined>('a')
const options = computed(() => [
  { label: t('example.doc.select.sample.optA'), value: 'a' },
  { label: t('example.doc.select.sample.optB'), value: 'b' },
  { label: t('example.doc.select.sample.optC'), value: 'c' }
])
</script>

<template>
  <div class="amg-demo-block">
    <Select
      v-model="value"
      :options="options"
      :placeholder="t('example.doc.select.sample.placeholder')"
      fluid
    />
  </div>
</template>

<style scoped>
.amg-demo-block {
  width: 100%;
  min-width: 0;
}
</style>
