import { computed } from 'vue'

export interface UseDisabledProps {
  disabled?: boolean
  readonly?: boolean
  loading?: boolean
}

export function useDisabled(props: UseDisabledProps) {
  const isDisabled = computed(() => props.disabled || props.loading)
  const isReadonly = computed(() => props.readonly)
  const isLoading = computed(() => props.loading)
  const canInteract = computed(() => !isDisabled.value && !isReadonly.value)

  return {
    isDisabled,
    isReadonly,
    isLoading,
    canInteract
  }
}
