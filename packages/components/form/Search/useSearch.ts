import { computed } from 'vue'
import type { SearchProps } from './types'

export function useSearch(props: SearchProps) {
  const rootClass = computed(() => [
    'vp-search',
    `vp-search--${props.size ?? 'md'}`,
    {
      'vp-search--fluid': props.fluid,
      'vp-search--disabled': props.disabled
    },
    props.class
  ])

  return { rootClass }
}
