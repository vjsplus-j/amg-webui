import type { LocaleCode } from '@amg-webui/locale'
import type { BizAccess, BizRequestOptions } from '../_shared'

export type BizSettingsSection = 'general' | 'theme' | 'locale' | 'security' | 'params' | 'notify'

export interface BizSettingsProfile {
  displayName?: string
  email?: string
}

/** Domain snapshot loaded/saved via adapter — not a backend DTO. */
export interface BizSettingsSnapshot {
  profile: BizSettingsProfile
  params: Record<string, string | number | boolean>
  notifyMail: boolean
  notifyPush: boolean
}

/** Host-owned settings adapter. */
export interface BizSettingsAdapter {
  load(options?: BizRequestOptions): Promise<BizSettingsSnapshot>
  save(snapshot: BizSettingsSnapshot, options?: BizRequestOptions): Promise<BizSettingsSnapshot>
  changePassword?(
    payload: { oldPassword: string; newPassword: string },
    options?: BizRequestOptions
  ): Promise<void>
}

export interface BizSettingsProps {
  title?: string
  section?: BizSettingsSection
  profile?: BizSettingsProfile
  params?: Record<string, string | number | boolean>
  notifyMail?: boolean
  notifyPush?: boolean
  loading?: boolean
  error?: string | null
  access?: BizAccess
  adapter?: BizSettingsAdapter
}

export interface BizSettingsEmits {
  (e: 'update:section', section: BizSettingsSection): void
  (e: 'save', payload: Record<string, unknown>): void
  (e: 'theme-change', style: string): void
  (e: 'locale-change', code: LocaleCode): void
  (e: 'change-password', payload: { oldPassword: string; newPassword: string }): void
  (e: 'update:params', params: Record<string, string | number | boolean>): void
}
