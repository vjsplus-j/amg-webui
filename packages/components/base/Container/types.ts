export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'fluid' | 'full'

export interface ContainerProps {
  size?: ContainerSize
  fluid?: boolean
  padded?: boolean
  align?: 'start' | 'center' | 'end'
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'section'
  /** Landmark role when used as page shell segment */
  tag?: 'div' | 'main' | 'section' | 'article'
  ariaLabel?: string
  fullBleed?: boolean
  maxWidth?: string
  class?: string
  style?: Record<string, string>
}

export interface ContainerEmits {
  // Presentational shell — no emits
}
