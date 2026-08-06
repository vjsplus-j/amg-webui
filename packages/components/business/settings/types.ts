import type { LocaleCode } from '@amg-webui/locale'

export type BizSettingsSection = 'general' | 'theme' | 'locale' | 'security' | 'params' | 'notify'

export interface BizSettingsProfile {
  displayName?: string
  email?: string
}

export interface BizSettingsProps {
  title?: string
  section?: BizSettingsSection
  profile?: BizSettingsProfile
  params?: Record<string, string | number | boolean>
  notifyMail?: boolean
  notifyPush?: boolean
}

export interface BizSettingsEmits {
  (e: 'update:section', section: BizSettingsSection): void
  (e: 'save', payload: Record<string, unknown>): void
  (e: 'theme-change', style: string): void
  (e: 'locale-change', code: LocaleCode): void
  (e: 'change-password', payload: { oldPassword: string; newPassword: string }): void
  (e: 'update:params', params: Record<string, string | number | boolean>): void
}
