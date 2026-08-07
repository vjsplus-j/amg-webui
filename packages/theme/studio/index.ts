export { default as ThemeStudioShell } from './components/ThemeStudioShell.vue'
export { default as TokenEditor } from './components/TokenEditor.vue'
export { default as PaletteEditor } from './components/PaletteEditor.vue'
export { default as TypographyEditor } from './components/TypographyEditor.vue'
export { default as RadiusEditor } from './components/RadiusEditor.vue'
export { default as ElevationEditor } from './components/ElevationEditor.vue'
export { default as ComponentPreview } from './components/ComponentPreview.vue'
export { default as ThemePreset } from './components/ThemePreset.vue'
export { default as ThemeExport } from './components/ThemeExport.vue'
export { default as ThemeImport } from './components/ThemeImport.vue'
export { default as ThemeValidation } from './components/ThemeValidation.vue'

export { useThemeStudio, type ThemeStudioContext, type UseThemeStudioOptions } from './composables/useThemeStudio'

export type {
  ThemeExportFormat,
  ThemeStudioDraft,
  ThemeValidationIssue,
  ThemeValidationResult,
  ThemeValidationSeverity,
  ThemeTokenField,
  ThemeTokenGroup
} from './types'

export {
  THEME_TOKEN_GROUPS,
  STUDIO_STORAGE_KEY,
  createEmptyDraft,
  seedTokensFromDesign,
  normalizeTokenMap,
  mergeDraftTokens
} from './model'

export {
  validateThemeDraft,
  verifyExportRoundtrip,
  parseImportPayload,
  draftFromImportPayload,
  type ThemeImportPayload
} from './validation'

export {
  exportTheme,
  exportThemeCss,
  exportThemeJson,
  exportThemeScss,
  exportThemeTs,
  downloadThemeExport
} from './export'

export { importThemeContent, importThemeFile, detectImportFormat } from './import'
