import { ref, computed, watch, onUnmounted } from 'vue'
import type { AutoCompleteProps, AutoCompleteSuggestion } from './types'

export function normalizeSuggestion(item: AutoCompleteSuggestion): { value: string; label: string } {
  if (typeof item === 'string') return { value: item, label: item }
  return { value: item.value, label: item.label ?? item.value }
}

export function useAutoComplete(
  props: AutoCompleteProps,
  onFetch?: (query: string, cb: (items: AutoCompleteSuggestion[]) => void) => void
) {
  const isOpen = ref(false)
  const loading = ref(false)
  const innerSuggestions = ref<AutoCompleteSuggestion[]>([])
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  const suggestions = computed(() => {
    const source = innerSuggestions.value.length
      ? innerSuggestions.value
      : props.suggestions ?? []
    return source.map(normalizeSuggestion)
  })

  const rootClass = computed(() => [
    'vp-autocomplete',
    `vp-autocomplete--${props.size ?? 'md'}`,
    {
      'vp-autocomplete--fluid': props.fluid,
      'vp-autocomplete--disabled': props.disabled,
      'vp-autocomplete--open': isOpen.value
    },
    props.class
  ])

  function fetchSuggestions(query: string) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      const staticFiltered = (props.suggestions ?? []).filter((s) => {
        const label = normalizeSuggestion(s).label.toLowerCase()
        return label.includes(query.toLowerCase())
      })
      if (staticFiltered.length) {
        innerSuggestions.value = staticFiltered
        loading.value = false
        isOpen.value = true
        return
      }
      if (onFetch) {
        loading.value = true
        isOpen.value = true
        onFetch(query, (items) => {
          innerSuggestions.value = items
          loading.value = false
          isOpen.value = true
        })
        return
      }
      innerSuggestions.value = []
      loading.value = false
      isOpen.value = (props.suggestions ?? []).length > 0
    }, props.debounce ?? 300)
  }

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  watch(
    () => props.suggestions,
    (val) => {
      if (val?.length) innerSuggestions.value = val
    }
  )

  return { isOpen, loading, suggestions, rootClass, fetchSuggestions }
}
