export type BizSettingsSection = 'general' | 'theme' | 'security' | 'notify'

export interface BizSettingsProps {
  title?: string
  /** Controlled active section */
  section?: BizSettingsSection
}

export interface BizSettingsEmits {
  (e: 'update:section', section: BizSettingsSection): void
  (e: 'save', payload: Record<string, unknown>): void
  (e: 'theme-change', style: string): void
}
