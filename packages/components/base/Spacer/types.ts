import type { BaseProps } from '@amg-webui/types'

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'section'
export type SpacerAxis = 'horizontal' | 'vertical' | 'both'

export interface SpacerProps extends BaseProps {
  /** Grow to fill remaining flex space (default true when size omitted) */
  flex?: boolean
  /** Flex grow factor when `flex` is true */
  grow?: number
  /** Flex shrink factor when `flex` is true */
  shrink?: number
  /** Fixed size via spacing scale key */
  size?: SpacerSize
  axis?: SpacerAxis
  /** Minimum size when flexing */
  minSize?: SpacerSize
}

export type SpacerEmits = Record<string, never>
