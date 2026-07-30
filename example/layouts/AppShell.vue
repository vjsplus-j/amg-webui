<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'
import { ToastService } from '@amg-webui/theme'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  Layout,
  Sider,
  Header,
  Main,
  Footer,
  Menu,
  TabsNav,
  Icon
} from '@amg-webui/components/base'
import type { MenuBadge, MenuItem } from '@amg-webui/components/base/Menu'
import AppHeaderActions from '../components/AppHeaderActions.vue'
import {
  getShellNavItems,
  resolveRouteTitle,
  routeTabId,
  type ShellNavChild,
  type ShellNavItem
} from '../router/routes'
import { getCatalogEntry } from '../component-catalog'
import { resolveComponentBadges } from '../nav-component-badges'

const route = useRoute()
const router = useRouter()
const { logout, isAdmin, currentUser } = useAuth()
const { t, locale } = useLocale()

const collapsed = ref(localStorage.getItem('ln-sidebar-collapsed') === '1')
const tabs = ref<{ name: string; titleKey?: string; fallback: string }[]>([])
const navFilter = ref('')

const openCategories = ref<Record<string, boolean>>(
  JSON.parse(localStorage.getItem('ln-nav-open-cats-v2') || '{}')
)

const componentParam = computed(() => String(route.params.name ?? ''))

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

function childLabel(child: ShellNavChild): string {
  return child.label
}

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

function toMenuLeaf(item: {
  key: string
  label: string
  icon?: string
  routeName?: string
  params?: Record<string, string>
}): MenuItem {
  const componentName = item.params?.name
  return {
    key: item.key,
    label: item.label,
    icon: item.icon,
    badges: resolveComponentBadges(componentName, t),
    meta: {
      routeName: item.routeName,
      params: item.params
    }
  }
}

const menuItems = computed<MenuItem[]>(() => {
  void locale.value
  return navGroups.value.map((group) => ({
    key: `nav-group-${group.group}`,
    type: 'group' as const,
    label: group.title,
    children: group.items.map((item) => {
      if (item.children?.length) {
        return {
          key: item.key,
          label: item.label,
          icon: item.icon || 'Box',
          children: item.children.map((c) => toMenuLeaf(c))
        }
      }
      return toMenuLeaf({
        key: item.key,
        label: item.label,
        icon: item.icon || 'Activity',
        routeName: item.routeName,
        params: item.params
      })
    })
  }))
})

const openKeys = computed({
  get() {
    const keys: string[] = []
    for (const group of navGroups.value) {
      for (const item of group.items) {
        if (!item.children?.length) continue
        if (navFilter.value.trim()) {
          keys.push(item.key)
          continue
        }
        if (openCategories.value[item.key] != null) {
          if (openCategories.value[item.key]) keys.push(item.key)
        } else if (activeCategoryKey() === item.key || item.key.startsWith('base-cat-')) {
          keys.push(item.key)
        }
      }
    }
    return keys
  },
  set(keys: string[]) {
    const next: Record<string, boolean> = { ...openCategories.value }
    for (const group of navGroups.value) {
      for (const item of group.items) {
        if (!item.children?.length) continue
        next[item.key] = keys.includes(item.key)
      }
    }
    openCategories.value = next
    persistOpenCategories()
  }
})

const activeTabId = computed(() => routeTabId(route) || '')

const menuModel = computed({
  get: () => activeTabId.value,
  set: () => {
    /* selection handled in onMenuSelect */
  }
})

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
    label: tab.titleKey ? t(tab.titleKey, undefined, tab.fallback) : tab.fallback,
    closable: true
  }))
)

function activeCategoryKey(): string | null {
  if (route.name !== 'base-component' || !componentParam.value) return null
  const entry = getCatalogEntry(componentParam.value)
  return entry ? `base-cat-${entry.category}` : null
}

function persistOpenCategories() {
  localStorage.setItem('ln-nav-open-cats-v2', JSON.stringify(openCategories.value))
}

function ensureMenuOpenForActivePage() {
  const key = activeCategoryKey()
  if (!key) return
  if (openCategories.value[key] === true) return
  openCategories.value = { ...openCategories.value, [key]: true }
  persistOpenCategories()
}

