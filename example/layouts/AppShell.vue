<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import { ToastService } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { Icon } from '@amg-webui/components/base'
import AppHeaderActions from '../components/AppHeaderActions.vue'
import {
  getShellNavItems,
  resolveRouteTitle,
  routeTabId,
  type ShellNavChild,
  type ShellNavItem
} from '../router/routes'
import { getCatalogEntry } from '../component-catalog'

const route = useRoute()
const router = useRouter()
const { logout, isAdmin, currentUser } = useAuth()
const { t, locale } = useLocale()

const collapsed = ref(localStorage.getItem('ln-sidebar-collapsed') === '1')
const tabs = ref<{ name: string; titleKey?: string; fallback: string }[]>([])
const navFilter = ref('')

/** Category keys expanded in base nav */
const openCategories = ref<Record<string, boolean>>(
  JSON.parse(localStorage.getItem('ln-nav-open-cats-v2') || '{}')
)

const componentParam = computed(() => String(route.params.name ?? ''))

const navGroups = computed(() => {
  void locale.value
  const kw = navFilter.value.trim().toLowerCase()
  return getShellNavItems().map((group) => {
    const title = t(group.titleKey, undefined, group.title)
    if (group.group !== 'base') {
      return {
        ...group,
        title,
        items: group.items.map((item) => localizeNavItem(item))
      }
    }

    const items = group.items
      .map((item) => {
        const localized = localizeNavItem(item)
        if (!localized.children?.length) return localized
        const children = kw
          ? localized.children.filter((c) => {
              const name = String(c.params?.name ?? c.label).toLowerCase()
              return name.includes(kw) || c.label.toLowerCase().includes(kw)
            })
          : localized.children
        return {
          ...localized,
          label: `${localized.label} (${children.length})`,
          children
        }
      })
      .filter((item) => {
        if (item.key === 'base-overview') return true
        if (!item.children) return true
        return item.children.length > 0
      })

    return { ...group, title, items }
  })
})

function localizeNavItem(item: ShellNavItem) {
  const localizedChildren = item.children?.map((child) => ({
    ...child,
    label: childLabel(child)
  }))
  return {
    ...item,
    label: item.titleKey ? t(item.titleKey, undefined, item.label) : item.label,
    children: localizedChildren
  }
}

/** Base component leaves: ordinal + English name (`1. Button`), not「按钮 Button」. */
function childLabel(child: ShellNavChild): string {
  return child.label
}

const activeTabId = computed(() => routeTabId(route))

const pageTitle = computed(() => {
  void locale.value
  return (
    resolveRouteTitle(route.meta, t, componentParam.value || undefined) ||
    t('page.dashboard.title')
  )
})

const userInitial = computed(() =>
  currentUser.value?.username ? currentUser.value.username.charAt(0).toUpperCase() : '?'
)

const tabViews = computed(() =>
  tabs.value.map((tab) => ({
    name: tab.name,
    title: tab.titleKey ? t(tab.titleKey, undefined, tab.fallback) : tab.fallback
  }))
)

/** Category key for the component currently shown in content / active tab */
function activeCategoryKey(): string | null {
  if (route.name !== 'base-component' || !componentParam.value) return null
  const entry = getCatalogEntry(componentParam.value)
  return entry ? `base-cat-${entry.category}` : null
}

function persistOpenCategories() {
  localStorage.setItem('ln-nav-open-cats-v2', JSON.stringify(openCategories.value))
}

/** When a content page / tab opens, expand the matching sidebar category. */
function ensureMenuOpenForActivePage() {
  const key = activeCategoryKey()
  if (!key) return
  if (openCategories.value[key] === true) return
  openCategories.value = { ...openCategories.value, [key]: true }
  persistOpenCategories()
}

function scrollActiveNavIntoView() {
  if (collapsed.value) return
  const el = document.querySelector('.ln-nav .ln-nav__link--active')
  el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
}

watch(
  () => [route.name, route.params.name, locale.value] as const,
  () => {
    ensureMenuOpenForActivePage()

    if (!route.name || route.meta.tab === false) return
    const id = routeTabId(route)
    if (!id) return

    let titleKey = route.meta.titleKey as string | undefined
    let fallback = String(route.meta.title ?? id)

    if (route.name === 'base-component' && componentParam.value) {
      // English component name only — do not i18n tab to「按钮」
      titleKey = undefined
      fallback = resolveRouteTitle(route.meta, t, componentParam.value)
    }

    if (!tabs.value.some((tab) => tab.name === id)) {
      tabs.value = [...tabs.value, { name: id, titleKey, fallback }]
    }

    void nextTick(() => scrollActiveNavIntoView())
  },
  { immediate: true }
)

