/**
 * Shared sidebar + catalog badge classification for base components.
 * Gold membership: `isV01GoldPassed` (v0.1 subset minus DoD gaps).
 * EP / Hot: `hasEpParity` / exclusive (see `ep-parity.ts`).
 */
import { LocaleKeys, type LocaleKey } from '@amg-webui/locale'
import { isV01GoldPassed } from './v0.1-subset'
import { hasEpParity } from './ep-parity'

export type ComponentBadgeTone = 'gold' | 'ep' | 'hot'

export interface ComponentBadgeSpec {
  tone: ComponentBadgeTone
  labelKey: LocaleKey
  icon?: string
}

export interface ResolvedComponentBadge {
  tone: ComponentBadgeTone
  label: string
  icon?: string
}

/** Unlocalized badge specs (stable keys for i18n). */
export function componentBadgeSpecs(name: string | undefined | null): ComponentBadgeSpec[] {
  if (!name) return []
  const out: ComponentBadgeSpec[] = []
  if (isV01GoldPassed(name)) {
    out.push({ tone: 'gold', labelKey: LocaleKeys.nav.badge.goldDod })
  }
  if (hasEpParity(name)) {
    out.push({ tone: 'ep', labelKey: LocaleKeys.nav.badge.epParity })
  } else {
    out.push({ tone: 'hot', labelKey: LocaleKeys.nav.badge.hot, icon: 'Flame' })
  }
  return out
}

/** Resolve labels via `t()` — same helper for AppShell and 组件总览. */
export function resolveComponentBadges(
  name: string | undefined | null,
  t: (key: LocaleKey, params?: Record<string, string | number>, fallback?: string) => string
): ResolvedComponentBadge[] {
  return componentBadgeSpecs(name).map((spec) => ({
    tone: spec.tone,
    label: t(spec.labelKey),
    icon: spec.icon
  }))
}
