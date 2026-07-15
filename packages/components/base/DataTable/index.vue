<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { DataTableProps, DataTableEmits, Column, SortOrder } from './types'
import './style.scss'

const props = withDefaults(defineProps<DataTableProps>(), {
  rows: 10,
  first: 0,
  totalRecords: 0,
  selectionMode: 'single',
  striped: false,
  fixedHeader: false,
  filterGlobal: false
})

const emit = defineEmits<DataTableEmits>()

const localValue = ref<any[]>([])
const selectedKeys = ref<Set<string | number>>(new Set())
const globalFilter = ref('')

watch(() => props.value, (val) => {
  localValue.value = val ? [...val] : []
}, { immediate: true })

watch(() => props.value, (val) => {
  if (!val) return
  selectedKeys.value = new Set(
    val.filter((row: any) => row.selected).map((row: any) => row.id)
  )
}, { immediate: true })

const filteredData = computed(() => {
  if (!localValue.value || !globalFilter.value) {
    return localValue.value
  }
  
  const filter = globalFilter.value.toLowerCase()
  return localValue.value.filter((row) => {
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(filter)
    )
  })
})

const paginatedData = computed(() => {
  if (!filteredData.value) return []
  return filteredData.value.slice(props.first, props.first + props.rows)
})

const pageCount = computed(() => {
  return Math.ceil((props.totalRecords || filteredData.value.length) / props.rows)
})

const currentPage = computed(() => {
  return Math.floor(props.first / props.rows) + 1
})

const handleSort = (column: Column) => {
  if (!column.sortable) return
  
  let newSortOrder: SortOrder = 'asc'
  if (props.sortField === column.field) {
    newSortOrder = props.sortOrder === 'asc' ? 'desc' : 'asc'
  }
  
  emit('update:sortField', column.field)
  emit('update:sortOrder', newSortOrder)
  emit('sort', { field: column.field, order: newSortOrder })
}

const handleRowClick = (row: any, event: MouseEvent) => {
  emit('row-click', { originalEvent: event, data: row })
  
  if (props.selectionMode === 'single') {
    toggleRowSelection(row, event)
  }
}

const toggleRowSelection = (row: any, event: MouseEvent) => {
  const key = row.id
  const checked = !selectedKeys.value.has(key)
  
  if (checked) {
    if (props.selectionMode === 'single') {
      selectedKeys.value.clear()
    }
    selectedKeys.value.add(key)
  } else {
    selectedKeys.value.delete(key)
  }
  
  row.selected = checked
  emit('update:value', [...localValue.value])
  emit('row-select', { originalEvent: event, data: row, checked })
}

const toggleSelectAll = (event: Event) => {
  const checkbox = event.target as HTMLInputElement
  const checked = checkbox.checked
  
  localValue.value.forEach((row) => {
    row.selected = checked
  })
  
  if (checked) {
    selectedKeys.value = new Set(localValue.value.map((row: any) => row.id))
  } else {
    selectedKeys.value.clear()
  }
  
  emit('update:value', [...localValue.value])
}

const isAllSelected = computed(() => {
  return (
    filteredData.value.length > 0 &&
    filteredData.value.every((row: any) => selectedKeys.value.has(row.id))
  )
})

const handlePageChange = (page: number) => {
  const first = (page - 1) * props.rows
  emit('update:first', first)
  emit('page', { first, rows: props.rows, page, pageCount: pageCount.value })
}

const handleRowsChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const rows = Number(target.value)
  emit('update:rows', rows)
  emit('update:first', 0)
  emit('page', { first: 0, rows, page: 1, pageCount: Math.ceil((props.totalRecords || filteredData.value.length) / rows) })
}

