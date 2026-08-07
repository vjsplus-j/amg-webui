import type { RouteRecordRaw } from 'vue-router'
import type { LocaleKey } from '@amg-webui/locale'
import {
  CATALOG_CATEGORY_ICONS,
  CATALOG_CATEGORY_ORDER,
  CATALOG_CATEGORY_TITLE_KEYS,
  CATALOG_ENTRIES,
  catalogNamesByCategory,
  type CatalogCategoryId
} from '../component-catalog'

/** Side-nav groups — intro + seven debug zones + overview hub */
export type NavGroupId =
  | 'overview'
  | 'intro'
  | 'base'
  | 'biz'
  | 'theme'
  | 'i18n'
  | 'perf'
  | 'lab'
  | 'dev'

export interface AppRouteMeta {
  title?: string
  /** i18n key — preferred over title when set */
  titleKey?: LocaleKey
  public?: boolean
  requiresAuth?: boolean
  group?: NavGroupId
  icon?: string
  tab?: boolean
  /** Component PascalCase for base-component tabs */
  componentName?: string
}

declare module 'vue-router' {
  interface RouteMeta extends AppRouteMeta {}
}

/**
 * Canonical example route table — edit here only.
 * Play = library-author debug shell (not npm publish).
 * @see docs/APP_WORKFLOW.md
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/auth/LoginPage.vue'),
    meta: { titleKey: 'page.login.title', public: true, tab: false }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/auth/RegisterPage.vue'),
    meta: { titleKey: 'page.register.title', public: true, tab: false }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../pages/auth/ForgotPasswordPage.vue'),
    meta: { titleKey: 'auth.forgotPassword', public: true, tab: false }
  },
  {
    path: '/',
    component: () => import('../layouts/AppShell.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'dashboard' } },

      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../pages/overview/DashboardPage.vue'),
        meta: {
          titleKey: 'page.dashboard.title',
          group: 'overview',
          icon: 'Activity'
        }
      },

      {
        path: 'intro/quick-start',
        name: 'intro-quick-start',
        component: () => import('../pages/intro/QuickStartPage.vue'),
        meta: {
          titleKey: 'page.intro.quickStart.title',
          group: 'intro',
          icon: 'Rocket'
        }
      },
      {
        path: 'intro/installation',
        name: 'intro-installation',
        component: () => import('../pages/intro/InstallationPage.vue'),
        meta: {
          titleKey: 'page.intro.installation.title',
          group: 'intro',
          icon: 'Package'
        }
      },
      {
        path: 'intro/app-config',
        name: 'intro-app-config',
        component: () => import('../pages/intro/AppConfigPage.vue'),
        meta: {
          titleKey: 'page.intro.appConfig.title',
          group: 'intro',
          icon: 'Settings2'
        }
      },
      {
        path: 'intro/design',
        name: 'intro-design',
        component: () => import('../pages/intro/DesignSystemPage.vue'),
        meta: {
          titleKey: 'page.intro.design.title',
          group: 'intro',
          icon: 'Palette'
        }
      },
      {
        path: 'intro/theme',
        name: 'intro-theme',
        component: () => import('../pages/intro/ThemeTokensPage.vue'),
        meta: {
          titleKey: 'page.intro.theme.title',
          group: 'intro',
          icon: 'SunMoon'
        }
      },
      {
        path: 'intro/i18n',
        name: 'intro-i18n',
        component: () => import('../pages/intro/I18nGuidePage.vue'),
        meta: {
          titleKey: 'page.intro.i18n.title',
          group: 'intro',
          icon: 'Globe'
        }
      },
      {
        path: 'intro/icon',
        name: 'intro-icon',
        component: () => import('../pages/intro/IconGuidePage.vue'),
        meta: {
          titleKey: 'page.intro.icon.title',
          group: 'intro',
          icon: 'Shapes'
        }
      },
      {
        path: 'intro/typography',
        name: 'intro-typography',
        component: () => import('../pages/intro/TypographyPage.vue'),
        meta: {
          titleKey: 'page.intro.typography.title',
          group: 'intro',
          icon: 'Type'
        }
      },
      { path: 'intro/font', redirect: { name: 'intro-typography' } },

      {
        path: 'base/overview',
        name: 'base-overview',
        component: () => import('../pages/base/CatalogPage.vue'),
        meta: {
          titleKey: 'page.base.catalog.title',
          group: 'base',
          icon: 'LayoutGrid'
        }
      },

      /* Legacy zone routes — must sit before base/:name */
      { path: 'base/atoms', redirect: { name: 'base-overview' } },
      { path: 'base/forms', redirect: { name: 'base-overview' } },
      { path: 'base/data', redirect: { name: 'base-overview' } },
      { path: 'base/feedback', redirect: { name: 'base-overview' } },
      {
        path: 'base/layout',
        name: 'base-layout',
        component: () => import('../pages/base/LayoutNavPage.vue'),
        meta: {
          titleKey: 'page.base.layout.title',
          group: 'base',
          icon: 'Layout'
        }
      },
      { path: 'base/third-party', redirect: { name: 'base-overview' } },
      { path: 'base/catalog', redirect: { name: 'base-overview' } },
      { path: 'base/industry', redirect: { name: 'base-overview' } },

      {
        path: 'base/:name',
        name: 'base-component',
        component: () => import('../pages/base/ComponentDocPage.vue'),
        meta: {
          titleKey: 'page.base.component.title',
          group: 'base',
          icon: 'Box',
          tab: true
        }
      },

      {
        path: 'biz/login',
        name: 'biz-login',
        component: () => import('../pages/biz/LoginBizPage.vue'),
        meta: {
          titleKey: 'page.biz.login.title',
          group: 'biz',
          icon: 'User'
        }
      },
      {
        path: 'biz/users',
        name: 'biz-users',
        component: () => import('../pages/biz/UsersBizPage.vue'),
        meta: {
          titleKey: 'page.biz.users.title',
          group: 'biz',
          icon: 'Users'
        }
      },
      {
        path: 'biz/orders',
        name: 'biz-orders',
        component: () => import('../pages/biz/OrdersBizPage.vue'),
        meta: {
          titleKey: 'page.biz.orders.title',
          group: 'biz',
          icon: 'ShoppingCart'
        }
      },
      {
        path: 'biz/content',
        name: 'biz-content',
        component: () => import('../pages/biz/ContentBizPage.vue'),
        meta: {
          titleKey: 'page.biz.content.title',
          group: 'biz',
          icon: 'FileText'
        }
      },
      {
        path: 'biz/settings',
        name: 'biz-settings',
        component: () => import('../pages/biz/SettingsBizPage.vue'),
        meta: {
          titleKey: 'page.biz.settings.title',
          group: 'biz',
          icon: 'Settings'
        }
      },

      {
        path: 'theme',
        name: 'theme',
        component: () => import('../pages/theme/ThemeSwitchPage.vue'),
        meta: {
          titleKey: 'page.theme.title',
          group: 'theme',
          icon: 'Palette'
        }
      },
      {
        path: 'theme/custom',
        name: 'theme-custom',
        component: () => import('../pages/theme/ThemeCustomPage.vue'),
        meta: {
          titleKey: 'page.themeCustom.title',
          group: 'theme',
          icon: 'Sliders'
        }
      },

      {
        path: 'i18n',
        name: 'i18n',
        component: () => import('../pages/i18n/LocalePage.vue'),
        meta: {
          titleKey: 'page.i18n.title',
          group: 'i18n',
          icon: 'Globe'
        }
      },

      {
        path: 'perf/massive',
        name: 'perf-massive',
        component: () => import('../pages/perf/MassiveDataPage.vue'),
        meta: {
          titleKey: 'page.perf.massive.title',
          group: 'perf',
          icon: 'Database'
        }
      },
      {
        path: 'perf/high-frequency',
        name: 'perf-high-frequency',
        component: () => import('../pages/perf/HighFrequencyPage.vue'),
        meta: {
          titleKey: 'page.perf.highFrequency.title',
          group: 'perf',
          icon: 'Zap'
        }
      },
      {
        path: 'perf/lazy',
        name: 'perf-lazy',
        component: () => import('../pages/perf/LazyLoadPage.vue'),
        meta: {
          titleKey: 'page.perf.lazy.title',
          group: 'perf',
          icon: 'Loader'
        }
      },

      {
        path: 'lab/hooks',
        name: 'lab-hooks',
        component: () => import('../pages/lab/HooksPage.vue'),
        meta: {
          titleKey: 'page.lab.hooks.title',
          group: 'lab',
          icon: 'Code'
        }
      },
      {
        path: 'lab/utils',
        name: 'lab-utils',
        component: () => import('../pages/lab/UtilsPage.vue'),
        meta: {
          titleKey: 'page.lab.utils.title',
          group: 'lab',
          icon: 'Wrench'
        }
      },
      {
        path: 'lab/a11y',
        name: 'lab-a11y',
        component: () => import('../pages/lab/A11yPage.vue'),
        meta: {
          titleKey: 'page.lab.a11y.title',
          group: 'lab',
          icon: 'Accessibility'
        }
      },
      {
        path: 'lab/micro-fe',
        name: 'lab-micro-fe',
        component: () => import('../pages/lab/MicroFrontendPage.vue'),
        meta: {
          titleKey: 'page.lab.microFe.title',
          group: 'lab',
          icon: 'Boxes'
        }
      },
      {
        path: 'lab/telemetry',
        name: 'lab-telemetry',
        component: () => import('../pages/lab/TelemetryLabPage.vue'),
        meta: {
          titleKey: 'page.lab.telemetry.title',
          group: 'lab',
          icon: 'Activity'
        }
      },
      {
        path: 'lab/security',
        name: 'lab-security',
        component: () => import('../pages/lab/SecurityLabPage.vue'),
        meta: {
          titleKey: 'page.lab.security.title',
          group: 'lab',
          icon: 'Shield'
        }
      },
      {
        path: 'lab/lowcode',
        name: 'lab-lowcode',
        component: () => import('../pages/lab/LowcodeLabPage.vue'),
        meta: {
          titleKey: 'page.lab.lowcode.title',
          group: 'lab',
          icon: 'LayoutTemplate'
        }
      },
      {
        path: 'lab/lowcode-studio',
        name: 'lab-lowcode-studio',
        component: () => import('../pages/lab/LowcodeStudioPage.vue'),
        meta: {
          titleKey: 'page.lab.lowcodeStudio.title',
          group: 'lab',
          icon: 'PanelsTopLeft'
        }
      },

      {
        path: 'lab/hardening',
        name: 'lab-hardening',
        component: () => import('../pages/lab/HardeningEvidencePage.vue'),
        meta: {
          titleKey: 'page.lab.hardening.title',
          group: 'lab',
          icon: 'ShieldCheck'
        }
      },
      {
        path: 'lab/theme-studio',
        name: 'lab-theme-studio',
        component: () => import('../pages/lab/theme-studio.vue'),
        meta: {
          titleKey: 'page.lab.themeStudio.title',
          group: 'lab',
          icon: 'Palette'
        }
      },
      {
        path: 'lab/visual-theme-matrix',
        name: 'lab-visual-theme-matrix',
        component: () => import('../pages/lab/VisualThemeMatrixPage.vue'),
        meta: {
          titleKey: 'page.lab.visualMatrix.title',
          group: 'lab',
          icon: 'ScanEye'
        }
      },
      {
        path: 'lab/skill',
        name: 'lab-skill',
        component: () => import('../pages/lab/SkillLabPage.vue'),
        meta: {
          titleKey: 'page.lab.skill.title',
          group: 'lab',
          icon: 'Cpu'
        }
      },

      {
        path: 'dev/config',
        name: 'dev-config',
        component: () => import('../pages/dev/GlobalConfigPage.vue'),
        meta: {
          titleKey: 'page.dev.config.title',
          group: 'dev',
          icon: 'Cog'
        }
      },
      {
        path: 'dev/extensibility',
        name: 'dev-extensibility',
        component: () => import('../pages/dev/ExtensibilityPage.vue'),
        meta: {
          titleKey: 'page.dev.extensibility.title',
          group: 'dev',
          icon: 'Puzzle'
        }
      },
      {
        path: 'dev/bug-repro',
        name: 'dev-bug-repro',
        component: () => import('../pages/dev/BugReproPage.vue'),
        meta: {
          titleKey: 'page.dev.bugRepro.title',
          group: 'dev',
          icon: 'Bug'
        }
      },
      {
        path: 'dev/example-boot',
        name: 'dev-example-boot',
        component: () => import('../pages/dev/ExampleBootPage.vue'),
        meta: {
          titleKey: 'page.dev.exampleBoot.title',
          group: 'dev',
          icon: 'Terminal'
        }
      },

      { path: 'demo/components', redirect: { name: 'base-overview' } },
      { path: 'demo/forms', redirect: { name: 'base-overview' } },
      { path: 'demo/users', redirect: { name: 'base-overview' } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: { name: 'dashboard' } }
]

