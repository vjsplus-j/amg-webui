import { computed } from 'vue'
import type { InputTextProps } from './types'

export function useInputText(props: InputTextProps) {
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

    if (props.invalid) {
      classes.push('p-inputtext-invalid')
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
