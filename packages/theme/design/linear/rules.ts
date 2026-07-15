/**
 * Linear design system — module boundaries & reuse rules
 *
 * Five pillars (must stay aligned with Linear):
 * 1. Visual style     — tokens in styles/design/linear.scss
 * 2. UI components    — Vue components consume semantic --ds-* / --primary-* only
 * 3. Module boundaries— chrome vs view-chrome vs content (below)
 * 4. Reuse rules      — COMPOSITION_RULES
 * 5. Style system     — primitive → semantic → component layers
 *
 * @see https://linear.app/now/how-we-redesigned-the-linear-ui
 * @see https://linear.app/docs
 */

/** Inverted-L chrome pieces — live in AppShell only */
export const CHROME_MODULES = [
  'ln-shell',
  'ln-sidebar',
  'ln-header',
  'ln-tabs',
  'ln-footer'
] as const

/** Per-view headers / filters — sit above content, not in global chrome */
export const VIEW_CHROME_MODULES = [
  'ln-page-hero',
  'view-toolbar',
  'view-filters'
] as const

/** Domain UI — lists, cards, forms, dialogs, players */
export const CONTENT_MODULES = [
  'ln-content',
  'ln-page-grid',
  'ln-page-card',
  'Button',
  'InputText',
  'Textarea',
  'Select',
  'Dialog',
  'ConfirmDialog',
  'DataTable',
  'MenuBar',
  'ContextMenu',
  'Card',
  'Message',
  'Icon'
] as const

export const STYLE_LAYERS = {
  primitive: 'Raw color / radius / type scale (--linear-*, --ln-base/accent/contrast)',
  semantic: 'Purpose aliases (--ds-bg, --ds-accent, --text-primary, --surface-*)',
  component: 'Component SCSS (--p-button uses semantic; never hardcode Linear hex)'
} as const

export const COMPOSITION_RULES = [
  'Chrome defines navigation density; pages never invent a second sidebar.',
  'Tabs belong to chrome; open routes as tabs, do not duplicate page titles as chips in content.',
  'Pages start with ln-page-hero (eyebrow → title → lead → actions) then grids/tables.',
  'Components must only read semantic tokens (--ds-*, --surface-*, --primary-*, --text-*).',
  'Prefer ghost/outline controls in chrome; solid primary only for primary CTA in content.',
  'Radius stays 6–8px; no full-pill chrome buttons; motion ≤ 150ms; no glow (--ds-glow: transparent).',
  'Typography: Inter Variable for Latin; headings weight 510 + negative tracking. Icons: Lucide (Iconify lucide set), stroke ~1.75.',
  'Reduce accent chrome: accent for active nav, CTA, focus — not for large filled panels.',
  'List/table views: scroll inside viewport; shell height stays 100vh.',
  'Locked themes: mercedes | linear | porsche | lamborghini | ferrari | apple (designmd). Default chrome remains Linear.'
] as const

export const LINEAR_REFS = {
  redesign: 'https://linear.app/now/how-we-redesigned-the-linear-ui',
  docs: 'https://linear.app/docs',
  developers: 'https://linear.app/developers',
  tokens: 'https://designmd.santiagoalonso.com/linear.app',
  icons: 'https://icon-sets.iconify.design/lucide/'
} as const

export const DESIGNMD_THEMES = {
  mercedes: 'https://designmd.santiagoalonso.com/mercedes-benz',
  linear: 'https://designmd.santiagoalonso.com/linear.app',
  porsche: 'https://designmd.santiagoalonso.com/porsche',
  lamborghini: 'https://designmd.santiagoalonso.com/lamborghini',
  ferrari: 'https://designmd.santiagoalonso.com/ferrari',
  apple: 'https://designmd.santiagoalonso.com/apple'
} as const
