import { designStyles, type DesignStyleName } from '../core/registry'
import { generatePrimaryScale, parseCssColor } from '../core/scale'
import type { ThemeStudioDraft, ThemeTokenGroup } from './types'

export const STUDIO_STORAGE_KEY = 'amg-theme-studio-draft-v1'

/** Editable token axes exposed in Theme Studio — mirrors TOKENS.md / tokens.scss SSOT. */
export const THEME_TOKEN_GROUPS: ThemeTokenGroup[] = [
  {
    id: 'palette',
    labelKey: 'theme.studio.group.palette',
    fields: [
      { key: '--ds-bg', label: 'Background', kind: 'color' },
      { key: '--ds-surface', label: 'Surface', kind: 'color' },
      { key: '--ds-surface-raised', label: 'Surface raised', kind: 'color' },
      { key: '--ds-text', label: 'Text', kind: 'color' },
      { key: '--ds-text-muted', label: 'Text muted', kind: 'color' },
      { key: '--ds-border', label: 'Border', kind: 'color' },
      { key: '--primary-500', label: 'Primary', kind: 'color' },
      { key: '--success-500', label: 'Success', kind: 'color' },
      { key: '--warning-500', label: 'Warning', kind: 'color' },
      { key: '--danger-500', label: 'Danger', kind: 'color' },
      { key: '--info-500', label: 'Info', kind: 'color' }
    ]
  },
  {
    id: 'typography',
    labelKey: 'theme.studio.group.typography',
    fields: [
      { key: '--font-size-xs', label: 'XS', kind: 'size', placeholder: '0.75rem' },
      { key: '--font-size-sm', label: 'SM', kind: 'size', placeholder: '0.875rem' },
      { key: '--font-size-md', label: 'MD', kind: 'size', placeholder: '1rem' },
      { key: '--font-size-lg', label: 'LG', kind: 'size', placeholder: '1.125rem' },
      { key: '--font-size-xl', label: 'XL', kind: 'size', placeholder: '1.25rem' },
      { key: '--font-size-2xl', label: '2XL', kind: 'size', placeholder: '1.5rem' },
      { key: '--font-weight-normal', label: 'Normal', kind: 'number', placeholder: '400' },
      { key: '--font-weight-medium', label: 'Medium', kind: 'number', placeholder: '500' },
      { key: '--font-weight-semibold', label: 'Semibold', kind: 'number', placeholder: '600' },
      { key: '--font-weight-bold', label: 'Bold', kind: 'number', placeholder: '700' },
      { key: '--letter-spacing', label: 'Letter spacing', kind: 'text', placeholder: '0' }
    ]
  },
  {
    id: 'radius',
    labelKey: 'theme.studio.group.radius',
    fields: [
      { key: '--border-radius-sm', label: 'SM', kind: 'size', placeholder: '4px' },
      { key: '--border-radius-md', label: 'MD', kind: 'size', placeholder: '6px' },
      { key: '--border-radius-lg', label: 'LG', kind: 'size', placeholder: '8px' },
      { key: '--border-radius-xl', label: 'XL', kind: 'size', placeholder: '12px' },
      { key: '--theme-btn-radius', label: 'Button', kind: 'size', placeholder: '6px' },
      { key: '--theme-card-radius', label: 'Card', kind: 'size', placeholder: '8px' },
      { key: '--theme-input-radius', label: 'Input', kind: 'size', placeholder: '6px' }
    ]
  },
  {
    id: 'elevation',
    labelKey: 'theme.studio.group.elevation',
    fields: [
      { key: '--shadow-sm', label: 'Shadow SM', kind: 'shadow' },
      { key: '--shadow-md', label: 'Shadow MD', kind: 'shadow' },
      { key: '--shadow-lg', label: 'Shadow LG', kind: 'shadow' },
      { key: '--shadow-xl', label: 'Shadow XL', kind: 'shadow' }
    ]
  }
]

export function createEmptyDraft(
  baseDesign: DesignStyleName = 'linear',
  scheme: 'dark' | 'light' = 'dark'
): ThemeStudioDraft {
  return {
    name: 'custom-theme',
    baseDesign,
    scheme,
    tokens: {}
  }
}

/** Seed token overlay from official design preview primary + semantic defaults. */
export function seedTokensFromDesign(design: DesignStyleName): Record<string, string> {
  const cfg = designStyles.find((s) => s.name === design)
  if (!cfg) return {}

  const primary = cfg.preview.primary
  const scale = generatePrimaryScale(primary)
  const bgRgb = parseCssColor(cfg.preview.background)
  const isDark = bgRgb ? (bgRgb.r * 0.299 + bgRgb.g * 0.587 + bgRgb.b * 0.114) < 140 : true

  return {
    ...scale,
    '--ds-bg': cfg.preview.background,
    '--ds-surface': isDark ? '#0f1011' : '#ffffff',
    '--ds-surface-raised': isDark ? '#141516' : '#f8fafc',
    '--ds-text': isDark ? '#f7f8f8' : '#171717',
    '--ds-text-muted': isDark ? '#8a8f98' : '#64748b',
    '--ds-border': isDark ? '#23252a' : '#e2e8f0',
    '--primary-500': primary
  }
}

export function normalizeTokenMap(tokens: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(tokens)) {
    const k = key.startsWith('--') ? key : `--${key}`
    const v = String(value).trim()
    if (v) out[k] = v
  }
  return out
}

export function mergeDraftTokens(
  draft: ThemeStudioDraft,
  patch: Record<string, string>
): ThemeStudioDraft {
  return {
    ...draft,
    tokens: normalizeTokenMap({ ...draft.tokens, ...patch })
  }
}