watch(locale, () => {
  const title = resolveRouteTitle(route.meta, t, componentParam.value || undefined)
  document.title = title ? `${title} · AMG-WebUI` : 'AMG-WebUI'
})

function toggleSidebar() {
  collapsed.value = !collapsed.value
  localStorage.setItem('ln-sidebar-collapsed', collapsed.value ? '1' : '0')
}

function isCategoryOpen(key: string) {
  if (navFilter.value.trim()) {
    return true
  }
  if (openCategories.value[key] != null) return openCategories.value[key]
  // Fallback before any persist: open category that owns the active page
  if (activeCategoryKey() === key) return true
  // Default: expand all base catalogs so every component is visible in the shell
  return key.startsWith('base-cat-')
}

function toggleCategory(key: string) {
  openCategories.value = {
    ...openCategories.value,
    [key]: !isCategoryOpen(key)
  }
  persistOpenCategories()
}

function openNavItem(item: { routeName?: string; params?: Record<string, string>; key: string }) {
  if (!item.routeName) return
  if (item.params) {
    router.push({ name: item.routeName, params: item.params })
    return
  }
  router.push({ name: item.routeName })
}

function openTab(name: string) {
  if (name.startsWith('base:')) {
    router.push({ name: 'base-component', params: { name: name.slice(5) } })
    return
  }
  router.push({ name })
}

function isLeafActive(item: { key: string; routeName?: string; params?: Record<string, string> }) {
  if (item.key === activeTabId.value) return true
  if (item.routeName === 'base-overview' && route.name === 'base-overview') return true
  return false
}

function closeTab(name: string) {
  const idx = tabs.value.findIndex((tab) => tab.name === name)
  if (idx < 0) return
  const next = tabs.value.filter((tab) => tab.name !== name)
  tabs.value = next
  if (activeTabId.value === name) {
    const fallback = next[Math.max(0, idx - 1)]
    if (fallback) openTab(fallback.name)
    else router.push({ name: 'dashboard' })
  }
}

function handleLogout() {
  logout()
  tabs.value = []
  router.push({ name: 'login' })
  ToastService.success({
    summary: t(LocaleKeys.common.success),
    detail: t(LocaleKeys.tip.signedOut)
  })
}

void isAdmin
</script>

