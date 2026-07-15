<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { rowsToCsv, parseCsv, downloadTextFile } from '@amg-webui/utils'
import type { ExcelIoProps, ExcelIoEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ExcelIoProps>(), {
  columns: () => [],
  data: () => [],
  filename: 'export.csv',
  disabled: false
})

const emit = defineEmits<ExcelIoEmits>()
const { t } = useLocale()
const fileRef = ref<HTMLInputElement | null>(null)
const preview = ref<Record<string, string>[]>([])

function exportCsv() {
  if (props.disabled) return
  const csv = rowsToCsv(props.data, props.columns.length ? props.columns : undefined)
  downloadTextFile(props.filename, csv)
  emit('export')
}

function openPicker() {
  fileRef.value?.click()
}

function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const text = String(reader.result ?? '')
    preview.value = parseCsv(text)
    emit('import', preview.value)
  }
  reader.readAsText(file)
  ;(e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <div :class="['vp-excel-io', { 'vp-excel-io--disabled': disabled }, props.class]" :style="style" data-component="ExcelIo">
    <div class="vp-excel-io__toolbar">
      <button type="button" class="vp-excel-io__btn" :disabled="disabled" @click="exportCsv">
        {{ t('common.export') }}
      </button>
      <button type="button" class="vp-excel-io__btn vp-excel-io__btn--ghost" :disabled="disabled" @click="openPicker">
        {{ t('component.excel-io.import') }}
      </button>
      <input ref="fileRef" type="file" accept=".csv,text/csv" class="vp-excel-io__file" @change="onFile" />
    </div>
    <table v-if="preview.length" class="vp-excel-io__table">
      <thead>
        <tr>
          <th v-for="key in Object.keys(preview[0])" :key="key">{{ key }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in preview" :key="i">
          <td v-for="key in Object.keys(preview[0])" :key="key">{{ row[key] }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="vp-excel-io__muted">{{ t('component.excel-io.lead') }}</p>
  </div>
</template>
