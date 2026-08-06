import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { InputTextProps } from './types'

export function useInputText(
  props: InputTextProps,
  state?: {
    invalid?: MaybeRefOrGetter<boolean>
    disabled?: MaybeRefOrGetter<boolean>
  }
) {
  const inputClass = computed(() => {
    const classes = ['p-inputtext']

    const sizeClass: Record<string, string> = {
      xs: 'p-inputtext-xs',
      sm: 'p-inputtext-sm',
      md: 'p-inputtext-md',
      lg: 'p-inputtext-lg',
      xl: 'p-inputtext-xl'
    }
    classes.push(sizeClass[props.size || 'md'])

    if (props.invalid || toValue(state?.invalid)) {
      classes.push('p-inputtext-invalid')
    }

    if (props.disabled || toValue(state?.disabled)) {
      classes.push('p-inputtext-disabled')
    }

    if (props.fluid) {
      classes.push('p-inputtext-fluid')
    }

    if (props.class) {
      classes.push(props.class)
    }

    return classes.join(' ')
  })

  return {
    inputClass
  }
}