export const NAV_GROUP_TITLE_KEYS: Record<NavGroupId, LocaleKey> = {
  overview: 'nav.overview',
  intro: 'nav.intro',
  base: 'nav.base',
  biz: 'nav.biz',
  theme: 'nav.theme',
  i18n: 'nav.i18n',
  perf: 'nav.perf',
  lab: 'nav.lab',
  dev: 'nav.dev'
}

/** @deprecated use NAV_GROUP_TITLE_KEYS + t() */
export const NAV_GROUP_LABELS: Record<NavGroupId, LocaleKey> = {
  overview: 'nav.overview',
  intro: 'nav.intro',
  base: 'nav.base',
  biz: 'nav.biz',
  theme: 'nav.theme',
  i18n: 'nav.i18n',
  perf: 'nav.perf',
  lab: 'nav.lab',
  dev: 'nav.dev'
}

export interface ShellNavChild {
  /** Stable UI / tab id — e.g. base:Button or route name */
  key: string
  titleKey?: LocaleKey
  label: string
  icon?: string
  routeName: string
  params?: Record<string, string>
}

export interface ShellNavItem {
  key: string
  titleKey?: LocaleKey
  label: string
  icon?: string
  routeName?: string
  params?: Record<string, string>
  /** Collapsible category — children are leaf links */
  children?: ShellNavChild[]
}

