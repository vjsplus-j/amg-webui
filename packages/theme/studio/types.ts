import type { ColorScheme, DesignStyleName } from '../core/registry'

export type ThemeExportFormat = 'css' | 'json' | 'theme-ts' | 'scss'

export interface ThemeStudioDraft {
  name: string
  baseDesign: DesignStyleName
  scheme: ColorScheme
  tokens: Record<string, string>
}

export type ThemeValidationSeverity = 'error' | 'warning'

export interface ThemeValidationIssue {
  code: string
  message: string
  token?: string
  severity: ThemeValidationSeverity
}

export interface ThemeValidationResult {
  valid: boolean
  issues: ThemeValidationIssue[]
}

export interface ThemeTokenField {
  key: string
  label: string
  kind: 'color' | 'size' | 'shadow' | 'text' | 'number'
  placeholder?: string
}

export interface ThemeTokenGroup {
  id: string
  labelKey: string
  fields: ThemeTokenField[]
}
