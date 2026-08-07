<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Layout, Header, Main } from '@amg-webui/core'
import { Drawer } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { ThemeService } from '@amg-webui/theme'
import type { ShowcaseNavItem } from '../types/nav'

const props = defineProps<{
  appTitle: string
  navItems: ShowcaseNavItem[]
}>()

const route = useRoute()
const router = useRouter()
const { t, locale, setLocale } = useLocale()
const drawerOpen = ref(false)

const activePath = computed(() => route.path)

function navigate(path: string) {
  drawerOpen.value = false
  if (path !== route.path) router.push(path)
}

function toggleLocale() {
  setLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
}

function toggleTheme() {
  ThemeService.toggleTheme()
}
</script>

<template>
  <Layout class="showcase-shell showcase-layout--mobile">
    <Header class="showcase-header showcase-header--mobile">
      <Button
        size="sm"
        variant="outlined"
        aria-label="Open navigation"
        label="☰"
        @click="drawerOpen = true"
      />
      <strong class="showcase-shell__brand showcase-shell__brand--mobile">
        {{ appTitle }}
      </strong>
      <div class="showcase-header__actions">
        <Button
          size="sm"
          variant="outlined"
          :label="locale === 'zh-CN' ? 'EN' : '中文'"
          @click="toggleLocale"
        />
        <Button
          size="sm"
          variant="outlined"
          :label="t(LocaleKeys.tip.theme, undefined, 'Theme')"
          @click="toggleTheme"
        />
      </div>
    </Header>

    <Main class="showcase-main showcase-main--mobile">
      <slot />
    </Main>

    <Drawer v-model:visible="drawerOpen" title="Navigation" placement="left" size="sm">
      <nav class="showcase-drawer-nav">
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          class="showcase-drawer-nav__item"
          :class="{ 'showcase-drawer-nav__item--active': item.path === activePath }"
          @click="navigate(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>
    </Drawer>
  </Layout>
</template>

<style scoped lang="scss">
.showcase-header--mobile {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--theme-surface, #fff);
  border-bottom: 1px solid var(--theme-border, #e2e8f0);
}

.showcase-main--mobile {
  min-height: calc(100vh - 56px);
  padding-bottom: 24px;
}

.showcase-drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.showcase-drawer-nav__item {
  padding: 12px 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  text-align: start;
  font: inherit;
  cursor: pointer;
}

.showcase-drawer-nav__item--active {
  background: color-mix(in srgb, var(--theme-primary, #2563eb) 12%, transparent);
  color: var(--theme-primary, #2563eb);
  font-weight: 600;
}
</style>
