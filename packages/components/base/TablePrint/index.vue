<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { TablePrintProps, TablePrintEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TablePrintProps>(), {
  columns: () => [],
  data: () => [],
  disabled: false
})

const emit = defineEmits<TablePrintEmits>()
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
  const win = window.open('', '_blank', 'noopener,noreferrer')
  if (!win) return
  win.document.write(`<!DOCTYPE html><html><head><title>${props.title ?? t('component.table-print.title')}</title></head><body>${regionRef.value.innerHTML}</body></html>`)
  win.document.close()
  win.focus()
  win.print()
  win.close()
  emit('print')
}

defineExpose({ print: printTable })
</script>

<template>
  <div :class="['vp-table-print', props.class]" :style="style" data-component="TablePrint">
    <button type="button" class="vp-table-print__btn" :disabled="disabled" @click="printTable">
      {{ t('common.print') }}
    </button>
    <div ref="regionRef" class="vp-table-print__region">
      <table class="vp-table-print__table">
        <thead>
          <tr>
            <th v-for="col in cols" :key="col.key">{{ col.label ?? col.key }}</th>
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