function scrollActiveNavIntoView() {
  if (collapsed.value) return
  const el = document.querySelector('.vp-menu__item--active')
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

watch(collapsed, (val) => {
  localStorage.setItem('ln-sidebar-collapsed', val ? '1' : '0')
})

function openNavItem(item: { routeName?: string; params?: Record<string, string>; key: string }) {
  if (!item.routeName) return
  if (item.params) {
    router.push({ name: item.routeName, params: item.params })
    return
  }
  router.push({ name: item.routeName })
}

function onMenuSelect(item: MenuItem) {
  const routeName = item.meta?.routeName as string | undefined
  const params = item.meta?.params as Record<string, string> | undefined
  openNavItem({ key: item.key, routeName, params })
}

function openTab(name: string) {
  if (name.startsWith('base:')) {
    router.push({ name: 'base-component', params: { name: name.slice(5) } })
    return
  }
  router.push({ name })
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

function onTabsReorder(next: { name: string; label: string; closable?: boolean }[]) {
  const byName = new Map(tabs.value.map((tab) => [tab.name, tab]))
  tabs.value = next.map((item) => byName.get(item.name)).filter(Boolean) as typeof tabs.value
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

function goDashboard() {
  openTab('dashboard')
}

void isAdmin
</script>

<template>
  <Layout shell has-sider class="vp-app-shell">
    <Sider v-model:collapsed="collapsed" collapsible>
      <template #header>
        <a class="vp-app-shell__brand" href="#" @click.prevent="goDashboard">
          <span class="vp-app-shell__brand-mark">VP</span>
          <span v-if="!collapsed" class="vp-app-shell__brand-text">AMG-WebUI</span>
        </a>
      </template>

      <div v-if="!collapsed" class="vp-app-shell__filter">
        <label class="vp-app-shell__filter-label" for="vp-nav-base-filter">{{
          t('example.doc.catalog.navFilter')
        }}</label>
        <input
          id="vp-nav-base-filter"
          v-model="navFilter"
          type="search"
          class="vp-app-shell__filter-input"
          :placeholder="t(LocaleKeys.common.search)"
        />
      </div>

      <Menu
        :model-value="menuModel"
        :items="menuItems"
        v-model:open-keys="openKeys"
        :collapsed="collapsed"
        @select="onMenuSelect"
      />

      <template #footer>
        <div class="vp-app-shell__user" :title="collapsed ? currentUser?.username : undefined">
          <span class="vp-app-shell__avatar">{{ userInitial }}</span>
          <div v-if="!collapsed" class="vp-app-shell__meta">
            <div class="vp-app-shell__account-row">
              <span class="vp-app-shell__name" :title="currentUser?.username">{{
                currentUser?.username
              }}</span>
              <span class="vp-app-shell__logout-cluster">
                <span class="vp-app-shell__sep" aria-hidden="true">|</span>
                <button type="button" class="vp-app-shell__logout" @click="handleLogout">
                  {{ t(LocaleKeys.auth.signOut) }}
                </button>
              </span>
            </div>
            <span class="vp-app-shell__role">{{
              isAdmin ? t(LocaleKeys.common.admin) : t(LocaleKeys.common.user)
            }}</span>
          </div>
          <button
            v-else
            type="button"
            class="vp-app-shell__logout vp-app-shell__logout--icon"
            :title="t(LocaleKeys.auth.signOut)"
            :aria-label="t(LocaleKeys.auth.signOut)"
            @click="handleLogout"
          >
            <Icon name="X" size="sm" />
          </button>
        </div>
      </template>
    </Sider>

    <Layout>
      <Header>
        <template #title>
          <h1 :title="pageTitle">{{ pageTitle }}</h1>
        </template>
        <template #actions>
          <AppHeaderActions />
        </template>
      </Header>

      <TabsNav
        v-if="tabViews.length"
        :model-value="activeTabId"
        :items="tabViews"
        closable
        draggable
        @update:model-value="openTab"
        @update:items="onTabsReorder"
        @close="closeTab"
      />

      <Main>
        <RouterView />
      </Main>

      <Footer>
        <span>{{ t(LocaleKeys.chrome.brandFoot) }}</span>
        <span>{{ t(LocaleKeys.chrome.stackLayers) }}</span>
      </Footer>
    </Layout>
  </Layout>
</template>

<style scoped>
.vp-app-shell__filter {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-sm);
}

.vp-app-shell__brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-width: 0;
  text-decoration: none;
  color: inherit;
}

.vp-app-shell__brand-mark {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: var(--height-md);
  height: var(--height-md);
  border-radius: var(--border-radius-md);
  background: var(--primary-500);
  color: var(--text-on-primary, var(--surface-0));
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold, 700);
}

.vp-app-shell__brand-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium, 500);
  color: var(--text-primary);
}

.vp-app-shell__filter-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.vp-app-shell__filter-input {
  width: 100%;
  min-height: var(--height-sm);
  padding: 0 var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  background: var(--surface-1);
  color: var(--text-primary);
  font: inherit;
  font-size: var(--font-size-sm);
  box-sizing: border-box;
}

.vp-app-shell__filter-input:focus {
  outline: none;
  border-color: var(--ds-accent);
  box-shadow: 0 0 0 1px var(--ds-focus-ring, var(--ds-accent));
}

.vp-app-shell__user {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 0;
  padding: var(--spacing-xs);
}

.vp-app-shell__avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: var(--height-md);
  height: var(--height-md);
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium, 500);
}

.vp-app-shell__meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
  flex: 1;
}

.vp-app-shell__account-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.vp-app-shell__name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.vp-app-shell__logout-cluster {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.vp-app-shell__sep {
  color: var(--text-muted);
}

.vp-app-shell__logout {
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  color: var(--text-secondary);
  font: inherit;
  font-size: var(--font-size-xs);
  cursor: pointer;
}

.vp-app-shell__logout:hover {
  color: var(--text-primary);
}

.vp-app-shell__logout--icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--height-md);
  height: var(--height-md);
  border-radius: var(--border-radius-md);
  color: var(--text-muted);
}

.vp-app-shell__logout--icon:hover {
  color: var(--text-primary);
  background: var(--surface-5);
}

.vp-app-shell__role {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
</style>
