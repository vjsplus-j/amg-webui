import { computed } from 'vue'

export type Size = 'sm' | 'md' | 'lg' | 'xl'

export interface UseSizeProps {
  size?: Size
}

export const sizeClasses: Record<Size, string> = {
  sm: 'p-size-sm',
  md: 'p-size-md',
  lg: 'p-size-lg',
  xl: 'p-size-xl'
}

export const sizeStyles: Record<Size, { height: string; fontSize: string; padding: string }> = {
  sm: { height: 'var(--height-sm)', fontSize: 'var(--font-size-xs)', padding: '0 var(--spacing-sm)' },
  md: { height: 'var(--height-md)', fontSize: 'var(--font-size-sm)', padding: '0 var(--spacing-md)' },
  lg: { height: 'var(--height-lg)', fontSize: 'var(--font-size-md)', padding: '0 var(--spacing-lg)' },
  xl: { height: 'var(--height-xl)', fontSize: 'var(--font-size-lg)', padding: '0 var(--spacing-xl)' }
}

export function useSize(props: UseSizeProps) {
  const size = computed(() => props.size || 'md')
  const sizeClass = computed(() => sizeClasses[size.value])
  const sizeStyle = computed(() => sizeStyles[size.value])

  return {
    size,
    sizeClass,
    sizeStyle
  }
}
