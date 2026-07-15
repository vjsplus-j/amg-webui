import { ref, computed, watch, nextTick } from 'vue'
import type { SelectProps } from './types'
import type { SelectOption } from '@amg-webui/types'

export function useSelect(props: SelectProps) {
  const isOpen = ref(false)
  const filterText = ref('')
  const selectedOption = ref<SelectOption | null>(null)
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const filterRef = ref<HTMLInputElement | null>(null)

  const filteredOptions = computed(() => {
    if (!props.options || !filterText.value) {
      return props.options || []
    }
    
    const searchText = filterText.value.toLowerCase()
    return props.options.filter(option =>
      option.label.toLowerCase().includes(searchText)
    )
  })

  const displayLabel = computed(() => {
    if (!props.modelValue) {
      return props.placeholder || ''
    }
    
    const option = props.options?.find(o => o.value === props.modelValue)
    return option?.label || String(props.modelValue)
  })

  const isPlaceholder = computed(() => {
    return !props.modelValue && props.placeholder
  })

  const triggerClass = computed(() => {
    const classes = ['p-select-trigger']
    
    const sizeClass: Record<string, string> = {
      xs: 'p-select-xs',
      sm: 'p-select-sm',
      md: 'p-select-md',
      lg: 'p-select-lg',
      xl: 'p-select-xl'
    }
    classes.push(sizeClass[props.size || 'md'])

    if (props.invalid) {
      classes.push('p-select-invalid')
    }

    if (props.readonly) {
      classes.push('p-select-readonly')
    }

    return classes.join(' ')
  })

  const selectClass = computed(() => {
    const classes = ['p-select']
    
    if (props.fluid) {
      classes.push('p-select-fluid')
    }

    if (isOpen.value) {
      classes.push('p-select-open')
    }

    if (props.class) {
      classes.push(props.class)
    }

    return classes.join(' ')
  })

  const selectStyle = computed(() => {
    const style: Record<string, string> = {}
    
    if (props.width) {
      style.width = props.width
    }

    return style
  })

  const toggle = () => {
    if (props.disabled || props.readonly) return
    isOpen.value = !isOpen.value
  }

  const open = () => {
    if (props.disabled || props.readonly) return
    isOpen.value = true
    nextTick(() => {
      if (props.filterable && filterRef.value) {
        filterRef.value.focus()
      }
    })
  }

  const close = () => {
    isOpen.value = false
    filterText.value = ''
  }

  const selectOption = (option: SelectOption) => {
    if (option.disabled || props.disabled || props.readonly) return
    
    props.modelValue = option.value
    close()
  }

  const clear = () => {
    if (props.disabled || props.readonly) return
    props.modelValue = undefined
  }

  watch(isOpen, (newVal) => {
    if (newVal) {
      document.addEventListener('click', handleOutsideClick)
      document.addEventListener('keydown', handleKeydown)
    } else {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleKeydown)
    }
  })

  const handleOutsideClick = (event: MouseEvent) => {
    if (triggerRef.value && !triggerRef.value.contains(event.target as Node)) {
      if (panelRef.value && !panelRef.value.contains(event.target as Node)) {
        close()
      }
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (!isOpen.value) return
    
    switch (event.key) {
      case 'Escape':
        close()
        break
      case 'Enter':
        event.preventDefault()
        break
    }
  }

  return {
    isOpen,
    filterText,
    selectedOption,
    triggerRef,
    panelRef,
    filterRef,
    filteredOptions,
    displayLabel,
    isPlaceholder,
    triggerClass,
    selectClass,
    selectStyle,
    toggle,
    open,
    close,
    selectOption,
    clear
  }
}
