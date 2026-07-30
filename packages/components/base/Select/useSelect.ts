import { ref, computed, watch, nextTick, useId } from 'vue'
import { useVirtualList } from '@amg-webui/utils/data-display/useVirtualList'
import type { SelectProps, SelectModelValue } from './types'
import type { SelectOption } from '@amg-webui/types'

const DEFAULT_VIRTUAL_THRESHOLD = 60
const PANEL_HEIGHT = 200
const ITEM_HEIGHT = 36

export function useSelect(props: SelectProps) {
  const isOpen = ref(false)
  const filterText = ref('')
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const filterRef = ref<HTMLInputElement | null>(null)
  const listboxId = useId()

  const selectedValues = computed((): (string | number)[] => {
    if (!props.multiple) return []
    const v = props.modelValue
    if (Array.isArray(v)) return v as (string | number)[]
    if (v != null && v !== '') return [v as string | number]
    return []
  })

  const hasValue = computed(() => {
    if (props.multiple) return selectedValues.value.length > 0
    return props.modelValue != null && props.modelValue !== ''
  })

  const filteredOptions = computed(() => {
    const opts = props.options || []
    if (props.remote) return opts
    if (!props.filterable || !filterText.value) return opts
    const searchText = filterText.value.toLowerCase()
    return opts.filter((option) =>
      option.label.toLowerCase().includes(searchText)
    )
  })

  const useVirtualScroll = computed(() => {
    if (props.virtual === false) return false
    if (props.virtual === true) return true
    const threshold = props.virtualThreshold ?? DEFAULT_VIRTUAL_THRESHOLD
    return filteredOptions.value.length > threshold
  })

  const virtualSource = computed(() => filteredOptions.value)
  const virtual = useVirtualList(virtualSource, {
    itemHeight: ITEM_HEIGHT,
    containerHeight: PANEL_HEIGHT
  })

  const selectedTags = computed(() =>
    selectedValues.value.map((value) => {
      const opt = props.options?.find((o) => o.value === value)
      return { value, label: opt?.label ?? String(value) }
    })
  )

  const maxTags = computed(() => props.maxCollapseTags ?? 1)

  const visibleTags = computed(() => {
    if (!props.multiple) return []
    if (!props.collapseTags) return selectedTags.value
    return selectedTags.value.slice(0, maxTags.value)
  })

  const collapsedCount = computed(() => {
    if (!props.multiple || !props.collapseTags) return 0
    return Math.max(0, selectedTags.value.length - maxTags.value)
  })

  const displayLabel = computed(() => {
    if (props.multiple) return ''
    if (props.modelValue == null || props.modelValue === '') {
      return props.placeholder || ''
    }
    const option = props.options?.find((o) => o.value === props.modelValue)
    return option?.label || String(props.modelValue)
  })

  const isPlaceholder = computed(() => {
    if (props.multiple) return !hasValue.value && !!props.placeholder
    return !hasValue.value && !!props.placeholder
  })

  const showFilter = computed(
    () => props.filterable || props.remote
  )

  const triggerClass = computed(() => {
    const classes = ['vp-select__trigger']

    const sizeClass: Record<string, string> = {
      xs: 'vp-select__trigger--xs',
      sm: 'vp-select__trigger--sm',
      md: 'vp-select__trigger--md',
      lg: 'vp-select__trigger--lg',
      xl: 'vp-select__trigger--xl'
    }
    classes.push(sizeClass[props.size || 'md'])

    if (props.invalid) classes.push('vp-select__trigger--invalid')
    if (props.readonly) classes.push('vp-select__trigger--readonly')
    if (props.multiple) classes.push('vp-select__trigger--multiple')

    return classes.join(' ')
  })

  const selectClass = computed(() => {
    const classes = ['vp-select']

    if (props.fluid) classes.push('vp-select--fluid')
    if (isOpen.value) classes.push('vp-select--open')
    if (props.class) classes.push(props.class)

    return classes.join(' ')
  })

  const selectStyle = computed(() => {
    const style: Record<string, string> = {}
    if (props.width) style.width = props.width
    return style
  })

  const isOptionSelected = (option: SelectOption): boolean => {
    if (props.multiple) {
      return selectedValues.value.includes(option.value as string | number)
    }
    return option.value === props.modelValue
  }

  const resolveSelectValue = (option: SelectOption): SelectModelValue => {
    if (props.multiple) {
      const val = option.value as string | number
      const current = selectedValues.value
      if (current.includes(val)) {
        return current.filter((v) => v !== val)
      }
      return [...current, val]
    }
    return option.value as SelectModelValue
  }

  const resolveClearValue = (): SelectModelValue =>
    props.multiple ? [] : undefined

  const resolveRemoveTagValue = (value: string | number): SelectModelValue =>
    selectedValues.value.filter((v) => v !== value)

  const toggle = () => {
    if (props.disabled || props.readonly) return
    isOpen.value = !isOpen.value
  }

  const open = () => {
    if (props.disabled || props.readonly) return
    isOpen.value = true
    nextTick(() => {
      if (showFilter.value && filterRef.value) {
        filterRef.value.focus()
      }
    })
  }

  const close = () => {
    isOpen.value = false
    filterText.value = ''
  }

  const shouldCloseAfterSelect = () => !props.multiple

  watch(filterText, (query) => {
    if (props.remote && props.remoteMethod) {
      props.remoteMethod(query)
    }
  })

  watch(isOpen, (openNow) => {
    if (openNow && props.remote && props.remoteMethod) {
      props.remoteMethod(filterText.value)
    }
  })

  return {
    isOpen,
    filterText,
    triggerRef,
    panelRef,
    filterRef,
    listboxId,
    filteredOptions,
    displayLabel,
    isPlaceholder,
    hasValue,
    selectedTags,
    visibleTags,
    collapsedCount,
    triggerClass,
    selectClass,
    selectStyle,
    useVirtualScroll,
    virtual,
    showFilter,
    toggle,
    open,
    close,
    shouldCloseAfterSelect,
    isOptionSelected,
    resolveSelectValue,
    resolveClearValue,
    resolveRemoveTagValue
  }
}
