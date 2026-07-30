import type { BaseProps } from '@amg-webui/types'

export type BlockMargin = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'section'
export type BlockPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'card' | 'page'
export type BlockDisplay = 'block' | 'flex' | 'inline-flex' | 'grid' | 'inline-block'
export type BlockBg = 'transparent' | 'surface-0' | 'surface-1' | 'surface-2' | 'elevated'
export type BlockGap = boolean | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'section'
export type BlockRadius = 'none' | 'sm' | 'md' | 'card'

export interface BlockProps extends BaseProps {
  /** CSS display — default `block` */
  display?: BlockDisplay
  /**
   * Inner padding via spacing / theme tokens.
   * When omitted, `padded` controls card pad vs none.
   */
  padding?: BlockPadding
  /** Legacy boolean pad — true → card pad (default); ignored when `padding` is set */
  padded?: boolean
  bordered?: boolean
  /** Child stack gap — `true` → md; token key or false/none to disable */
  gap?: BlockGap
  /** Outer margin — spacing tokens; default `none` */
  margin?: BlockMargin
  /** Background surface token */
  bg?: BlockBg
  /** Cancel parent page pad; edge-to-edge within content column */
  fullBleed?: boolean
  /** Border radius token */
  radius?: BlockRadius
  /** Soft elevation (shadow-sm) */
  raised?: boolean
}

export type BlockEmits = Record<string, never>
