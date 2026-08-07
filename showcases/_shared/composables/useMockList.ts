import { computed, ref, watch } from 'vue'
import type { FetchPhase } from '../mock-api/types'

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export interface UseMockListOptions<T> {
  getData: () => T[]
  searchKeys?: (keyof T)[]
  filterKey?: keyof T
  latencyMs?: number
  pageSize?: number
}

/** Client-side search, filter, pagination over static mock rows with fault injection. */
export function useMockList<T extends Record<string, unknown> & { id: string }>(
  options: UseMockListOptions<T>
) {
  const phase = ref<FetchPhase>('idle')
  const allRows = ref<T[]>([])
  const errorMessage = ref('')
  const forceEmpty = ref(false)
  const forceError = ref(false)
  const search = ref('')
  const statusFilter = ref('all')
  const page = ref(1)
  const pageSize = ref(options.pageSize ?? 8)

  async function load() {
    phase.value = 'loading'
    errorMessage.value = ''
    await delay(options.latencyMs ?? 420)
    if (forceError.value) {
      allRows.value = []
      errorMessage.value = 'Mock network failure'
      phase.value = 'error'
      return
    }
    const data = forceEmpty.value ? [] : [...options.getData()]
    allRows.value = data
    phase.value = data.length ? 'ready' : 'empty'
  }

  function simulateEmpty() {
    forceEmpty.value = true
    forceError.value = false
    void load()
  }

  function simulateError() {
    forceError.value = true
    forceEmpty.value = false
    void load()
  }

  function resetFaults() {
    forceEmpty.value = false
    forceError.value = false
    void load()
  }

  const filteredRows = computed(() => {
    let rows = allRows.value
    const q = search.value.trim().toLowerCase()
    if (q && options.searchKeys?.length) {
      rows = rows.filter((row) =>
        options.searchKeys!.some((key) =>
          String(row[key] ?? '')
            .toLowerCase()
            .includes(q)
        )
      )
    }
    if (options.filterKey && statusFilter.value !== 'all') {
      rows = rows.filter(
        (row) => String(row[options.filterKey!]) === statusFilter.value
      )
    }
    return rows
  })

  const total = computed(() => filteredRows.value.length)

  const pagedRows = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filteredRows.value.slice(start, start + pageSize.value)
  })

  watch([search, statusFilter], () => {
    page.value = 1
  })

  return {
    phase,
    allRows,
    errorMessage,
    forceEmpty,
    forceError,
    search,
    statusFilter,
    page,
    pageSize,
    filteredRows,
    total,
    pagedRows,
    load,
    simulateEmpty,
    simulateError,
    resetFaults
  }
}
