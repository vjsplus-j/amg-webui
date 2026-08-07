/** Material Protocol v2 — extends registry meta for Studio. */

import type { Component } from 'vue'
import type { LowcodeComponentMeta, LowcodePropSchema } from '../types'

export type LowcodeStyleFieldType =
  | 'length'
  | 'token'
  | 'color'
  | 'enum'
  | 'number'
  | 'boolean'

export interface LowcodeStyleField {
  type: LowcodeStyleFieldType
  title?: string
  /** Preferred design tokens (e.g. `--spacing-md`). */
  tokens?: readonly string[]
  enum?: readonly string[]
  default?: unknown
}

export interface LowcodeMaterial extends LowcodeComponentMeta {
  title: string
  icon?: string
  category: string
  defaultStyle?: Record<string, unknown>
  styleSchema?: Record<string, LowcodeStyleField>
  slots?: readonly string[]
  accepts?: readonly string[]
  parentRules?: readonly string[]
  bindings?: Record<string, { pathHint?: string }>
  data?: Record<string, unknown>
  preview?: Component
  thumbnail?: string
  version: string
}

export type LowcodePropEditorType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiSelect'
  | 'color'
  | 'icon'
  | 'date'
  | 'json'
  | 'code'
  | 'array'
  | 'object'
  | 'keyValue'

export interface LowcodePropEditorSchema extends LowcodePropSchema {
  editor?: LowcodePropEditorType
}

export function toMaterialV2(
  meta: LowcodeComponentMeta,
  extra?: Partial<LowcodeMaterial>
): LowcodeMaterial {
  return {
    ...meta,
    title: extra?.title ?? meta.label,
    category: extra?.category ?? meta.group ?? 'general',
    version: extra?.version ?? '1.0.0',
    icon: extra?.icon,
    defaultStyle: extra?.defaultStyle,
    styleSchema: extra?.styleSchema,
    slots: extra?.slots,
    accepts: extra?.accepts ?? (meta.isContainer ? undefined : undefined),
    parentRules: extra?.parentRules,
    bindings: extra?.bindings,
    data: extra?.data,
    preview: extra?.preview,
    thumbnail: extra?.thumbnail
  }
}

/** Shared Token options for Style Inspector. */
export const STYLE_SPACING_TOKENS = [
  'var(--spacing-xs)',
  'var(--spacing-sm)',
  'var(--spacing-md)',
  'var(--spacing-lg)',
  'var(--spacing-xl)',
  'var(--spacing-2xl)'
] as const

export const STYLE_RADIUS_TOKENS = [
  'var(--border-radius-sm)',
  'var(--border-radius-md)',
  'var(--border-radius-lg)',
  'var(--theme-card-radius)',
  'var(--theme-btn-radius)'
] as const

export const STYLE_COLOR_TOKENS = [
  'var(--ds-bg)',
  'var(--surface-1)',
  'var(--surface-2)',
  'var(--text-primary)',
  'var(--text-secondary)',
  'var(--ds-accent)',
  'var(--ds-border)'
] as const

export const DEFAULT_STYLE_SCHEMA: Record<string, LowcodeStyleField> = {
  width: { type: 'length', title: 'Width' },
  height: { type: 'length', title: 'Height' },
  minWidth: { type: 'length', title: 'Min width' },
  minHeight: { type: 'length', title: 'Min height' },
  display: {
    type: 'enum',
    title: 'Display',
    enum: ['block', 'flex', 'grid', 'inline-flex']
  },
  margin: { type: 'token', title: 'Margin', tokens: STYLE_SPACING_TOKENS },
  padding: { type: 'token', title: 'Padding', tokens: STYLE_SPACING_TOKENS },
  fontSize: {
    type: 'token',
    title: 'Font size',
    tokens: [
      'var(--font-size-xs)',
      'var(--font-size-sm)',
      'var(--font-size-md)',
      'var(--font-size-lg)'
    ]
  },
  fontWeight: {
    type: 'enum',
    title: 'Weight',
    enum: ['400', '500', '600', '700']
  },
  textAlign: {
    type: 'enum',
    title: 'Align',
    enum: ['start', 'center', 'end']
  },
  background: { type: 'token', title: 'Background', tokens: STYLE_COLOR_TOKENS },
  borderRadius: { type: 'token', title: 'Radius', tokens: STYLE_RADIUS_TOKENS },
  opacity: { type: 'number', title: 'Opacity', default: 1 }
}