export interface ShellNavGroup {
  titleKey: LocaleKey
  /** Fallback label (often the key string itself) */
  title: string
  group: NavGroupId
  items: ShellNavItem[]
}

function buildBaseNavItems(): ShellNavItem[] {
  const items: ShellNavItem[] = [
    {
      key: 'base-overview',
      titleKey: 'page.base.catalog.title',
      label: 'page.base.catalog.title',
      icon: 'LayoutGrid',
      routeName: 'base-overview'
    }
  ]

  for (const category of CATALOG_CATEGORY_ORDER) {
    const names = catalogNamesByCategory(category as CatalogCategoryId)
    items.push({
      key: `base-cat-${category}`,
      titleKey: CATALOG_CATEGORY_TITLE_KEYS[category],
      label: CATALOG_CATEGORY_TITLE_KEYS[category],
      icon: CATALOG_CATEGORY_ICONS[category],
      children: names.map((name, index) => {
        const entry = CATALOG_ENTRIES.find((e) => e.name === name)
        const ordinal = index + 1
        return {
          key: `base:${name}`,
          titleKey: entry?.titleKey,
          /** Sidebar leaf: ordinal + English name, e.g. `1. Button` */
          label: `${ordinal}. ${name}`,
          icon: 'Box',
          routeName: 'base-component',
          params: { name }
        }
      })
    })
  }

  return items
}

