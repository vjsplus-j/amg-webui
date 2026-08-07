<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Layout, Sider, Header, Main, Menu, Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { ThemeService } from '@amg-webui/theme'

import type { ShowcaseNavItem } from '../types/nav'

const props = defineProps<{
  appTitle: string
  navItems: ShowcaseNavItem[]
  mobile?: boolean
}>()

const route = useRoute()
const router = useRouter()
const { t, locale, setLocale } = useLocale()

const activePath = computed(() => route.path)

const menuItems = computed(() =>
  props.navItems.map((item) => ({
    key: item.path,
    label: item.label
  }))
)

function onMenuSelect(key: string) {
  if (key !== route.path) router.push(key)
}

function toggleLocale() {
  setLocale(locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
}

function toggleTheme() {
  ThemeService.toggleTheme()
}
</script>

<template>
  <Layout
    class="showcase-shell"
    :class="{ 'showcase-layout--mobile': mobile }"
  >
    <Sider v-if="!mobile" class="showcase-sider" collapsible>
      <div class="showcase-shell__brand">{{ appTitle }}</div>
      <Menu
        :items="menuItems"
        :model-value="activePath"
        @select="(item) => onMenuSelect(item.key)"
      />
    </Sider>
    <Layout>
      <Header class="showcase-header">
        <strong v-if="mobile" class="showcase-shell__brand showcase-shell__brand--mobile">
          {{ appTitle }}
        </strong>
        <nav v-if="mobile" class="showcase-mobile-nav">
          <Button
            v-for="item in navItems"
            :key="item.path"
            size="sm"
            :severity="item.path === activePath ? 'primary' : 'default'"
            :label="item.label"
            @click="onMenuSelect(item.path)"
          />
        </nav>
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
      <Main class="showcase-main">
        <slot />
      </Main>
    </Layout>
  </Layout>
</template>

<style scoped lang="scss">
.showcase-shell__brand {
  padding: 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--theme-border, #e2e8f0);
}

.showcase-shell__brand--mobile {
  border: 0;
  padding: 0;
}

.showcase-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-inline: 16px;
}

.showcase-header__actions {
  display: flex;
  gap: 8px;
  margin-inline-start: auto;
}

.showcase-mobile-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.showcase-main {
  min-height: calc(100vh - 56px);
}
</style>
