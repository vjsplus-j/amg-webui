<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'

const { t } = useLocale()
const date = ref<string | null>('2026-07-30')
</script>

<template>
  <div class="vp-datepicker-basic">
    <DatePicker
      v-model="date"
      value-format="iso"
      :placeholder="t('example.doc.datePicker.sample.placeholder')"
    />
  </div>
</template>

<style scoped>
.vp-datepicker-basic {
  width: 100%;
  min-width: 0;
}
</style>