export function getShellNavItems(): ShellNavGroup[] {
  const shell = routes.find((r) => r.path === '/')
  const children = (shell?.children ?? []).filter((c) => c.name && c.meta?.group)
  const groups: NavGroupId[] = [
    'overview',
    'intro',
    'base',
    'biz',
    'theme',
    'i18n',
    'perf',
    'lab',
    'dev'
  ]
  return groups.map((group) => {
    if (group === 'base') {
      return {
        titleKey: NAV_GROUP_TITLE_KEYS[group],
        title: String(NAV_GROUP_TITLE_KEYS[group]),
        group,
        items: buildBaseNavItems()
      }
    }
    return {
      titleKey: NAV_GROUP_TITLE_KEYS[group],
      title: String(NAV_GROUP_TITLE_KEYS[group]),
      group,
      items: children
        .filter((c) => c.meta?.group === group)
        .map((c) => ({
          key: String(c.name),
          titleKey: c.meta?.titleKey,
          label: String(c.meta?.titleKey ?? c.name),
          icon: String(c.meta?.icon ?? 'Activity'),
          routeName: String(c.name)
        }))
    }
  })
}

export function resolveRouteTitle(
  meta: { titleKey?: LocaleKey; title?: unknown },
  t: (key: LocaleKey, params?: Record<string, string | number>, fallback?: string) => string,
  componentName?: string
): string {
  // Base component pages / tabs: English leaf name only (Button), not「按钮 Button」.
  if (componentName) {
    const entry = CATALOG_ENTRIES.find((e) => e.name.toLowerCase() === componentName.toLowerCase())
    return entry?.name ?? componentName
  }
  if (meta.titleKey) return t(meta.titleKey, undefined, String(meta.title ?? meta.titleKey))
  return String(meta.title ?? '')
}

/** Tab id for current route — component pages use base:Name */
export function routeTabId(route: {
  name?: unknown
  params?: Record<string, unknown>
}): string {
  if (route.name === 'base-component' && route.params?.name) {
    return `base:${String(route.params.name)}`
  }
  return String(route.name ?? '')
}