<template>
  <div class="ln-shell" :class="{ 'ln-shell--collapsed': collapsed }">
    <div class="ln-shell__workspace">
      <aside class="ln-sidebar">
        <div class="ln-sidebar__header">
          <a class="ln-sidebar__brand" href="#" @click.prevent="openTab('dashboard')">
            <span class="ln-sidebar__brand-mark">VP</span>
            <span v-if="!collapsed" class="ln-sidebar__brand-text">AMG-WebUI</span>
          </a>
          <button
            type="button"
            class="ln-sidebar__toggle"
            :title="collapsed ? t(LocaleKeys.common.expandMenu) : t(LocaleKeys.common.collapseMenu)"
            :aria-label="collapsed ? t(LocaleKeys.common.expandMenu) : t(LocaleKeys.common.collapseMenu)"
            @click="toggleSidebar"
          >
            <Icon :name="collapsed ? 'ChevronRight' : 'ChevronLeft'" size="sm" />
          </button>
        </div>

        <nav class="ln-nav" :aria-label="t(LocaleKeys.nav.primary)">
          <div v-if="!collapsed" class="ln-nav__filter">
            <label class="ln-nav__filter-label" for="ln-nav-base-filter">{{
              t('example.doc.catalog.navFilter')
            }}</label>
            <input
              id="ln-nav-base-filter"
              v-model="navFilter"
              type="search"
              class="ln-nav__filter-input"
              :placeholder="t(LocaleKeys.common.search)"
            />
          </div>

          <section v-for="group in navGroups" :key="group.group" class="ln-nav__group">
            <h2 v-if="!collapsed" class="ln-nav__group-title">{{ group.title }}</h2>

            <template v-for="item in group.items" :key="item.key">
              <!-- Collapsible category -->
              <div v-if="item.children?.length" class="ln-nav__subtree">
                <button
                  type="button"
                  class="ln-nav__link ln-nav__link--folder"
                  :aria-expanded="isCategoryOpen(item.key)"
                  :title="collapsed ? item.label : undefined"
                  @click="toggleCategory(item.key)"
                >
                  <span class="ln-nav__icon">
                    <Icon :name="item.icon || 'Box'" size="sm" />
                  </span>
                  <span class="ln-nav__label">{{ item.label }}</span>
                  <span v-if="!collapsed" class="ln-nav__chevron">
                    <Icon :name="isCategoryOpen(item.key) ? 'ChevronDown' : 'ChevronRight'" size="sm" />
                  </span>
                </button>
                <div v-if="!collapsed && isCategoryOpen(item.key)" class="ln-nav__children">
                  <button
                    v-for="child in item.children"
                    :key="child.key"
                    type="button"
                    class="ln-nav__link ln-nav__link--child"
                    :class="{ 'ln-nav__link--active': isLeafActive(child) }"
                    :title="child.label"
                    @click="openNavItem(child)"
                  >
                    <span class="ln-nav__label">{{ child.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Leaf link -->
              <button
                v-else
                type="button"
                class="ln-nav__link"
                :class="{ 'ln-nav__link--active': isLeafActive(item) }"
                :title="collapsed ? item.label : undefined"
                @click="openNavItem(item)"
              >
                <span class="ln-nav__icon">
                  <Icon :name="item.icon || 'Activity'" size="sm" />
                </span>
                <span class="ln-nav__label">{{ item.label }}</span>
              </button>
            </template>
          </section>
        </nav>

        <div class="ln-sidebar__user">
          <div class="ln-sidebar__profile" :title="collapsed ? currentUser?.username : undefined">
            <span class="ln-sidebar__avatar">{{ userInitial }}</span>
            <div v-if="!collapsed" class="ln-sidebar__meta">
              <div class="ln-sidebar__account-row">
                <span class="ln-sidebar__name" :title="currentUser?.username">{{ currentUser?.username }}</span>
                <span class="ln-sidebar__logout-cluster">
                  <span class="ln-sidebar__sep" aria-hidden="true">|</span>
                  <button
                    type="button"
                    class="ln-sidebar__logout"
                    @click="handleLogout"
                  >
                    {{ t(LocaleKeys.auth.signOut) }}
                  </button>
                </span>
              </div>
              <span class="ln-sidebar__role">{{ isAdmin ? t(LocaleKeys.common.admin) : t(LocaleKeys.common.user) }}</span>
            </div>
            <button
              v-else
              type="button"
              class="ln-sidebar__logout ln-sidebar__logout--icon"
              :title="t(LocaleKeys.auth.signOut)"
              :aria-label="t(LocaleKeys.auth.signOut)"
              @click="handleLogout"
            >
              <Icon name="X" size="sm" />
            </button>
          </div>
        </div>
      </aside>

      <div class="ln-main">
        <header class="ln-header">
          <h1 class="ln-header__title" :title="pageTitle">{{ pageTitle }}</h1>
          <div class="ln-header__actions">
            <AppHeaderActions />
          </div>
        </header>

        <div v-if="tabViews.length" class="ln-tabs" role="tablist" :aria-label="t(LocaleKeys.common.openTabs)">
          <div
            v-for="tab in tabViews"
            :key="tab.name"
            class="ln-tabs__item"
            :class="{ 'ln-tabs__item--active': activeTabId === tab.name }"
            role="presentation"
          >
            <button
              type="button"
              class="ln-tabs__label"
              role="tab"
              :aria-selected="activeTabId === tab.name"
              :title="tab.title"
              @click="openTab(tab.name)"
            >
              {{ tab.title }}
            </button>
            <button
              type="button"
              class="ln-tabs__close"
              :title="t(LocaleKeys.common.close)"
              :aria-label="t(LocaleKeys.common.closeTab)"
              @click.stop="closeTab(tab.name)"
            >
              <Icon name="X" size="sm" />
            </button>
          </div>
        </div>

        <main class="ln-content">
          <RouterView />
        </main>
      </div>
    </div>

    <footer class="ln-footer">
      <span>{{ t(LocaleKeys.chrome.brandFoot) }}</span>
      <span>base · business · theme · hooks</span>
    </footer>
  </div>
</template>
