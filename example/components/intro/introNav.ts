import type { RouteLocationRaw } from 'vue-router'
import type { LocaleKey } from '@amg-webui/locale'

export interface IntroNavItem {
  id: string
  order: string
  titleKey: LocaleKey
  routeName: string
}

/** Formal Intro IA — UI only shows this set. */
export const INTRO_NAV: IntroNavItem[] = [
  {
    id: 'quick-start',
    order: '01',
    titleKey: 'page.intro.quickStart.title',
    routeName: 'intro-quick-start'
  },
  {
    id: 'installation',
    order: '02',
    titleKey: 'page.intro.installation.title',
    routeName: 'intro-installation'
  },
  {
    id: 'app-config',
    order: '03',
    titleKey: 'page.intro.appConfig.title',
    routeName: 'intro-app-config'
  },
  {
    id: 'design',
    order: '04',
    titleKey: 'page.intro.design.title',
    routeName: 'intro-design'
  },
  {
    id: 'theme',
    order: '05',
    titleKey: 'page.intro.theme.title',
    routeName: 'intro-theme'
  },
  {
    id: 'i18n',
    order: '06',
    titleKey: 'page.intro.i18n.title',
    routeName: 'intro-i18n'
  },
  {
    id: 'icon',
    order: '07',
    titleKey: 'page.intro.icon.title',
    routeName: 'intro-icon'
  },
  {
    id: 'typography',
    order: '08',
    titleKey: 'page.intro.typography.title',
    routeName: 'intro-typography'
  }
]

export interface IntroTocItem {
  id: string
  labelKey: LocaleKey
}

export interface IntroNextLink {
  titleKey: LocaleKey
  descriptionKey?: LocaleKey
  to: RouteLocationRaw
}
