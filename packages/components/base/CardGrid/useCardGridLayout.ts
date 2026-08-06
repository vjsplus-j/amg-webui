import { computed, watch } from 'vue'
import type { CardGridEmits, CardGridProps } from './types'

const trackMap = {
  sm: 'calc(var(--spacing-2xl) * 6)',
  md: 'calc(var(--spacing-2xl) * 7.5)',
  lg: 'calc(var(--spacing-2xl) * 9)'
} as const

const gapMap = {
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  section: 'var(--theme-section-gap)'
} as const

export function useCardGridLayout(props: CardGridProps, emit: CardGridEmits) {
  const columns = computed(() => {
    if (props.columns == null) return null
    return Math.min(6, Math.max(1, Math.floor(props.columns)))
  })

  watch(columns, (value) => emit('layout-change', value), { immediate: true })

  const gridTemplateColumns = computed(() => {
    if (columns.value != null) return `repeat(${columns.value}, minmax(0, 1fr))`
    const track = trackMap[props.minTrack ?? 'md'] ?? trackMap.md
    const mode = props.fit === 'fit' ? 'auto-fit' : 'auto-fill'
    return `repeat(${mode}, minmax(${track}, 1fr))`
  })

  const rootStyle = computed(() => ({
    ...(props.style ?? {}),
    gap: gapMap[props.gap ?? 'lg'] ?? gapMap.lg,
    gridTemplateColumns: gridTemplateColumns.value
  }))

  return { columns, gridTemplateColumns, rootStyle }
}
