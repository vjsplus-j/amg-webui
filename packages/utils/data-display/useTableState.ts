import { computed, ref, type Ref } from 'vue'

export interface TableColumn {
  field: string
  header: string
  sortable?: boolean
  width?: string
  sticky?: boolean
}

export type SortDir = 'asc' | 'desc' | null

export function useTableState(
  rows: Ref<Record<string, unknown>[]>,
  columns: Ref<TableColumn[]>
) {
  const keyword = ref('')
  const sortField = ref<string | null>(null)
  const sortDir = ref<SortDir>(null)
  const hiddenFields = ref<Set<string>>(new Set())

  const visibleColumns = computed(() =>
    columns.value.filter((c) => !hiddenFields.value.has(c.field))
  )

  const filteredRows = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    let list = rows.value
    if (kw) {
      list = list.filter((r) => JSON.stringify(r).toLowerCase().includes(kw))
    }
    if (sortField.value && sortDir.value) {
      const field = sortField.value
      const dir = sortDir.value === 'asc' ? 1 : -1
      list = [...list].sort((a, b) => {
        const av = a[field]
        const bv = b[field]
        if (av == null && bv == null) return 0
        if (av == null) return 1
        if (bv == null) return -1
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
        return String(av).localeCompare(String(bv)) * dir
      })
    }
    return list
  })

  function toggleSort(field: string) {
    if (sortField.value !== field) {
      sortField.value = field
      sortDir.value = 'asc'
      return
    }
    if (sortDir.value === 'asc') sortDir.value = 'desc'
    else if (sortDir.value === 'desc') {
      sortField.value = null
      sortDir.value = null
    } else sortDir.value = 'asc'
  }

  function toggleColumn(field: string) {
    const next = new Set(hiddenFields.value)
    if (next.has(field)) next.delete(field)
    else next.add(field)
    hiddenFields.value = next
  }

  function exportCsv(filename = 'export.csv') {
    const cols = visibleColumns.value
    const header = cols.map((c) => c.header).join(',')
    const body = filteredRows.value
      .map((row) =>
        cols.map((c) => `"${String(row[c.field] ?? '').replace(/"/g, '""')}"`).join(',')
      )
      .join('\n')
    const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function printTable(rootEl: HTMLElement | null) {
    if (!rootEl) return
    const w = window.open('', '_blank', 'noopener,noreferrer')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><title></title>
      <style>body{font-family:system-ui,sans-serif;padding:1rem}
      table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #ccc;padding:6px 10px;text-align:left;font-size:12px}
      th{background:#f5f5f5}</style></head><body>${rootEl.innerHTML}</body></html>`)
    w.document.close()
    w.focus()
    w.print()
    w.close()
  }

  return {
    keyword,
    sortField,
    sortDir,
    hiddenFields,
    visibleColumns,
    filteredRows,
    toggleSort,
    toggleColumn,
    exportCsv,
    printTable
  }
}
