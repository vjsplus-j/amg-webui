import { computed, watch, nextTick } from 'vue'
import type { TextareaProps } from './types'

export function useTextarea(props: TextareaProps, textareaRef: { value: HTMLTextAreaElement | null }) {
  const textareaClass = computed(() => {
    const classes = ['p-textarea']
    
    const sizeClass: Record<string, string> = {
      xs: 'p-textarea-xs',
      sm: 'p-textarea-sm',
      md: 'p-textarea-md',
      lg: 'p-textarea-lg',
      xl: 'p-textarea-xl'
    }
    classes.push(sizeClass[props.size || 'md'])

    if (props.invalid) {
      classes.push('p-textarea-invalid')
    }

    if (props.fluid) {
      classes.push('p-textarea-fluid')
    }

    if (props.autoResize) {
      classes.push('p-textarea-auto-resize')
    }

    if (props.class) {
      classes.push(props.class)
    }

    return classes.join(' ')
  })

  const characterCount = computed(() => props.modelValue?.length || 0)

  const resizeTextarea = () => {
    if (props.autoResize && textareaRef.value) {
      const el = textareaRef.value
      nextTick(() => {
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
      })
    }
  }

  watch(() => props.modelValue, resizeTextarea)

  return {
    textareaClass,
    characterCount,
    resizeTextarea
  }
}
