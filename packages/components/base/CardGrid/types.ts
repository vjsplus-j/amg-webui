export type CardGridMinTrack = 'sm' | 'md' | 'lg'
export type CardGridGap = 'sm' | 'md' | 'lg' | 'xl' | 'section'
export type CardGridFit = 'fill' | 'fit'

export interface CardGridProps {
  /** Fixed column count (1–6). When set, ignores minTrack auto grid. */
  columns?: number
  /** Min track width for auto-fill / auto-fit mode */
  minTrack?: CardGridMinTrack
  /** `fill` keeps empty tracks; `fit` collapses empty tracks */
  fit?: CardGridFit
  gap?: CardGridGap
  /** Stretch cards to equal row height (default true) */
  equalHeight?: boolean
  class?: string
  style?: Record<string, string>
}

export interface CardGridEmits {
  (e: 'layout-change', columns: number | null): void
}
