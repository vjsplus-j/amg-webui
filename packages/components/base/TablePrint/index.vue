<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { TablePrintProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<TablePrintProps>(), {
  columns: () => [],
  data: () => [],
  disabled: false,
  bordered: true
})

const emit = defineEmits<{
  (e: 'print'): void
  (e: 'before-print'): void
  (e: 'after-print'): void
}>()
const { t } = useLocale()
const regionRef = ref<HTMLElement | null>(null)

const cols = computed(() => {
  if (props.columns.length) return props.columns
  const first = props.data[0]
  if (!first) return []
  return Object.keys(first).map((key) => ({ key, label: key }))
})

function printTable() {
  if (props.disabled || !regionRef.value) return
  emit('before-print')
  const win = window.open('', '_blank', 'noopener,noreferrer')
  if (!win) return
  win.document.write(
    `<!DOCTYPE html><html><head><title>${props.title ?? t('component.table-print.title')}</title></head><body>${regionRef.value.innerHTML}</body></html>`
  )
  win.document.close()
  win.focus()
  win.print()
  win.close()
  emit('print')
  emit('after-print')
}
</script>

<template>
  <div :class="['vp-table-print', props.class]" :style="style" data-component="TablePrint">
    <button
      type="button"
      class="vp-table-print__btn"
      :disabled="disabled"
      :aria-label="t('common.print')"
      @click="printTable"
    >
      {{ t('common.print') }}
    </button>
    <div ref="regionRef" class="vp-table-print__region">
      <table
        class="vp-table-print__table"
        :class="{ 'vp-table-print__table--bordered': bordered }"
        role="table"
        :aria-label="title ?? t('component.table-print.title')"
      >
        <thead>
          <tr>
            <th v-for="col in cols" :key="col.key" scope="col">{{ col.label ?? col.key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in data" :key="i">
            <td v-for="col in cols" :key="col.key">{{ row[col.key] }}</td>
          </tr>
        </tbody>
      </table>
      <slot />
    </div>
  </div>
</template>