const prevPage = () => {
  if (currentPage.value > 1) {
    handlePageChange(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < pageCount.value) {
    handlePageChange(currentPage.value + 1)
  }
}

const firstPage = () => {
  handlePageChange(1)
}

const lastPage = () => {
  handlePageChange(pageCount.value)
}

const renderCell = (column: Column, row: any) => {
  if (column.render) {
    return column.render(row[column.field], row)
  }
  return row[column.field]
}

const getSortIcon = (column: Column) => {
  if (!column.sortable) return null
  
  if (props.sortField === column.field) {
    return props.sortOrder === 'asc' ? 'asc' : 'desc'
  }
  
  return null
}
</script>

<template>
  <div :class="['p-datatable', props.class]" :style="style">
    <div v-if="loading" class="p-datatable-loading">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    </div>
    
    <div v-if="$slots.header || filterGlobal" class="p-datatable-header">
      <div class="p-datatable-header-left">
        <slot name="header" />
      </div>
      <div v-if="filterGlobal" class="p-datatable-header-right">
        <div class="p-datatable-filter">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            v-model="globalFilter"
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
    
    <div class="p-datatable-wrapper">
      <div :class="['p-datatable-body', { 'p-datatable-fixed-header': fixedHeader }]">
        <table class="p-datatable-table">
          <thead>
            <tr>
              <th v-if="selectionMode" class="p-datatable-th-center" width="50">
                <div class="p-datatable-checkbox">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                  />
                </div>
              </th>
              <th
                v-for="column in columns"
                :key="column.field"
                :class="[
                  `p-datatable-th-${column.align || 'left'}`,
                  { 'p-datatable-th-sortable': column.sortable }
                ]"
                :style="{ width: column.width }"
                @click="handleSort(column)"
              >
                {{ column.header }}
                <span v-if="getSortIcon(column)" class="p-datatable-sort-icon" :class="`p-datatable-sort-${getSortIcon(column)}`">
                  <svg v-if="getSortIcon(column) === 'asc'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!paginatedData.length" class="p-datatable-empty-message">
              <td :colspan="columns.length + (selectionMode ? 1 : 0)">
                No data found.
              </td>
            </tr>
            <tr
              v-for="row in paginatedData"
              :key="row.id"
              :class="[
                { 'p-datatable-row-selected': row.selected },
                { 'p-datatable-row-striped': striped && paginatedData.indexOf(row) % 2 === 1 }
              ]"
              @click="handleRowClick(row, $event)"
            >
              <td v-if="selectionMode" class="p-datatable-td-center">
                <div class="p-datatable-checkbox">
                  <input
                    type="checkbox"
                    :checked="row.selected"
                    @click.stop="toggleRowSelection(row, $event)"
                  />
                </div>
              </td>
              <td
                v-for="column in columns"
                :key="column.field"
                :class="`p-datatable-td-${column.align || 'left'}`"
                :style="column.style"
              >
                <slot :name="`body-${column.field}`" :value="row[column.field]" :row="row">
                  {{ renderCell(column, row) }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div v-if="paginator && (totalRecords || filteredData.length)" class="p-datatable-footer">
      <div class="p-datatable-summary">
        Showing {{ first + 1 }} to {{ Math.min(first + rows, totalRecords || filteredData.length) }} of {{ totalRecords || filteredData.length }} entries
      </div>
      <div class="p-datatable-paginator">
        <div class="p-datatable-row-count">
          <span>Rows per page:</span>
          <select :value="rows" @change="handleRowsChange">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
        
        <button
          type="button"
          :disabled="currentPage === 1"
          @click="firstPage"
          class="p-datatable-paginator-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          type="button"
          :disabled="currentPage === 1"
          @click="prevPage"
          class="p-datatable-paginator-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span class="p-datatable-page-info">{{ currentPage }} / {{ pageCount }}</span>
        
        <button
          type="button"
          :disabled="currentPage === pageCount"
          @click="nextPage"
          class="p-datatable-paginator-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <button
          type="button"
          :disabled="currentPage === pageCount"
          @click="lastPage"
          class="p-datatable-paginator-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="$slots.footer" class="p-datatable-footer">
      <slot name="footer" />
    </div>
  </div>
</template>