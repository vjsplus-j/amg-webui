/** Shared highlight style for all DemoCode panels (example-only, in-house highlighter). */

import type { LocaleKey } from '@amg-webui/locale'

export type DemoCodeStyleId = 'idea' | 'github' | 'vscode' | 'atom' | 'vi' | 'vim'

export interface DemoCodeStyleOption {
  id: DemoCodeStyleId
  /** i18n key under example.doc.* */
  labelKey: LocaleKey
}

export const DEMO_CODE_STYLES: DemoCodeStyleOption[] = [
  { id: 'idea', labelKey: 'example.doc.codeStyle.idea' },
  { id: 'github', labelKey: 'example.doc.codeStyle.github' },
  { id: 'vscode', labelKey: 'example.doc.codeStyle.vscode' },
  { id: 'atom', labelKey: 'example.doc.codeStyle.atom' },
  { id: 'vi', labelKey: 'example.doc.codeStyle.vi' },
  { id: 'vim', labelKey: 'example.doc.codeStyle.vim' }
]

const STORAGE_KEY = 'amg-webui-demo-code-style'
const DEFAULT_STYLE: DemoCodeStyleId = 'vscode'

/** Map previous packs → editor-named themes */
const LEGACY_MAP: Record<string, DemoCodeStyleId> = {
  amg: 'vscode',
  vivid: 'atom',
  soft: 'github',
  mono: 'vi',
  contrast: 'idea',
  'github-dark': 'github',
  'github-light': 'github',
  'one-dark': 'atom',
  dracula: 'idea',
  nord: 'vim',
  monokai: 'vim',
  'tokyo-night': 'vscode',
  catppuccin: 'vscode'
}

const listeners = new Set<(id: DemoCodeStyleId) => void>()

function isStyleId(v: string | null): v is DemoCodeStyleId {
  return DEMO_CODE_STYLES.some((s) => s.id === v)
}

function normalizeStyleId(raw: string | null): DemoCodeStyleId {
  if (isStyleId(raw)) return raw
  if (raw && LEGACY_MAP[raw]) return LEGACY_MAP[raw]!
  return DEFAULT_STYLE
}

function readStored(): DemoCodeStyleId {
  try {
    return normalizeStyleId(localStorage.getItem(STORAGE_KEY))
  } catch {
    return DEFAULT_STYLE
  }
}

let current: DemoCodeStyleId = DEFAULT_STYLE

export function getDemoCodeStyle(): DemoCodeStyleId {
  return current
}

export function initDemoCodeStyle(): DemoCodeStyleId {
  current = readStored()
  return current
}

export function setDemoCodeStyle(id: DemoCodeStyleId): void {
  if (!isStyleId(id)) return
  if (id === current) return
  current = id
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* ignore quota */
  }
  listeners.forEach((fn) => fn(id))
}

export function subscribeDemoCodeStyle(fn: (id: DemoCodeStyleId) => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
