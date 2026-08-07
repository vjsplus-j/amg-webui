import type { ThemeExportFormat, ThemeStudioDraft } from './types'
import { normalizeTokenMap } from './model'
import {
  draftFromImportPayload,
  parseImportPayload,
  type ThemeImportPayload
} from './validation'

function parseCssTokens(content: string): Record<string, string> {
  const tokens: Record<string, string> = {}
  const decls = content.matchAll(/(--[a-zA-Z0-9-_]+)\s*:\s*([^;}\n]+)/g)
  for (const m of decls) {
    tokens[m[1].trim()] = m[2].trim()
  }
  return normalizeTokenMap(tokens)
}

function parseScssTokens(content: string): Record<string, string> {
  return parseCssTokens(content)
}

function parseThemeTs(content: string): ThemeImportPayload | null {
  const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/)
  const designMatch = content.match(/baseDesign:\s*['"]([^'"]+)['"]/)
  const schemeMatch = content.match(/scheme:\s*['"]([^'"]+)['"]/)
  const tokens = parseCssTokens(content.replace(/\/\*[\s\S]*?\*\//g, ''))

  if (!designMatch || !schemeMatch) return null

  return {
    name: nameMatch?.[1],
    baseDesign: designMatch[1],
    scheme: schemeMatch[1],
    tokens
  }
}

export function detectImportFormat(content: string): ThemeExportFormat {
  const trimmed = content.trim()
  if (trimmed.startsWith('{')) return 'json'
  if (/export\s+(const|default)\s+theme/.test(trimmed)) return 'theme-ts'
  if (trimmed.includes('// AMG Theme Studio') || trimmed.includes('$')) return 'scss'
  return 'css'
}

export function importThemeContent(
  content: string,
  format?: ThemeExportFormat
): ThemeStudioDraft | null {
  const fmt = format ?? detectImportFormat(content)

  try {
    if (fmt === 'json') {
      const payload = parseImportPayload(JSON.parse(content))
      return payload ? draftFromImportPayload(payload) : null
    }

    if (fmt === 'theme-ts') {
      const payload = parseThemeTs(content)
      return payload ? draftFromImportPayload(payload) : null
    }

    const tokens = fmt === 'scss' ? parseScssTokens(content) : parseCssTokens(content)
    if (!Object.keys(tokens).length) return null

    return {
      name: 'imported-theme',
      baseDesign: 'linear',
      scheme: 'dark',
      tokens
    }
  } catch {
    return null
  }
}

export function importThemeFile(text: string, filename: string): ThemeStudioDraft | null {
  const ext = filename.split('.').pop()?.toLowerCase()
  const format: ThemeExportFormat | undefined =
    ext === 'json'
      ? 'json'
      : ext === 'ts'
        ? 'theme-ts'
        : ext === 'scss'
          ? 'scss'
          : ext === 'css'
            ? 'css'
            : undefined
  return importThemeContent(text, format)
}
